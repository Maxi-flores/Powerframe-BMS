# GMS Master Hub Architecture Guide

## Mission and Brand Alignment
The Game Manager System (GMS) Master Hub is the single branded gateway for operational dashboards and Unity-linked data flows. It unifies WMS, CRM, and TPR workspaces under one layout shell while keeping each module decoupled.

**GMS identity anchors**
- **GMS** — only visible product name for hub and modules
- **Master Hub** — shared layout wrapper and primary navigation surface
- **Subsystems** — WMS, CRM, TPR under the `/gms` route space
- **Unity linkage** — hub emits operational data to the Unity Game Engine

## 1. GMS MASTER HUB SYSTEM DESEGREGATION
### 1.1 Hub Definition
**GMS Hub** is the UI container and routing gateway. It owns layout, navigation, and system context while delegating business logic to each module.

**Structural definition**
- **Wrapper shell** — sidebar, topbar, and shared UI controls
- **Gateway** — blocks unauthenticated sessions from internal views
- **Unity bridge** — exposes operational events for the game runtime

### 1.2 DashboardLayout Framework Shell
**DashboardLayout** is the authoritative layout frame for all internal `/gms/*` routes.

**Layout responsibilities**
- **Collapsible sidebar** — module navigation with compact/expanded modes
- **Topbar control strip** — search, notifications, profile, context title
- **Content outlet** — single stage for nested routes and module views

**Behavioral rules**
- **Stable composition** — module pages swap without resizing the shell
- **State continuity** — shell UI state persists across route switches

### 1.3 Hub-to-Unity Operational Link
The hub is the intake point for operational status and simulation inputs aligned to the Unity runtime. It emits structured updates instead of mutating engine state directly.

**Data handoff contract**
- **Event-driven** — state shifts represented as discrete events
- **Serialized payloads** — JSON data with predictable schemas
- **Non-blocking** — Unity receives updates asynchronously

## 2. MASTER DATA MATRIX & COMPONENT DECOUPLING
### 2.1 Workspace Integration Layout
The hub uses a modular router model so independent page bundles mount without cross-coupling.

**Router domain map**
- **`/gms`** — hub landing view and master dashboard feed
- **`/gms/wms`** — Warehouse Management System workspace
- **`/gms/crm`** — Client Relationship Management workspace
- **`/gms/tpr`** — Task and Performance Reporting workspace

**Decoupling guarantees**
- **Isolated bundles** — each workspace ships as its own build artifact
- **Shared shell only** — modules inherit layout, not each other’s code
- **Minimal imports** — no direct module-to-module dependencies

### 2.2 React Router 7 Partitioning
React Router 7 is the routing control plane. It keeps namespaces explicit and mounts subsystem pages inside the master shell.

**Routing rules**
- **Nested under `/gms`** — all operational pages are children of the hub
- **Explicit segments** — WMS/CRM/TPR are separate routes, not query flags
- **Single source** — route definitions live in the hub entry module

### 2.3 Authentication Boundary
The login entry screen is segregated from internal views to preserve a clean security boundary and allow external SSO handshakes.

**Constraint definition**
- **`/gms-login`** — public login surface, no hub shell rendered
- **Authenticated switch** — `/gms/*` requires a valid session
- **Redirect discipline** — unauthenticated visits return to `/gms-login`

**Boundary outcomes**
- **No ghost UI** — internal navigation never renders in public context
- **Stable SSO** — external identity providers remain authoritative

## 3. SEMANTIC BRIDGE LAB INTEGRATION RULES
### 3.1 Bridge Lab Layout
**Bridge Lab** is a testing layout for client inspection and deterministic UI validation. It lives at `/bridge-lab` and stays out of the primary GMS navigation.

**Purpose**
- **Inspection workstation** — controlled view of UI state
- **Event replay zone** — payload testing without live impact

### 3.2 BridgeEventRequest Validation
Bridge Lab traffic arrives as `BridgeEventRequest` models carrying event payloads and feature gates.

**Model shape**
- **`eventId`** — unique identifier for traceability
- **`eventType`** — semantic label such as `inventory.sync`
- **`payload`** — typed object or JSON string with event data
- **`featureGates`** — required gate keys to execute the event

**Validation rules**
- **Schema-first** — reject payloads that fail schema checks
- **Gate aware** — ignore events when required gates are inactive
- **Replayable** — payloads logged for deterministic reruns
- **No persistence** — Bridge Lab never writes to production tables

### 3.3 `activeCandidate` Interceptor
`activeCandidate` tests deterministic UI patterns without modifying databases or local settings. It captures transient state only.

**Operational behavior**
- **Ephemeral state** — data stored in-memory only
- **postMessage channel** — `window.postMessage` for cross-window tests
- **Deterministic replay** — repeated messages yield identical snapshots

**Message contract**
- **Source validation** — only whitelisted origins accepted
- **Payload scoping** — messages limited to Bridge Lab topics

## 4. SYSTEM STACK & DESIGN SPECIFICATIONS
### 4.1 Primary Tech Profile
The GMS Master Hub is a modern React application with a fast build chain.

**Stack matrix**
- **React 18.3** — component foundation and concurrent rendering
- **React Router 7** — nested routing for hub and module domains
- **Vite 6.1** — fast dev server and optimized production bundling
- **Tailwind CSS 4.2** — utility styling and theme tokens
- **PostCSS layer** — custom transforms, variables, and feature toggles

**Runtime posture**
- **Browser-only** — no server rendering assumptions in the shell
- **Module boundaries** — each workspace ships as its own chunk

### 4.2 Premium Aesthetic Parameters
The GMS visual system uses a glassmorphic aesthetic to signal depth, focus, and system hierarchy.

**Glassmorphic layout rules**
- **Translucent panels** — surface alpha between 0.25 and 0.45
- **Blur mechanics** — backdrop blur at 16–28px for primary panes
- **Soft borders** — 1px lavender/white border at 10–18% opacity

**Purple accent palette**
- **Primary accent** — saturated violet for active buttons and focus rings
- **Secondary accents** — indigo and ultraviolet highlights for icons
- **Gradient ramps** — purple-to-blue blends for hero backdrops
- **Contrast guardrails** — text always meets AA contrast on dark panels

**Component surface definitions**
- **Shell background** — deep night gradient with radial highlights
- **Sidebar** — semi-opaque glass sheet anchored to the left frame

## Closing Note
The GMS Master Hub is intentionally modular. As long as GMS branding, routing boundaries, and Bridge Lab rules remain intact, the system can scale in features, integrations, and visual fidelity without breaking its foundational contract.
