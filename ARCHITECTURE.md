# Powerframe BMS V1 Architecture

> Auto-generated from `src/schemas/index.ts` · Last updated: 2026-04-13
> Run `npm run docs:generate` to regenerate after any schema change.

---

## Table of Contents

1. [Primitives & Utilities](#primitives-utilities)
2. [Auth API — /api/auth/*](#auth-api-apiauth)
3. [Health API — /api/health](#health-api-apihealth)
4. [Domain: User (internal store shape — server-side only)](#domain-user-internal-store-shape-serverside-only)
5. [Domain: Project](#domain-project)
6. [Domain: Task](#domain-task)
7. [Domain: Calendar Event (Plans page)](#domain-calendar-event-plans-page)
8. [Domain: File](#domain-file)
9. [Domain: Outbox Message (Out page)](#domain-outbox-message-out-page)
10. [Domain: Notification](#domain-notification)
11. [Domain: Team Member (Management page)](#domain-team-member-management-page)
12. [UI: Dashboard Widget (Overview page)](#ui-dashboard-widget-overview-page)
13. [UI: Theme (ThemeContext)](#ui-theme-themecontext)
14. [UI: App Settings (Settings page)](#ui-app-settings-settings-page)
15. [UI: User Profile (Profile page)](#ui-user-profile-profile-page)
16. [UI: Copilot / Chat (Copilot component)](#ui-copilot-chat-copilot-component)
17. [Context Shapes](#context-shapes)
18. [LocalStorage Keys](#localstorage-keys)
19. [Route Registry](#route-registry)
20. [Navigation Items (DashboardLayout sidebar)](#navigation-items-dashboardlayout-sidebar)

---

## Primitives & Utilities

### `ISODateString`

> ISO date string, e.g. "2026-02-20"

**Type:** `string` (pattern)

### `HexColor`

> CSS hex colour, e.g. "#7c3aed"

**Type:** `string` (pattern)

### `CSSColor`

> CSS colour or gradient string (permissive)

**Type:** `string` (min: 1)

---

## Auth API — /api/auth/*

### `LoginRequest`

> POST /api/auth/login  — request body

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `username` | `string` (min: 1) | ✓ | Username or e-mail address |
| `password` | `string` (min: 1) | ✓ | — |

### `RegisterRequest`

> POST /api/auth/register  — request body

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `username` | `string` (min: 1) | ✓ | — |
| `email` | `string` (email) | ✓ | — |
| `password` | `string` (min: 1) | ✓ | — |

### `AuthUser`

> Public user shape returned from auth endpoints

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `number` (int, positive) | ✓ | — |
| `username` | `string` | ✓ | — |
| `email` | `string` (email) | ✓ | — |

### `AuthResponse`

> Response body for POST /api/auth/login and POST /api/auth/register

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `token` | `string` | ✓ | — |
| `user` | `AuthUser` | ✓ | — |

### `MeResponse`

> Response body for GET /api/auth/me

_Alias for [`AuthUser`](#authuser)._

---

## Health API — /api/health

### `HealthResponse`

> Response body for GET /api/health

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `status` | "ok" | ✓ | — |
| `timestamp` | `string` (ISO 8601 datetime) | ✓ | — |

---

## Domain: User (internal store shape — server-side only)

### `User`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `number` (int, positive) | ✓ | — |
| `username` | `string` (min: 1) | ✓ | — |
| `email` | `string` (email) | ✓ | — |
| `password` | `string` | ✓ | bcrypt-hashed password — never serialised to the client |

---

## Domain: Project

### `Project`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `number` (int, positive) | ✓ | Numeric timestamp ID (Date.now()) |
| `name` | `string` (min: 1) | ✓ | — |
| `description` | `string` | ✓ | — |
| `color` | `HexColor` | ✓ | — |
| `createdAt` | `ISODateString` | ✓ | — |

### `NewProjectInput`

_Derived from [`Project`](#project)_ · `.omit(…)`

### `UpdateProjectInput`

_Derived from [`NewProjectInput`](#newprojectinput)_ · `.partial(…)`

---

## Domain: Task

### `TaskStatus`

| Value |
|---|
| `pending` |
| `in_progress` |
| `completed` |

### `TaskPriority`

| Value |
|---|
| `high` |
| `medium` |
| `low` |

### `Task`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `number` (int, positive) | ✓ | — |
| `title` | `string` (min: 1) | ✓ | — |
| `status` | `TaskStatus` | ✓ | — |
| `priority` | `TaskPriority` | ✓ | — |

### `NewTaskInput`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `title` | `string` (min: 1) | ✓ | — |
| `priority` | `TaskPriority` | ✓ | — |

---

## Domain: Calendar Event (Plans page)

### `CalendarEvent`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `day` | `number` (int, min: 1, max: 31) | ✓ | Day of month (1-31) |
| `title` | `string` (min: 1) | ✓ | — |
| `color` | `HexColor` | ✓ | — |

---

## Domain: File

### `FileType`

| Value |
|---|
| `pdf` |
| `figma` |
| `doc` |
| `archive` |
| `image` |
| `default` |

### `File`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `number` (int, positive) | ✓ | — |
| `name` | `string` (min: 1) | ✓ | — |
| `type` | `FileType` | ✓ | — |
| `size` | `string` | ✓ | Human-readable size, e.g. "2.4 MB" |
| `modified` | `ISODateString` | ✓ | — |

---

## Domain: Outbox Message (Out page)

### `MessageStatus`

| Value |
|---|
| `sent` |
| `draft` |

### `OutboxMessage`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `number` (int, positive) | ✓ | — |
| `to` | `string` (email) | ✓ | — |
| `subject` | `string` (min: 1) | ✓ | — |
| `body` | `string`? |  | — |
| `status` | `MessageStatus` | ✓ | — |
| `date` | `ISODateString` | ✓ | — |

### `ComposeMessageInput`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `to` | `string` (email) | ✓ | — |
| `subject` | `string` (min: 1) | ✓ | — |
| `body` | `string`? |  | — |

---

## Domain: Notification

### `NotificationType`

| Value |
|---|
| `info` |
| `success` |
| `warning` |
| `error` |

### `Notification`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `number` (int, positive) | ✓ | — |
| `type` | `NotificationType` | ✓ | — |
| `title` | `string` (min: 1) | ✓ | — |
| `message` | `string` | ✓ | — |
| `time` | `string` | ✓ | Relative time label, e.g. "2 hours ago" |
| `read` | `boolean` | ✓ | — |

---

## Domain: Team Member (Management page)

### `TeamRole`

| Value |
|---|
| `Owner` |
| `Editor` |
| `Viewer` |

### `TeamMemberStatus`

| Value |
|---|
| `active` |
| `pending` |

### `TeamMember`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `number` (int, positive) | ✓ | — |
| `name` | `string` (min: 1) | ✓ | — |
| `email` | `string` (email) | ✓ | — |
| `role` | `TeamRole` | ✓ | — |
| `status` | `TeamMemberStatus` | ✓ | — |

---

## UI: Dashboard Widget (Overview page)

### `WidgetType`

| Value |
|---|
| `tasks` |
| `calendar` |
| `files` |
| `messages` |
| `analytics` |
| `notes` |
| `team` |
| `progress` |

### `Widget`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `string` (min: 1) | ✓ | Unique widget instance ID (string timestamp) |
| `type` | `WidgetType` | ✓ | — |
| `x` | `number` (int, min: 0) | ✓ | Grid column start (0-indexed) |
| `y` | `number` (int, min: 0) | ✓ | Grid row start (0-indexed) |
| `w` | `number` (int, positive) | ✓ | Column span |
| `h` | `number` (int, positive) | ✓ | Row span |

### `DashboardTab`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `string` (min: 1) | ✓ | — |
| `name` | `string` (min: 1) | ✓ | — |
| `widgets` | `Widget`[] | ✓ | — |

---

## UI: Theme (ThemeContext)

### `ThemeKey`

| Value |
|---|
| `default` |
| `ocean` |
| `forest` |
| `sunset` |
| `rose` |
| `midnight` |
| `ember` |
| `gold` |

### `Theme`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `name` | `string` | ✓ | — |
| `bg1` | `string` | ✓ | Glassmorphism background colour 1 (rgba) |
| `bg2` | `string` | ✓ | Glassmorphism background colour 2 (rgba) |
| `gradient` | `string` | ✓ | Full page background gradient |
| `accent` | `HexColor` | ✓ | Primary accent colour (hex) |

### `BgPresetType`

| Value |
|---|
| `gradient` |
| `solid` |

### `BgPreset`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `string` (min: 1) | ✓ | — |
| `type` | `BgPresetType` | ✓ | — |
| `value` | `CSSColor` | ✓ | CSS background value |

### `EffectiveTheme`

> Resolved/effective theme (after applying custom overrides)

_Derived from [`Theme`](#theme)_ · `.extend(…)`

---

## UI: App Settings (Settings page)

### `AppSettings`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `notifications` | `boolean` | ✓ | — |
| `emailAlerts` | `boolean` | ✓ | — |
| `autoSave` | `boolean` | ✓ | — |
| `compactMode` | `boolean` | ✓ | — |

---

## UI: User Profile (Profile page)

### `UserProfile`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `username` | `string` (min: 1) | ✓ | — |
| `email` | `string` (email) | ✓ | — |
| `fullName` | `string` (min: 1) | ✓ | — |
| `avatar` | `string` (url) \| null | ✓ | Base64 data URL or remote URL; null if using initial avatar |

### `UpdateProfileInput`

_Derived from [`UserProfile`](#userprofile)_ · `.partial(…)`

---

## UI: Copilot / Chat (Copilot component)

### `ChatRole`

| Value |
|---|
| `user` |
| `assistant` |

### `ChatMessage`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `role` | `ChatRole` | ✓ | — |
| `content` | `string` (min: 1) | ✓ | — |

---

## Context Shapes

### `ProjectContext`

> Value shape exposed by ProjectContext

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `projects` | `Project`[] | ✓ | — |
| `activeProject` | `Project` \| null | ✓ | — |
| `addProject` | `function` | ✓ | (input: NewProjectInput) => Project |
| `updateProject` | `function` | ✓ | (id: number, updates: UpdateProjectInput) => void |
| `deleteProject` | `function` | ✓ | (id: number) => void |
| `switchProject` | `function` | ✓ | (id: number) => void |

### `ThemeContext`

> Value shape exposed by ThemeContext

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `theme` | `ThemeKey` | ✓ | — |
| `setTheme` | `function` | ✓ | (key: ThemeKey) => void |
| `themes` | `Record<...>` | ✓ | — |
| `currentTheme` | `EffectiveTheme` | ✓ | — |
| `customBg` | `string` \| null | ✓ | — |
| `setCustomBg` | `function` | ✓ | (value: string | null) => void |
| `customAccent` | `HexColor` \| null | ✓ | — |
| `setCustomAccent` | `function` | ✓ | (value: string | null) => void |
| `bgPresets` | `BgPreset`[] | ✓ | — |

---

## LocalStorage Keys

### `LocalStorageKey`

| Value |
|---|
| `bms_projects` |
| `bms_active_project` |
| `bms_theme` |
| `bms_custom_bg` |
| `bms_custom_accent` |
| `bms_tabs` |
| `token` |

---

## Route Registry

### `Route`

> Every client-side route in the BMS application

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `path` | `string` | ✓ | — |
| `page` | `string` | ✓ | — |
| `auth` | `boolean` | ✓ | — |
| `layout` | `none` \| `dashboard` | ✓ | — |

### `ROUTES`

| Path | Page Component | Auth Required | Layout |
|---|---|:---:|---|
| `/` | `Landing` |  | `none` |
| `/bms-login` | `Login` |  | `none` |
| `/bms` | `Overview` | ✓ | `dashboard` |
| `/bms/projects` | `Projects` | ✓ | `dashboard` |
| `/bms/tasks` | `Tasks` | ✓ | `dashboard` |
| `/bms/plans` | `Plans` | ✓ | `dashboard` |
| `/bms/out` | `Out` | ✓ | `dashboard` |
| `/bms/search` | `WebSearch` | ✓ | `dashboard` |
| `/bms/files` | `Files` | ✓ | `dashboard` |
| `/bms/info` | `Info` | ✓ | `dashboard` |
| `/bms/notifications` | `Notifications` | ✓ | `dashboard` |
| `/bms/profile` | `Profile` | ✓ | `dashboard` |
| `/bms/settings` | `Settings` | ✓ | `dashboard` |
| `/bms/management` | `Management` | ✓ | `dashboard` |

---

## Navigation Items (DashboardLayout sidebar)

### `NavItem`

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `key` | `string` | ✓ | — |
| `path` | `string` | ✓ | — |

### `NAV_ITEMS`

| Label | Route |
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

_Generated by `scripts/generate-docs.mjs` · Powerframe BMS V1_
