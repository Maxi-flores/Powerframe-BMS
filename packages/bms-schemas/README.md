# @powerframe/bms-schemas

> Canonical Zod v4 schema catalogue for **Powerframe BMS V1**. Provides runtime validation and inferred TypeScript types for every data model, API contract, UI state shape, and client-side route in the application.

Part of the **TheRocketTree** monorepo ecosystem.

---

## Installation

```bash
# npm workspaces / pnpm workspaces / Turborepo
npm install @powerframe/bms-schemas zod

# From GitHub (without workspace setup)
npm install github:Maxi-flores/Powerframe-BMS-V1#main
```

Requires **Zod v4** as a peer dependency.

---

## Usage

```ts
import {
  ProjectSchema,
  TaskSchema,
  AuthResponseSchema,
  ROUTES,
  type Project,
  type Task,
} from "@powerframe/bms-schemas";

// ✅ Runtime parse — throws ZodError if invalid
const project: Project = ProjectSchema.parse(untrustedData);

// ✅ Safe parse — returns { success, data } or { success, error }
const result = TaskSchema.safeParse(formData);
if (result.success) {
  console.log(result.data.status); // "pending" | "in_progress" | "completed"
}

// ✅ Validate an API response
const auth = AuthResponseSchema.parse(await fetch("/api/auth/login").then(r => r.json()));
console.log(auth.token);

// ✅ Route registry
console.log(ROUTES.length); // 14
```

---

## Schema Reference

See [ARCHITECTURE.md](../../ARCHITECTURE.md) at the repo root for full documentation of every entity, field, and enum value.

### Quick index

| Schema | Description |
|---|---|
| `LoginRequestSchema` | `POST /api/auth/login` body |
| `RegisterRequestSchema` | `POST /api/auth/register` body |
| `AuthResponseSchema` | Auth API response (`token` + `user`) |
| `HealthResponseSchema` | `GET /api/health` response |
| `ProjectSchema` | Project entity |
| `TaskSchema` | Task with status & priority |
| `FileSchema` | File entry |
| `OutboxMessageSchema` | Outbox message |
| `NotificationSchema` | Notification |
| `TeamMemberSchema` | Team member with role |
| `WidgetSchema` | Dashboard widget (grid position) |
| `DashboardTabSchema` | Dashboard tab with widgets |
| `ThemeSchema` | Built-in theme definition |
| `AppSettingsSchema` | User feature flag settings |
| `UserProfileSchema` | Client-side user profile |
| `ChatMessageSchema` | Copilot chat message |
| `ProjectContextSchema` | ProjectContext value shape |
| `ThemeContextSchema` | ThemeContext value shape |
| `ROUTES` | All 14 client-side routes |
| `NAV_ITEMS` | Sidebar navigation items |

---

## Monorepo Setup

Add this package to your workspace root `package.json`:

```json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

Then reference it from any app:

```json
{
  "dependencies": {
    "@powerframe/bms-schemas": "workspace:*"
  }
}
```

---

## Build

```bash
npm run build      # compiles TypeScript → dist/
npm run typecheck  # type-check without emitting
```

---

*Powerframe BMS V1 — TheRocketTree ecosystem*
