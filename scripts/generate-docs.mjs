#!/usr/bin/env node
/**
 * scripts/generate-docs.mjs
 *
 * Reads every *.ts file in src/schemas/ and writes ARCHITECTURE.md with
 * Markdown tables derived directly from the Zod schema definitions.
 *
 * Usage:
 *   npm run docs:generate
 *
 * This script uses static text analysis — no TypeScript compilation required.
 * Re-run whenever you add, remove, or change a schema to keep docs in sync.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const SCHEMAS   = join(ROOT, 'src', 'schemas');
const OUTPUT    = join(ROOT, 'ARCHITECTURE.md');

// ─── Balanced-block extractor ────────────────────────────────────────────────
/**
 * Scan `src` from `startIdx` looking for the first occurrence of `open`,
 * then return the slice up to (but not including) the matching `close`.
 * Handles nested pairs and ignores characters inside string literals.
 */
function extractBalanced(src, startIdx, open, close) {
  let i = src.indexOf(open, startIdx);
  if (i === -1) return { content: null, end: -1 };
  let depth = 0, inStr = false, strCh = '';
  const bodyStart = i;
  while (i < src.length) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === strCh) inStr = false;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; }
      else if (ch === open)  depth++;
      else if (ch === close) { depth--; if (depth === 0) return { content: src.slice(bodyStart + 1, i), end: i }; }
    }
    i++;
  }
  return { content: null, end: -1 };
}

/** Strip inline JSDoc / block comments from a string */
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

/** Parse comma-separated enum values from a raw block-extracted string */
function parseEnumValues(content) {
  return stripComments(content)
    .split(',')
    .map(v => v.trim().replace(/^['"]|['"]$/g, '').trim())
    .filter(Boolean);
}
/**
 * Convert a raw Zod type expression string (as it appears in source) into a
 * human-readable Markdown type description.
 */
function describeZodExpr(raw) {
  if (!raw) return '—';
  let expr = raw.trim().replace(/\s+/g, ' ');
  // .describe("...") is informational only — strip before analysis
  expr = expr.replace(/\.describe\([^)]*\)\s*$/, '');
  // Only detect nullable/optional when they are TRAILING modifiers on the outermost call
  const isNullable = /\.nullable\(\)(?:\.optional\(\))?\s*$/.test(expr);
  const isOptional = /\.optional\(\)\s*$/.test(expr);
  // Strip trailing modifiers before resolving the base type
  const base = expr
    .replace(/\.optional\(\)\s*$/, '')
    .replace(/\.nullable\(\)\s*$/, '')
    .replace(/\.optional\(\)\s*$/, '') // second pass: handles .nullable().optional()
    .trim();
  let type = resolveBaseType(base);
  if (isNullable) type += ' \\| null';
  if (isOptional) type = `${type}?`;
  return type;
}

function resolveBaseType(expr) {
  if (!expr) return '—';

  // Primitives
  if (expr === 'z.boolean()') return '`boolean`';
  if (expr === 'z.void()')    return '`void`';

  // z.string() — with constraints
  if (expr === 'z.string()' || expr.startsWith('z.string().')) {
    if (expr.includes('.email()'))    return '`string` (email)';
    if (expr.includes('.url()'))      return '`string` (url)';
    if (expr.includes('.datetime()')) return '`string` (ISO 8601 datetime)';
    if (expr.includes('.uuid()'))     return '`string` (uuid)';
    const c = [];
    if (expr.includes('.regex(')) c.push('pattern');
    const min = expr.match(/\.min\((\d+)\)/); if (min) c.push(`min: ${min[1]}`);
    const max = expr.match(/\.max\((\d+)\)/); if (max) c.push(`max: ${max[1]}`);
    return c.length ? `\`string\` (${c.join(', ')})` : '`string`';
  }

  // z.number() — with constraints
  if (expr === 'z.number()' || expr.startsWith('z.number().')) {
    const c = [];
    if (expr.includes('.int()'))      c.push('int');
    if (expr.includes('.positive()')) c.push('positive');
    const min = expr.match(/\.min\((\d+)\)/); if (min) c.push(`min: ${min[1]}`);
    const max = expr.match(/\.max\((\d+)\)/); if (max) c.push(`max: ${max[1]}`);
    return c.length ? `\`number\` (${c.join(', ')})` : '`number`';
  }

  // z.literal("value")
  if (expr.startsWith('z.literal(')) {
    const m = expr.match(/z\.literal\((.+)\)/);
    return m ? m[1] : '`literal`';
  }

  // z.enum(["a","b",...])
  if (expr.startsWith('z.enum(')) {
    const { content } = extractBalanced(expr, expr.indexOf('z.enum(') + 6, '[', ']');
    if (!content) return '`enum`';
    const vals = parseEnumValues(content);
    return vals.map(v => `\`${v}\``).join(' \\| ');
  }

  // z.array(innerType)
  if (expr.startsWith('z.array(')) {
    const { content } = extractBalanced(expr, expr.indexOf('z.array(') + 7, '(', ')');
    return content ? `${describeZodExpr(content)}[]` : '`array`';
  }

  // z.record(K, V)
  if (expr.startsWith('z.record(')) return '`Record<...>`';

  // z.function({...})
  if (expr.startsWith('z.function(')) return '`function`';

  // z.tuple([...])
  if (expr.startsWith('z.tuple(')) return '`tuple`';

  // z.object({...})  — inline nested object
  if (expr.startsWith('z.object(')) return '`object`';

  // PascalCase reference — schema alias or shared primitive
  if (/^[A-Z]/.test(expr)) {
    const name = expr.split(/[.(]/)[0]; // identifier before any . or (
    return `\`${name.replace(/Schema$/, '')}\``;
  }

  return `\`${expr.slice(0, 40)}${expr.length > 40 ? '…' : ''}\``;
}

// ─── Object-field parser ──────────────────────────────────────────────────────
/**
 * Count how many unclosed brackets/parens are open in a string.
 * Used to detect multi-line type expressions.
 */
function openDepth(s) {
  let d = 0, inStr = false, strCh = '';
  for (const ch of s) {
    if (inStr) { if (ch === strCh) inStr = false; }
    else {
      if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; }
      else if ('([{'.includes(ch)) d++;
      else if (')]}'.includes(ch)) d--;
    }
  }
  return d;
}

/**
 * Parse the raw body of a `z.object({...})` into an array of field descriptors.
 * Handles single-line JSDoc comments, multi-line type expressions, and optional fields.
 */
function parseObjectFields(body) {
  const fields = [];
  const lines   = body.split('\n');
  let i          = 0;
  let pendingDoc = '';

  while (i < lines.length) {
    const line = lines[i].trim();

    // Single-line JSDoc field comment: /** text */
    if (line.startsWith('/**')) {
      pendingDoc = line.replace(/\/\*\*|\*\//g, '').replace(/\*\s?/g, '').trim();
      i++;
      continue;
    }

    // Skip other comment lines, empty lines, and stray braces
    if (!line || line === '{' || line === '}' || line.startsWith('//') ||
        line.startsWith('* ') || line === '*' || line === '*/') {
      if (!line) pendingDoc = ''; // blank line resets pending comment
      i++;
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const fieldName = line.slice(0, colonIdx).trim();
      // Must be a plain identifier (no spaces); skip z.object-style inline entries
      if (/^\w+$/.test(fieldName) && fieldName !== 'input' && fieldName !== 'output') {
        // Collect potentially multi-line type expression
        let typeRaw = line.slice(colonIdx + 1).trim().replace(/,\s*$/, '');
        while (openDepth(typeRaw) > 0 && i + 1 < lines.length) {
          i++;
          typeRaw += ' ' + lines[i].trim().replace(/,\s*$/, '');
        }

        const isOptional = /\.optional\(\)/.test(typeRaw);
        fields.push({
          name:     fieldName,
          type:     describeZodExpr(typeRaw),
          required: isOptional ? '' : '✓',
          notes:    pendingDoc || '—',
        });
        pendingDoc = '';
      }
    }

    i++;
  }

  return fields;
}

// ─── Section-comment parser ───────────────────────────────────────────────────
/**
 * Find all section divider comments of the form:
 *
 *   // ---...---
 *   // Section Title
 *   // ---...---
 *
 * Returns [{title, position}] sorted by position.
 */
function extractSections(src) {
  const sections = [];
  const re = /\/\/ -{10,}\n\/\/ ([^\n]+)\n\/\/ -{10,}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    sections.push({ title: m[1].trim(), position: m.index });
  }
  return sections;
}

// ─── Schema extractor ─────────────────────────────────────────────────────────
const EXTRA_EXPORTS = new Set(['ISODateString', 'HexColor', 'CSSColor', 'ROUTES', 'NAV_ITEMS']);

function isRelevantExport(name) {
  return name.endsWith('Schema') || EXTRA_EXPORTS.has(name);
}

/**
 * Extract every relevant exported Zod schema from a TypeScript source string.
 * Handles: z.object, z.enum, z.string/number/boolean primitives, derived schemas,
 * ROUTES array, and NAV_ITEMS array.
 */
function extractSchemas(src) {
  const schemas = [];
  // Handle both plain "= " and type-annotated "Name: Type = " forms
  const re = /^export\s+const\s+(\w+)(?:\s*:[^=\n]+)?\s*=\s*/gm;
  let m;

  while ((m = re.exec(src)) !== null) {
    const name     = m[1];
    if (!isRelevantExport(name)) continue;

    const defStart = m.index + m[0].length;
    const comment  = extractPrecedingComment(src, m.index);
    // Peek up to 200 chars to classify the definition
    const peek     = src.slice(defStart, defStart + 200).trimStart();

    if (peek.startsWith('z.object(')) {
      const { content } = extractBalanced(src, defStart, '{', '}');
      if (content !== null) {
        schemas.push({ name, kind: 'object', body: content, position: m.index, comment });
      }

    } else if (peek.startsWith('z.enum(')) {
      const { content } = extractBalanced(src, defStart, '[', ']');
      if (content !== null) {
        const vals = parseEnumValues(content);
        schemas.push({ name, kind: 'enum', values: vals, position: m.index, comment });
      }

    } else if (peek.startsWith('z.string()') || peek.startsWith('z.number()') || peek.startsWith('z.boolean()')) {
      const lineEnd = src.indexOf('\n', defStart);
      const expr = src.slice(defStart, lineEnd < 0 ? undefined : lineEnd).trim().replace(/;\s*$/, '');
      schemas.push({ name, kind: 'primitive', expr, position: m.index, comment });

    } else if (name === 'ROUTES') {
      const { content } = extractBalanced(src, defStart, '[', ']');
      schemas.push({ name, kind: 'routes', body: content || '', position: m.index, comment });

    } else if (name === 'NAV_ITEMS') {
      const { content } = extractBalanced(src, defStart, '[', ']');
      schemas.push({ name, kind: 'nav', body: content || '', position: m.index, comment });

    } else {
      // Derived schema (alias, .omit(), .partial(), .extend(), etc.)
      const lineEnd = src.indexOf('\n', defStart);
      const expr = src.slice(defStart, lineEnd < 0 ? undefined : lineEnd).trim().replace(/;\s*$/, '');
      if (expr && /^[A-Z]/.test(expr)) {
        schemas.push({ name, kind: 'derived', expr, position: m.index, comment });
      }
    }
  }

  return schemas;
}

/**
 * Retrieve the JSDoc comment (`/** ... *\/`) immediately preceding `pos`.
 */
function extractPrecedingComment(src, pos) {
  const before = src.slice(0, pos).trimEnd();
  if (!before.endsWith('*/')) return '';
  const start = before.lastIndexOf('/**');
  if (start === -1) return '';
  return before.slice(start)
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .replace(/^\s*\*\s?/gm, '')
    .trim();
}

// ─── Section assignment ───────────────────────────────────────────────────────
function assignSections(schemas, sections) {
  return schemas.map(schema => {
    let section = 'General';
    for (const s of sections) {
      if (s.position <= schema.position) section = s.title;
      else break;
    }
    return { ...schema, section };
  });
}

// ─── Markdown renderers ───────────────────────────────────────────────────────
function renderSchema(schema) {
  const displayName = schema.name.replace(/Schema$/, '');
  let md = `### \`${displayName}\`\n\n`;
  if (schema.comment) md += `> ${schema.comment}\n\n`;

  switch (schema.kind) {
    case 'object': {
      const fields = parseObjectFields(schema.body);
      if (!fields.length) {
        md += '_No fields._\n';
      } else {
        md += '| Field | Type | Required | Notes |\n';
        md += '|---|---|:---:|---|\n';
        for (const f of fields) {
          md += `| \`${f.name}\` | ${f.type} | ${f.required} | ${f.notes} |\n`;
        }
      }
      break;
    }
    case 'enum': {
      md += '| Value |\n|---|\n';
      for (const v of schema.values) md += `| \`${v}\` |\n`;
      break;
    }
    case 'primitive': {
      md += `**Type:** ${describeZodExpr(schema.expr)}\n`;
      break;
    }
    case 'derived': {
      // Pure alias e.g. "MeResponseSchema = AuthUserSchema"
      if (/^[A-Z][A-Za-z0-9]+Schema$/.test(schema.expr)) {
        const target = schema.expr.replace(/Schema$/, '');
        md += `_Alias for [\`${target}\`](#${target.toLowerCase()})._\n`;
      } else {
        // Transformation e.g. "ProjectSchema.omit({...}).partial()"
        const baseM = schema.expr.match(/^([A-Z][A-Za-z0-9]+Schema)/);
        const base  = baseM ? baseM[1].replace(/Schema$/, '') : '?';
        // Extract the first method name only (omit, partial, extend, pick)
        const opM   = schema.expr.match(/\.(omit|partial|extend|pick|merge)\(/);
        const op    = opM ? `.${opM[1]}(…)` : '';
        md += `_Derived from [\`${base}\`](#${base.toLowerCase()})_`;
        if (op) md += ` · \`${op}\``;
        md += '\n';
      }
      break;
    }
    case 'routes': {
      md += renderRoutes(schema.body);
      break;
    }
    case 'nav': {
      md += renderNav(schema.body);
      break;
    }
    default:
      md += '_Unknown schema kind._\n';
  }

  return md + '\n';
}

function renderRoutes(body) {
  if (!body) return '_No route data._\n';
  const rows = [];
  const re = /\{\s*path:\s*"([^"]+)"[^}]*page:\s*"([^"]+)"[^}]*auth:\s*(true|false)[^}]*layout:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    rows.push({ path: m[1], page: m[2], auth: m[3] === 'true', layout: m[4] });
  }
  if (!rows.length) return '_Could not parse route entries._\n';
  let md = '| Path | Page Component | Auth Required | Layout |\n|---|---|:---:|---|\n';
  for (const r of rows) {
    md += `| \`${r.path}\` | \`${r.page}\` | ${r.auth ? '✓' : ''} | \`${r.layout}\` |\n`;
  }
  return md;
}

function renderNav(body) {
  if (!body) return '_No nav data._\n';
  const rows = [];
  const re = /\{\s*key:\s*"([^"]+)"[^}]*path:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(body)) !== null) rows.push({ key: m[1], path: m[2] });
  if (!rows.length) return '_Could not parse nav items._\n';
  let md = '| Label | Route |\n|---|---|\n';
  for (const r of rows) md += `| ${r.key} | \`${r.path}\` |\n`;
  return md;
}

// ─── Section title helpers ────────────────────────────────────────────────────
function cleanTitle(raw) {
  // Normalise multiple spaces (e.g. "Auth API  —  /api/auth/*")
  return raw.replace(/\s{2,}/g, ' ');
}

function titleToAnchor(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+$/, '');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  const files = readdirSync(SCHEMAS).filter(f => extname(f) === '.ts').sort();
  if (!files.length) {
    console.error(`[generate-docs] No .ts files found in ${SCHEMAS}`);
    process.exit(1);
  }

  let allSchemas  = [];
  let allSections = [];

  for (const file of files) {
    const src = readFileSync(join(SCHEMAS, file), 'utf8');
    allSchemas  = allSchemas.concat(extractSchemas(src));
    allSections = allSections.concat(extractSections(src));
  }

  allSections.sort((a, b) => a.position - b.position);
  allSchemas.sort((a, b) => a.position - b.position);

  const annotated = assignSections(allSchemas, allSections);

  // Group by section, preserving document order
  const sectionOrder = [];
  const bySection    = new Map();
  for (const s of annotated) {
    if (!bySection.has(s.section)) {
      sectionOrder.push(s.section);
      bySection.set(s.section, []);
    }
    bySection.get(s.section).push(s);
  }

  const today = new Date().toISOString().slice(0, 10);

  // ── Document header ──────────────────────────────────────────────────────
  let md = `# Powerframe BMS V1 Architecture\n\n`;
  md += `> Auto-generated from \`src/schemas/index.ts\` · Last updated: ${today}\n`;
  md += `> Run \`npm run docs:generate\` to regenerate after any schema change.\n\n`;
  md += `---\n\n`;

  // ── Table of contents ────────────────────────────────────────────────────
  md += `## Table of Contents\n\n`;
  sectionOrder.forEach((sec, idx) => {
    md += `${idx + 1}. [${cleanTitle(sec)}](#${titleToAnchor(sec)})\n`;
  });
  md += `\n---\n\n`;

  // ── Sections ─────────────────────────────────────────────────────────────
  for (const sec of sectionOrder) {
    md += `## ${cleanTitle(sec)}\n\n`;
    for (const schema of bySection.get(sec)) {
      md += renderSchema(schema);
    }
    md += `---\n\n`;
  }

  md += `_Generated by \`scripts/generate-docs.mjs\` · Powerframe BMS V1_\n`;

  writeFileSync(OUTPUT, md, 'utf8');

  const schemaCount = annotated.filter(s => !['routes', 'nav'].includes(s.kind)).length;
  console.log(
    `✓ ARCHITECTURE.md written` +
    ` — ${files.length} file(s), ${schemaCount} schemas,` +
    ` ${sectionOrder.length} sections`
  );
}

main();
