# Powerframe BMS V1 — Architecture Reference

> **Source of truth for the BMS schema catalogue.** Every data model, API contract, UI state shape, context interface, and client-side route is defined here, derived directly from `src/schemas/index.ts`. Import the Zod schemas from the `@powerframe/bms-schemas` package for runtime validation and TypeScript types.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Application Structure](#3-application-structure)
4. [Route Registry](#4-route-registry)
5. [Authentication API](#5-authentication-api)
6. [Domain Models](#6-domain-models)
7. [UI State Models](#7-ui-state-models)
8. [Context Interfaces](#8-context-interfaces)
9. [LocalStorage Contract](#9-localstorage-contract)
10. [Shared Primitives](#10-shared-primitives)
11. [Monorepo Integration](#11-monorepo-integration)

---

## 1. System Overview

Powerframe BMS is a **Business Management System dashboard** deployed on Vercel. It provides:

- Project management with multi-project switching
- Task tracking with priority & status lifecycle
- Calendar & scheduling (Plans)
- File management (Bestanden)
- Outbox messaging
- Notifications centre
- Team & permission management
- Theming engine with 8 built-in themes and full custom overrides
- AI Copilot assistant (chat UI)

The frontend is a **React 18 SPA** (Vite + React Router v7). The backend is a set of **Vercel serverless functions** (`/api/*`) using JWT authentication with bcrypt password hashing.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Bundler | Vite 6 |
| Routing | React Router DOM 7 |
| Auth (server) | JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`) |
| Schema validation | Zod 4 |
| Deployment | Vercel |
| State persistence | Browser `localStorage` |

---

## 3. Application Structure

```
Powerframe-BMS-V1/
├── api/                         # Vercel serverless functions
│   ├── health.js                # GET  /api/health
│   └── auth/
│       ├── login.js             # POST /api/auth/login
│       ├── register.js          # POST /api/auth/register
│       └── me.js                # GET  /api/auth/me
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Root router
│   ├── layouts/
│   │   └── DashboardLayout.jsx  # Authenticated shell (sidebar + outlet)
│   ├── pages/
│   │   ├── Landing.jsx          # /
│   │   ├── Login.jsx            # /bms-login
│   │   ├── Overview.jsx         # /bms  (draggable widget grid)
│   │   ├── Projects.jsx         # /bms/projects
│   │   ├── Tasks.jsx            # /bms/tasks
│   │   ├── Plans.jsx            # /bms/plans  (calendar)
│   │   ├── Out.jsx              # /bms/out   (outbox)
│   │   ├── WebSearch.jsx        # /bms/search
│   │   ├── Files.jsx            # /bms/files
│   │   ├── Info.jsx             # /bms/info
│   │   ├── Notifications.jsx    # /bms/notifications
│   │   ├── Profile.jsx          # /bms/profile
│   │   ├── Settings.jsx         # /bms/settings
│   │   └── Management.jsx       # /bms/management
│   ├── components/
│   │   └── Copilot.jsx          # Floating AI chat panel
│   ├── context/
│   │   ├── ProjectContext.jsx   # Multi-project state
│   │   └── ThemeContext.jsx     # Theme + custom background
│   └── schemas/
│       └── index.ts             # ← Zod schema catalogue (single source of truth)
└── packages/
    └── bms-schemas/             # Publishable npm package for monorepo use
        ├── package.json
        ├── src/index.ts
        ├── tsconfig.json
        └── README.md
```

---

## 4. Route Registry

All 14 client-side routes. Routes marked **auth: true** require a valid JWT token in `localStorage.token`.

| Path | Page Component | Auth Required | Layout |
|---|---|---|---|
| `/` | `Landing` | No | none |
| `/bms-login` | `Login` | No | none |
| `/bms` | `Overview` | **Yes** | dashboard |
| `/bms/projects` | `Projects` | **Yes** | dashboard |
| `/bms/tasks` | `Tasks` | **Yes** | dashboard |
| `/bms/plans` | `Plans` | **Yes** | dashboard |
| `/bms/out` | `Out` | **Yes** | dashboard |
| `/bms/search` | `WebSearch` | **Yes** | dashboard |
| `/bms/files` | `Files` | **Yes** | dashboard |
| `/bms/info` | `Info` | **Yes** | dashboard |
| `/bms/notifications` | `Notifications` | **Yes** | dashboard |
| `/bms/profile` | `Profile` | **Yes** | dashboard |
| `/bms/settings` | `Settings` | **Yes** | dashboard |
| `/bms/management` | `Management` | **Yes** | dashboard |

**Fallback:** `*` redirects to `/`

### Sidebar Navigation Items

| Sidebar Label | Route |
|---|---|
| Dashboard | `/bms` |
| Out | `/bms/out` |
| Tasks | `/bms/tasks` |
| Plans | `/bms/plans` |
| Web search | `/bms/search` |
| Projects | `/bms/projects` |
| Bestanden | `/bms/files` |
| Info | `/bms/info` |

---

## 5. Authentication API

### POST `/api/auth/login`

Authenticates an existing user. Accepts username **or** email as the `username` field.

**Request body**

```ts
{
  username: string   // min length 1; accepts username or email
  password: string   // min length 1; plaintext (compared against bcrypt hash)
}
```

**Response `200`**

```ts
{
  token: string      // JWT, expires in 24h
  user: {
    id:       number  // positive integer
    username: string
    email:    string  // valid email
  }
}
```

**Error codes:** `400` missing fields · `401` invalid credentials · `405` wrong method

---

### POST `/api/auth/register`

Creates a new user account and returns a JWT.

**Request body**

```ts
{
  username: string   // min length 1
  email:    string   // valid email
  password: string   // min length 1
}
```

**Response `201`** — same shape as login `200`

**Error codes:** `400` missing fields · `409` user already exists · `405` wrong method

---

### GET `/api/auth/me`

Returns the authenticated user's public profile.

**Headers:** `Authorization: Bearer <token>`

**Response `200`**

```ts
{
  id:       number
  username: string
  email:    string
}
```

**Error codes:** `401` no/invalid token · `404` user not found · `405` wrong method

---

### GET `/api/health`

Health check for uptime monitoring.

**Response `200`**

```ts
{
  status:    "ok"
  timestamp: string   // ISO 8601 datetime
}
```

---

## 6. Domain Models

### Project

The top-level organisational unit. Users can create multiple projects and switch between them.

```ts
{
  id:          number   // Date.now() timestamp
  name:        string   // min 1 char
  description: string
  color:       string   // hex colour, e.g. "#7c3aed"
  createdAt:   string   // ISO date YYYY-MM-DD
}
```

**Mutation inputs:**

| Operation | Fields |
|---|---|
| Create (`NewProjectInput`) | `name`, `description`, `color` |
| Update (`UpdateProjectInput`) | any subset of the above |

**Default projects** (seeded on first load):

| ID | Name | Description | Color |
|---|---|---|---|
| 1 | PowerFrame BMS | Building Management System | `#7c3aed` |
| 2 | Client Portal | Customer facing dashboard | `#2563eb` |

---

### Task

```ts
{
  id:       number                                     // positive int
  title:    string                                     // min 1 char
  status:   "pending" | "in_progress" | "completed"
  priority: "high" | "medium" | "low"
}
```

**Status lifecycle:** `pending → in_progress → completed → pending` (cyclic toggle)

**New task input:**

```ts
{ title: string; priority?: "high" | "medium" | "low" }  // default priority: "medium"
```

---

### Calendar Event

Used on the Plans page calendar view.

```ts
{
  day:   number   // 1–31, day of month
  title: string   // min 1 char
  color: string   // hex colour
}
```

---

### File

```ts
{
  id:       number
  name:     string                                              // min 1 char
  type:     "pdf" | "figma" | "doc" | "archive" | "image" | "default"
  size:     string                                              // human-readable, e.g. "2.4 MB"
  modified: string                                              // ISO date YYYY-MM-DD
}
```

---

### Outbox Message

Managed on the Out (outbox) page.

```ts
{
  id:      number
  to:      string   // valid email
  subject: string   // min 1 char
  body?:   string   // optional
  status:  "sent" | "draft"
  date:    string   // ISO date YYYY-MM-DD
}
```

**Compose input:** `{ to, subject, body? }`

---

### Notification

```ts
{
  id:      number
  type:    "info" | "success" | "warning" | "error"
  title:   string   // min 1 char
  message: string
  time:    string   // relative label, e.g. "2 hours ago"
  read:    boolean
}
```

---

### Team Member

Managed on the Management page.

```ts
{
  id:     number
  name:   string                          // min 1 char
  email:  string                          // valid email
  role:   "Owner" | "Editor" | "Viewer"
  status: "active" | "pending"
}
```

---

### User (server-side only)

The internal user record. The `password` field is a **bcrypt hash** and is **never sent to the client**.

```ts
{
  id:       number   // positive int
  username: string   // min 1 char
  email:    string   // valid email
  password: string   // bcrypt hash — server-side only
}
```

---

## 7. UI State Models

### Widget

A single panel on the Overview dashboard grid. The 12-column × 6-row grid uses integer coordinates.

```ts
{
  id:   string   // timestamp string, unique per tab
  type: "tasks" | "calendar" | "files" | "messages" | "analytics" | "notes" | "team" | "progress"
  x:    number   // column start, 0-indexed
  y:    number   // row start, 0-indexed
  w:    number   // column span
  h:    number   // row span
}
```

**Default widget configurations:**

| Type | Icon | Color | Default data |
|---|---|---|---|
| `tasks` | ✓ | `#3b82f6` | 12 tasks, 3 due today |
| `calendar` | 📅 | `#8b5cf6` | 4 events this week |
| `files` | 📁 | `#10b981` | 48 files, 63.5 MB |
| `messages` | ✉ | `#f59e0b` | 8 unread |
| `analytics` | 📊 | `#ec4899` | 89% performance |
| `notes` | 📝 | `#06b6d4` | 15 total notes |
| `team` | 👥 | `#84cc16` | 5 members |
| `progress` | 📈 | `#f97316` | 58% complete |

---

### Dashboard Tab

Tabs are scoped per project (`bms_tabs_<projectId>` in localStorage).

```ts
{
  id:      string          // unique tab ID
  name:    string          // display label
  widgets: Widget[]
}
```

**Default tabs** (two tabs seeded per new project):

- **Overview** — 7 widgets arranged in a 12-column grid
- **Analytics** — 2 analytics/progress widgets

---

### Theme

8 built-in themes plus custom override support.

```ts
{
  name:     string   // display name
  bg1:      string   // glassmorphism rgba colour 1
  bg2:      string   // glassmorphism rgba colour 2
  gradient: string   // full CSS background gradient for the page
  accent:   string   // primary accent hex colour
}
```

**Built-in themes:**

| Key | Name | Accent |
|---|---|---|
| `default` | Default Purple | `#7c3aed` |
| `ocean` | Ocean Blue | `#0ea5e9` |
| `forest` | Forest Green | `#22c55e` |
| `sunset` | Sunset Orange | `#f97316` |
| `rose` | Rose Pink | `#ec4899` |
| `midnight` | Midnight Dark | `#6366f1` |
| `ember` | Ember Red | `#ef4444` |
| `gold` | Golden Hour | `#eab308` |

**Custom override fields** (stored separately in localStorage):

| Field | Type | Description |
|---|---|---|
| `customBg` | `string \| null` | Any valid CSS background value |
| `customAccent` | `string \| null` | Hex colour to override theme accent |

**Effective theme** = base theme merged with any custom overrides.

---

### Background Preset

10 quick-pick CSS background presets shown in the Settings page.

```ts
{
  id:    string               // e.g. "gradient1", "solid2"
  type:  "gradient" | "solid"
  value: string               // CSS background value
}
```

---

### App Settings

User-configurable feature flags (stored in component state, not persisted to localStorage by default).

```ts
{
  notifications: boolean   // push notifications
  emailAlerts:   boolean   // email alerts
  autoSave:      boolean   // auto-save changes
  compactMode:   boolean   // compact UI
}
```

---

### User Profile

Client-side editable profile (not synced to server in the current version).

```ts
{
  username: string          // min 1 char
  email:    string          // valid email
  fullName: string          // min 1 char
  avatar:   string | null   // URL or null for initial-letter avatar
}
```

**Update input:** any subset of `username`, `email`, `fullName` (avatar excluded from form updates).

---

### Copilot Chat Message

```ts
{
  role:    "user" | "assistant"
  content: string   // min 1 char
}
```

---

## 8. Context Interfaces

### ProjectContext

Provider: `<ProjectProvider>` in `src/context/ProjectContext.jsx`
Consumed via: `useProjects()` hook

```ts
{
  projects:      Project[]
  activeProject: Project | null

  addProject(input: NewProjectInput): Project
  updateProject(id: number, updates: UpdateProjectInput): void
  deleteProject(id: number): void
  switchProject(id: number): void
}
```

**Persistence:** `projects` → `bms_projects`, `activeProject.id` → `bms_active_project`

---

### ThemeContext

Provider: `<ThemeProvider>` in `src/context/ThemeContext.jsx`
Consumed via: `useTheme()` hook

```ts
{
  theme:        ThemeKey           // active theme key
  setTheme(key: ThemeKey): void

  themes:       Record<ThemeKey, Theme>   // all 8 built-in themes
  currentTheme: EffectiveTheme     // resolved theme (base + overrides)

  customBg:     string | null
  setCustomBg(value: string | null): void

  customAccent: string | null
  setCustomAccent(value: string | null): void

  bgPresets:    BgPreset[]         // 10 quick-pick background options
}
```

**Persistence:** `bms_theme`, `bms_custom_bg`, `bms_custom_accent`

---

## 9. LocalStorage Contract

All keys written by the BMS application.

| Key | Type | Description |
|---|---|---|
| `token` | `string` | JWT auth token |
| `bms_projects` | `Project[]` (JSON) | All user projects |
| `bms_active_project` | `string` (number ID) | Currently active project ID |
| `bms_tabs` | `DashboardTab[]` (JSON) | Pattern: `bms_tabs_<projectId>` |
| `bms_theme` | `ThemeKey` | Active theme key |
| `bms_custom_bg` | `string` | Custom CSS background override |
| `bms_custom_accent` | `string` | Custom accent hex colour |

---

## 10. Shared Primitives

```ts
// ISO date string — matches YYYY-MM-DD
ISODateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

// CSS hex colour — matches #RGB, #RRGGBB, #RRGGBBAA
HexColor: z.string().regex(/^#[0-9a-fA-F]{3,8}$/)

// Any non-empty CSS colour or gradient string
CSSColor: z.string().min(1)
```

---

## 11. Monorepo Integration

The schema catalogue is published as a standalone npm package at `packages/bms-schemas` so any workspace in the **TheRocketTree** monorepo can import it.

### Installing in a monorepo workspace

**npm workspaces / Turborepo / Nx:**

```json
// apps/some-app/package.json
{
  "dependencies": {
    "@powerframe/bms-schemas": "workspace:*"
  }
}
```

Root workspace `package.json` must declare the workspace:

```json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

**Via GitHub (without workspace setup):**

```json
{
  "dependencies": {
    "@powerframe/bms-schemas": "github:Maxi-flores/Powerframe-BMS-V1#main"
  }
}
```

### Usage

```ts
import {
  ProjectSchema,
  TaskSchema,
  AuthResponseSchema,
  ROUTES,
  type Project,
  type Task,
  type AuthResponse,
} from "@powerframe/bms-schemas";

// Runtime validation
const project = ProjectSchema.parse(untrustedData);

// TypeScript type (inferred — no duplication)
function saveProject(p: Project) { ... }

// Validate an API response
const auth = AuthResponseSchema.parse(await res.json());
```

### Full export list

| Export | Kind | Description |
|---|---|---|
| `ISODateString` | schema | YYYY-MM-DD date string |
| `HexColor` | schema | CSS hex colour |
| `CSSColor` | schema | Any CSS colour/gradient |
| `LoginRequestSchema` | schema + type | POST /api/auth/login body |
| `RegisterRequestSchema` | schema + type | POST /api/auth/register body |
| `AuthUserSchema` | schema + type | Public user object |
| `AuthResponseSchema` | schema + type | Auth API response |
| `MeResponseSchema` | schema + type | GET /api/auth/me response |
| `HealthResponseSchema` | schema + type | GET /api/health response |
| `UserSchema` | schema + type | Internal server-side user |
| `ProjectSchema` | schema + type | Project entity |
| `NewProjectInputSchema` | schema + type | Create project input |
| `UpdateProjectInputSchema` | schema + type | Patch project input |
| `TaskStatusSchema` | schema + type | `"pending" \| "in_progress" \| "completed"` |
| `TaskPrioritySchema` | schema + type | `"high" \| "medium" \| "low"` |
| `TaskSchema` | schema + type | Task entity |
| `NewTaskInputSchema` | schema + type | Create task input |
| `CalendarEventSchema` | schema + type | Calendar event |
| `FileTypeSchema` | schema + type | File type enum |
| `FileSchema` | schema + type | File entity |
| `MessageStatusSchema` | schema + type | `"sent" \| "draft"` |
| `OutboxMessageSchema` | schema + type | Outbox message entity |
| `ComposeMessageInputSchema` | schema + type | Compose message input |
| `NotificationTypeSchema` | schema + type | Notification type enum |
| `NotificationSchema` | schema + type | Notification entity |
| `TeamRoleSchema` | schema + type | `"Owner" \| "Editor" \| "Viewer"` |
| `TeamMemberStatusSchema` | schema + type | `"active" \| "pending"` |
| `TeamMemberSchema` | schema + type | Team member entity |
| `WidgetTypeSchema` | schema + type | Widget type enum |
| `WidgetSchema` | schema + type | Dashboard widget |
| `DashboardTabSchema` | schema + type | Dashboard tab |
| `ThemeKeySchema` | schema + type | Theme key enum |
| `ThemeSchema` | schema + type | Theme definition |
| `BgPresetTypeSchema` | schema + type | Background preset type enum |
| `BgPresetSchema` | schema + type | Background preset |
| `EffectiveThemeSchema` | schema + type | Resolved theme with overrides |
| `AppSettingsSchema` | schema + type | App feature flags |
| `UserProfileSchema` | schema + type | Client-side user profile |
| `UpdateProfileInputSchema` | schema + type | Update profile input |
| `ChatRoleSchema` | schema + type | `"user" \| "assistant"` |
| `ChatMessageSchema` | schema + type | Copilot chat message |
| `ProjectContextSchema` | schema + type | ProjectContext value shape |
| `ThemeContextSchema` | schema + type | ThemeContext value shape |
| `LocalStorageKeySchema` | schema + type | All localStorage keys |
| `RouteSchema` | schema + type | Route definition |
| `ROUTES` | const | All 14 routes as typed array |
| `RoutesSchema` | schema | Array of RouteSchema |
| `NavItemSchema` | schema + type | Sidebar nav item |
| `NAV_ITEMS` | const | All 8 sidebar navigation items |

---

*Generated from `src/schemas/index.ts` — Powerframe BMS V1*
