/**
 * Powerframe BMS V1 — Zod Schema Index
 *
 * Complete type-safe schema catalogue of every data model, API contract,
 * context shape, and route definition in the application.
 * Intended as the canonical reference for monorepo integration.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitives & Utilities
// ---------------------------------------------------------------------------

/** ISO date string, e.g. "2026-02-20" */
export const ISODateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected ISO date YYYY-MM-DD");

/** CSS hex colour, e.g. "#7c3aed" */
export const HexColor = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, "Expected hex colour");

/** CSS colour or gradient string (permissive) */
export const CSSColor = z.string().min(1);

// ---------------------------------------------------------------------------
// Auth API  —  /api/auth/*
// ---------------------------------------------------------------------------

/** POST /api/auth/login  — request body */
export const LoginRequestSchema = z.object({
  /** Username or e-mail address */
  username: z.string().min(1),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/** POST /api/auth/register  — request body */
export const RegisterRequestSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

/** Public user shape returned from auth endpoints */
export const AuthUserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  email: z.string().email(),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

/** Response body for POST /api/auth/login and POST /api/auth/register */
export const AuthResponseSchema = z.object({
  token: z.string(),
  user: AuthUserSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

/** Response body for GET /api/auth/me */
export const MeResponseSchema = AuthUserSchema;
export type MeResponse = z.infer<typeof MeResponseSchema>;

// ---------------------------------------------------------------------------
// Health API  —  /api/health
// ---------------------------------------------------------------------------

/** Response body for GET /api/health */
export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string().datetime(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

// ---------------------------------------------------------------------------
// Domain: User (internal store shape — server-side only)
// ---------------------------------------------------------------------------

export const UserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  email: z.string().email(),
  /** bcrypt-hashed password — never serialised to the client */
  password: z.string(),
});
export type User = z.infer<typeof UserSchema>;

// ---------------------------------------------------------------------------
// Domain: Project
// ---------------------------------------------------------------------------

export const ProjectSchema = z.object({
  /** Numeric timestamp ID (Date.now()) */
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string(),
  color: HexColor,
  createdAt: ISODateString,
});
export type Project = z.infer<typeof ProjectSchema>;

export const NewProjectInputSchema = ProjectSchema.omit({ id: true, createdAt: true });
export type NewProjectInput = z.infer<typeof NewProjectInputSchema>;

export const UpdateProjectInputSchema = NewProjectInputSchema.partial();
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;

// ---------------------------------------------------------------------------
// Domain: Task
// ---------------------------------------------------------------------------

export const TaskStatusSchema = z.enum(["pending", "in_progress", "completed"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskPrioritySchema = z.enum(["high", "medium", "low"]);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const TaskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
});
export type Task = z.infer<typeof TaskSchema>;

export const NewTaskInputSchema = z.object({
  title: z.string().min(1),
  priority: TaskPrioritySchema.default("medium"),
});
export type NewTaskInput = z.infer<typeof NewTaskInputSchema>;

// ---------------------------------------------------------------------------
// Domain: Calendar Event  (Plans page)
// ---------------------------------------------------------------------------

export const CalendarEventSchema = z.object({
  /** Day of month (1-31) */
  day: z.number().int().min(1).max(31),
  title: z.string().min(1),
  color: HexColor,
});
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

// ---------------------------------------------------------------------------
// Domain: File
// ---------------------------------------------------------------------------

export const FileTypeSchema = z.enum(["pdf", "figma", "doc", "archive", "image", "default"]);
export type FileType = z.infer<typeof FileTypeSchema>;

export const FileSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  type: FileTypeSchema,
  /** Human-readable size, e.g. "2.4 MB" */
  size: z.string(),
  modified: ISODateString,
});
export type File = z.infer<typeof FileSchema>;

// ---------------------------------------------------------------------------
// Domain: Outbox Message  (Out page)
// ---------------------------------------------------------------------------

export const MessageStatusSchema = z.enum(["sent", "draft"]);
export type MessageStatus = z.infer<typeof MessageStatusSchema>;

export const OutboxMessageSchema = z.object({
  id: z.number().int().positive(),
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().optional(),
  status: MessageStatusSchema,
  date: ISODateString,
});
export type OutboxMessage = z.infer<typeof OutboxMessageSchema>;

export const ComposeMessageInputSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().optional(),
});
export type ComposeMessageInput = z.infer<typeof ComposeMessageInputSchema>;

// ---------------------------------------------------------------------------
// Domain: Notification
// ---------------------------------------------------------------------------

export const NotificationTypeSchema = z.enum(["info", "success", "warning", "error"]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NotificationSchema = z.object({
  id: z.number().int().positive(),
  type: NotificationTypeSchema,
  title: z.string().min(1),
  message: z.string(),
  /** Relative time label, e.g. "2 hours ago" */
  time: z.string(),
  read: z.boolean(),
});
export type Notification = z.infer<typeof NotificationSchema>;

// ---------------------------------------------------------------------------
// Domain: Team Member  (Management page)
// ---------------------------------------------------------------------------

export const TeamRoleSchema = z.enum(["Owner", "Editor", "Viewer"]);
export type TeamRole = z.infer<typeof TeamRoleSchema>;

export const TeamMemberStatusSchema = z.enum(["active", "pending"]);
export type TeamMemberStatus = z.infer<typeof TeamMemberStatusSchema>;

export const TeamMemberSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  role: TeamRoleSchema,
  status: TeamMemberStatusSchema,
});
export type TeamMember = z.infer<typeof TeamMemberSchema>;

// ---------------------------------------------------------------------------
// UI: Dashboard Widget  (Overview page)
// ---------------------------------------------------------------------------

export const WidgetTypeSchema = z.enum([
  "tasks",
  "calendar",
  "files",
  "messages",
  "analytics",
  "notes",
  "team",
  "progress",
]);
export type WidgetType = z.infer<typeof WidgetTypeSchema>;

export const WidgetSchema = z.object({
  /** Unique widget instance ID (string timestamp) */
  id: z.string().min(1),
  type: WidgetTypeSchema,
  /** Grid column start (0-indexed) */
  x: z.number().int().min(0),
  /** Grid row start (0-indexed) */
  y: z.number().int().min(0),
  /** Column span */
  w: z.number().int().positive(),
  /** Row span */
  h: z.number().int().positive(),
});
export type Widget = z.infer<typeof WidgetSchema>;

export const DashboardTabSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  widgets: z.array(WidgetSchema),
});
export type DashboardTab = z.infer<typeof DashboardTabSchema>;

// ---------------------------------------------------------------------------
// UI: Theme  (ThemeContext)
// ---------------------------------------------------------------------------

export const ThemeKeySchema = z.enum([
  "default",
  "ocean",
  "forest",
  "sunset",
  "rose",
  "midnight",
  "ember",
  "gold",
]);
export type ThemeKey = z.infer<typeof ThemeKeySchema>;

export const ThemeSchema = z.object({
  name: z.string(),
  /** Glassmorphism background colour 1 (rgba) */
  bg1: z.string(),
  /** Glassmorphism background colour 2 (rgba) */
  bg2: z.string(),
  /** Full page background gradient */
  gradient: z.string(),
  /** Primary accent colour (hex) */
  accent: HexColor,
});
export type Theme = z.infer<typeof ThemeSchema>;

export const BgPresetTypeSchema = z.enum(["gradient", "solid"]);
export type BgPresetType = z.infer<typeof BgPresetTypeSchema>;

export const BgPresetSchema = z.object({
  id: z.string().min(1),
  type: BgPresetTypeSchema,
  /** CSS background value */
  value: CSSColor,
});
export type BgPreset = z.infer<typeof BgPresetSchema>;

/** Resolved/effective theme (after applying custom overrides) */
export const EffectiveThemeSchema = ThemeSchema.extend({
  /** Optional custom CSS background (overrides gradient) */
  customBg: z.string().optional(),
});
export type EffectiveTheme = z.infer<typeof EffectiveThemeSchema>;

// ---------------------------------------------------------------------------
// UI: App Settings  (Settings page)
// ---------------------------------------------------------------------------

export const AppSettingsSchema = z.object({
  notifications: z.boolean(),
  emailAlerts: z.boolean(),
  autoSave: z.boolean(),
  compactMode: z.boolean(),
});
export type AppSettings = z.infer<typeof AppSettingsSchema>;

// ---------------------------------------------------------------------------
// UI: User Profile  (Profile page)
// ---------------------------------------------------------------------------

export const UserProfileSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  /** Base64 data URL or remote URL; null if using initial avatar */
  avatar: z.string().url().nullable(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UpdateProfileInputSchema = UserProfileSchema.partial().omit({ avatar: true });
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

// ---------------------------------------------------------------------------
// UI: Copilot / Chat  (Copilot component)
// ---------------------------------------------------------------------------

export const ChatRoleSchema = z.enum(["user", "assistant"]);
export type ChatRole = z.infer<typeof ChatRoleSchema>;

export const ChatMessageSchema = z.object({
  role: ChatRoleSchema,
  content: z.string().min(1),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ---------------------------------------------------------------------------
// Context Shapes
// ---------------------------------------------------------------------------

/** Value shape exposed by ProjectContext */
export const ProjectContextSchema = z.object({
  projects: z.array(ProjectSchema),
  activeProject: ProjectSchema.nullable(),
  /** (input: NewProjectInput) => Project */
  addProject: z.function({ input: z.tuple([NewProjectInputSchema]), output: ProjectSchema }),
  /** (id: number, updates: UpdateProjectInput) => void */
  updateProject: z.function({ input: z.tuple([z.number(), UpdateProjectInputSchema]), output: z.void() }),
  /** (id: number) => void */
  deleteProject: z.function({ input: z.tuple([z.number()]), output: z.void() }),
  /** (id: number) => void */
  switchProject: z.function({ input: z.tuple([z.number()]), output: z.void() }),
});
export type ProjectContext = z.infer<typeof ProjectContextSchema>;

/** Value shape exposed by ThemeContext */
export const ThemeContextSchema = z.object({
  theme: ThemeKeySchema,
  /** (key: ThemeKey) => void */
  setTheme: z.function({ input: z.tuple([ThemeKeySchema]), output: z.void() }),
  themes: z.record(ThemeKeySchema, ThemeSchema),
  currentTheme: EffectiveThemeSchema,
  customBg: z.string().nullable(),
  /** (value: string | null) => void */
  setCustomBg: z.function({ input: z.tuple([z.string().nullable()]), output: z.void() }),
  customAccent: HexColor.nullable(),
  /** (value: string | null) => void */
  setCustomAccent: z.function({ input: z.tuple([HexColor.nullable()]), output: z.void() }),
  bgPresets: z.array(BgPresetSchema),
});
export type ThemeContext = z.infer<typeof ThemeContextSchema>;

// ---------------------------------------------------------------------------
// LocalStorage Keys
// ---------------------------------------------------------------------------

export const LocalStorageKeySchema = z.enum([
  "bms_projects",
  "bms_active_project",
  "bms_theme",
  "bms_custom_bg",
  "bms_custom_accent",
  /** Pattern: bms_tabs_<projectId> */
  "bms_tabs",
  "token",
]);
export type LocalStorageKey = z.infer<typeof LocalStorageKeySchema>;

// ---------------------------------------------------------------------------
// Route Registry
// ---------------------------------------------------------------------------

/** Every client-side route in the BMS application */
export const RouteSchema = z.object({
  path: z.string(),
  page: z.string(),
  auth: z.boolean().describe("Whether the route requires an authenticated session"),
  layout: z.enum(["none", "dashboard"]),
});
export type Route = z.infer<typeof RouteSchema>;

export const ROUTES = [
  { path: "/",                   page: "Landing",      auth: false, layout: "none"      },
  { path: "/bms-login",          page: "Login",        auth: false, layout: "none"      },
  { path: "/bms",                page: "Overview",     auth: true,  layout: "dashboard" },
  { path: "/bms/projects",       page: "Projects",     auth: true,  layout: "dashboard" },
  { path: "/bms/tasks",          page: "Tasks",        auth: true,  layout: "dashboard" },
  { path: "/bms/plans",          page: "Plans",        auth: true,  layout: "dashboard" },
  { path: "/bms/out",            page: "Out",          auth: true,  layout: "dashboard" },
  { path: "/bms/search",         page: "WebSearch",    auth: true,  layout: "dashboard" },
  { path: "/bms/files",          page: "Files",        auth: true,  layout: "dashboard" },
  { path: "/bms/info",           page: "Info",         auth: true,  layout: "dashboard" },
  { path: "/bms/notifications",  page: "Notifications",auth: true,  layout: "dashboard" },
  { path: "/bms/profile",        page: "Profile",      auth: true,  layout: "dashboard" },
  { path: "/bms/settings",       page: "Settings",     auth: true,  layout: "dashboard" },
  { path: "/bms/management",     page: "Management",   auth: true,  layout: "dashboard" },
] as const satisfies readonly Route[];

export const RoutesSchema = z.array(RouteSchema);

// ---------------------------------------------------------------------------
// Navigation Items  (DashboardLayout sidebar)
// ---------------------------------------------------------------------------

export const NavItemSchema = z.object({
  key: z.string(),
  path: z.string(),
});
export type NavItem = z.infer<typeof NavItemSchema>;

export const NAV_ITEMS: NavItem[] = [
  { key: "Dashboard",  path: "/bms"          },
  { key: "Out",        path: "/bms/out"       },
  { key: "Tasks",      path: "/bms/tasks"     },
  { key: "Plans",      path: "/bms/plans"     },
  { key: "Web search", path: "/bms/search"    },
  { key: "Projects",   path: "/bms/projects"  },
  { key: "Bestanden",  path: "/bms/files"     },
  { key: "Info",       path: "/bms/info"      },
];
