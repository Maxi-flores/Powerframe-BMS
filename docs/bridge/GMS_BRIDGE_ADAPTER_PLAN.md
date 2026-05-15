# GMS Bridge Adapter Plan

## Scope

This plan defines the documentation and fixture-only adapter boundary for a GMS-origin bridge event:

- `toolId`: `gms`
- `eventName`: `quest.started`
- Contract owner: `TheRocketTree-App`
- Contract shape: `BridgeEventRequestSchema`
- Local fixture: `docs/bridge/examples/gms-quest-started.bridge-request.json`

This plan does not connect to TheRocketTree-App, post runtime events, add Firebase persistence, command Unity, or refactor app behavior.

## Current GMS Objects Inspected

Powerframe-GMS currently exposes project and control state through a lightweight React shell:

| Object | Location | Current role |
|---|---|---|
| `ProjectContext.projects` | `src/context/ProjectContext.jsx` | Local project registry persisted in browser storage. |
| `ProjectContext.activeProject` | `src/context/ProjectContext.jsx` | Active project selected in the GMS shell. |
| `Tasks` page task items | `src/pages/Tasks.jsx` | Project-scoped task list with `pending`, `in_progress`, and `completed` status. |
| `Plans` page events | `src/pages/Plans.jsx` | Calendar planning items for scheduling context. |
| `Overview` widgets/tabs | `src/pages/Overview.jsx` | Project dashboard widgets, progress, and local tab layout. |
| `DashboardLayout` route shell | `src/layouts/DashboardLayout.jsx` | Control-layer navigation, project switcher, topbar, and module outlet. |
| `/gms/*` routes | `src/App.jsx` | Protected GMS route space for overview, projects, tasks, plans, files, settings, and management. |

There is not yet a dedicated persisted `Quest` model in GMS. For this planning fixture, a quest start is best represented as a governance/control-layer event derived from the active project context and its associated task/planning lane.

## Mapped Source Object

The source object for `ExternalToolEvent` should be:

**`ProjectContext.activeProject` promoted into a GMS quest-control event.**

The active project is the strongest current GMS object because it is the shell-level unit selected before tasks, plans, widgets, and route views are interpreted. A future explicit `Quest` entity can replace or wrap this mapping, but today the bridge event should treat a quest as:

- the active GMS project context,
- optionally enriched by task counts or plan/milestone context,
- emitted as a control/governance event,
- semantically processed by TheRocketTree-App after bridge acceptance.

## Bridge Mapping

| Bridge field | GMS source |
|---|---|
| `event.eventId` | Stable adapter-generated id for the quest-start event. |
| `event.toolId` | Literal `gms`. |
| `event.eventName` | Literal `quest.started`. |
| `event.summary.summaryId` | Stable adapter-generated summary id. |
| `event.summary.toolId` | Literal `gms`. |
| `event.summary.title` | Human-readable quest/project start title. |
| `event.summary.meaning` | Neutral planning/control summary; no semantic conclusion. |
| `event.summary.sourceRef` | GMS-local reference such as `gms/projects/{projectId}`. |
| `event.summary.labels` | Routing and governance labels. |
| `event.details.quest` | Local quest projection of `activeProject`. |
| `event.details.routeContext` | GMS route/control lane, such as `/gms/projects` or `/gms/tasks`. |
| `event.details.systemState` | Neutral numeric bridge state for TheRocketTree semantic processing. |
| `fixture` | `none` for normal no-action bridge processing. |

## Neutral System State

The fixture uses only the neutral `BridgeSystemStateSchema` fields owned by TheRocketTree-App:

- `primaryValue`
- `secondaryValue`
- `systemLoad`
- `progress`
- `iteration`
- `timestamp`

These values are adapter signals, not direct gameplay instructions. TheRocketTree-App maps them into semantic state during bridge processing.

## Unity Boundary

GMS does not directly command Unity yet.

GMS emits control and governance events. TheRocketTree-App bridge performs semantic processing. Later, GMS can evaluate routes, feature gates, and eligibility before any Unity dispatch path is considered. A bridge response may eventually produce a Unity action candidate, but that candidate is review/planning data only until a separate dispatch adapter is intentionally added.

## Deferred Runtime Work

The following work is intentionally out of scope for this repository change:

- TheRocketTree-App API calls.
- `POST /api/bridge/event` integration.
- Firebase writes or schema changes.
- Runtime event posting from GMS.
- Unity adapter calls or dispatch loops.
- App route, task, project, or dashboard behavior changes.

## Future Adapter Steps

1. Add a dedicated GMS quest model or adapter projection if quests become first-class entities.
2. Define task and plan rollups that can safely enrich `quest.started`.
3. Add a feature-gate evaluation point in GMS before any Unity-related candidate is promoted.
4. Coordinate with TheRocketTree-App before adding runtime posting or accepting new contract fields.
