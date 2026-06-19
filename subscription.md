# GMS Multi-Channel Subscription Multiplexer Specification

## GMS Nomenclature Compliance Verification

- **Canonical platform name:** **GMS (Game Manager System)**.
- **Routing core name:** **GMS Hub**.
- **Engine peer name:** **Unity Game Engine Server**.
- **Dashboard clients:** **WMS**, **CRM**, **TPR** sub-dashboards.
- **Network model:** real-time, multi-channel, full-duplex WebSocket multiplexing.
- **Compliance assertion:** all architecture, events, payload wrappers, rendering contracts, and connection lifecycle labels in this specification are normalized to **GMS** naming and intentionally avoid legacy non-GMS platform naming.

### Compliance Checklist

- [x] Central orchestrator identified as **GMS Hub**.
- [x] End-to-end transport references **GMS** and Unity explicitly.
- [x] Channel taxonomy constrained to `WMS | CRM | TPR`.
- [x] Packet schema, bridge ingestion, and UI rendering sections use GMS terminology consistently.

---

## 1) GMS MASTER MULTIPLEXER ARCHITECTURE

### Core Role of the GMS Hub

- The **GMS Hub** is the authoritative subscription multiplexer and routing host.
- It terminates and maintains full-duplex WebSocket sessions with:
  - `WMS` dashboard client
  - `CRM` dashboard client
  - `TPR` dashboard client
  - active `Unity Game Engine Server` endpoint
- It enforces one normalized message envelope format for all ingress and egress traffic.
- It performs channel-aware fan-out and directed relay while preserving packet metadata integrity.
- It acts as the transport health authority by owning reconnection policy, liveness checks, and stale session reaping.

### Full-Duplex Subscription Loop

- Every connected participant is simultaneously a producer and consumer.
- Inbound packets are accepted, validated, classified, then routed without requiring separate request/response channels.
- Outbound updates are streamed continuously to subscribed destinations with low-latency relay semantics.
- Subscription state is tracked per socket and per channel to support selective propagation.

### Connection State Architecture

```ts
type ConnectionState =
  | "DISCONNECTED"
  | "CONNECTING"
  | "AUTHENTICATING"
  | "SUBSCRIBED"
  | "DEGRADED"
  | "RETRY_WAIT"
  | "RECOVERING"
  | "CLOSED";

interface SocketHealth {
  peerId: string;
  role: "GMS_HUB" | "UNITY_ENGINE" | "WMS" | "CRM" | "TPR";
  state: ConnectionState;
  lastHeartbeatEpochMs: number;
  retryCount: number;
  nextRetryDelayMs: number;
  jitterMs: number;
  closeCode?: number;
  closeReason?: string;
}
```

- `DEGRADED` indicates heartbeat drift or transient packet loss without full disconnect.
- `RETRY_WAIT` gates reconnection storms and prevents thundering-herd retries.
- `RECOVERING` applies after transport restore while pending re-auth and re-subscription replay complete.

### Automated Exponential Backoff Retry Routine

```ts
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 30000;
const JITTER_MIN_MS = 50;
const JITTER_MAX_MS = 350;

function computeRetryDelay(retryCount: number): number {
  const exp = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** retryCount);
  const jitter = randomInt(JITTER_MIN_MS, JITTER_MAX_MS);
  return exp + jitter;
}
```

- Retry lifecycle:
  - detect unexpected close/timeouts
  - transition `SUBSCRIBED/DEGRADED -> RETRY_WAIT`
  - schedule retry using `computeRetryDelay(retryCount)`
  - attempt reconnect and auth replay
  - on success transition to `RECOVERING -> SUBSCRIBED`
  - on failure increment retry counter and repeat until circuit threshold or manual abort
- Health continuity controls:
  - heartbeat interval + heartbeat timeout
  - max silent duration watchdog
  - stale socket eviction
  - replay buffer for last-known subscription intents

---

## 2) CHANNEL DECOUPLING & STRUCTURAL ROUTING

### Channel Filtering and Packet Map Splitting

- The master pipeline splits traffic into strict channel maps:
  - `channelMap.WMS`
  - `channelMap.CRM`
  - `channelMap.TPR`
- Each map isolates:
  - subscriber socket set
  - action handlers
  - optional transform chain
  - notification queue bindings
- Decoupling objective:
  - prevent cross-channel leakage
  - preserve domain-focused update cadence
  - allow independent backpressure handling per channel

### Routing Decision Matrix

- `channel == WMS` -> route to WMS subscribers + optional Unity mirror.
- `channel == CRM` -> route to CRM subscribers + optional Unity mirror.
- `channel == TPR` -> route to TPR subscribers + optional Unity mirror.
- Unknown channel -> reject with protocol error and telemetry marker.
- Broadcast events must still declare a primary channel and explicit target list to keep auditability deterministic.

### Unified Wrapping Shell Schema (Required on Every Packet)

```ts
type Channel = "WMS" | "CRM" | "TPR";

interface GmsEnvelope<T = unknown> {
  channel: Channel;                 // mandatory channel partition key
  type?: string;                    // event category (optional if actionName is present)
  actionName?: string;              // explicit command or signal action
  payload: T;                       // business payload
  sender: string;                   // immutable producer identity string
  epochMs: number;                  // UTC epoch timestamp (ms)
}
```

### Envelope Rules

- `channel` is mandatory and must be one of `WMS|CRM|TPR`.
- At least one of `type` or `actionName` must be present.
- `payload` is always present; use empty object when no body fields exist.
- `sender` is a non-empty string identifying origin (`GMS_HUB`, `UNITY_ENGINE`, dashboard client ID, or bridge source).
- `epochMs` must be client- or server-generated UTC millisecond epoch for ordering and diagnostics.
- Envelope mutation after ingress validation is prohibited except by explicit, auditable transform stages.

---

## 3) IN-MEMORY STATE INGESTION BRIDGE (Semantic Bridge Lab)

### Client-Side `/bridge-lab` Integration Hooks

- `/bridge-lab` is treated as a semantic ingestion sandbox for telemetry and mock operational events.
- Integration is **non-destructive**:
  - no database persistence calls
  - no localStorage/sessionStorage writes
  - no side effects outside in-memory runtime state
- Incoming bridge packets pass through the same envelope validator used by live channels to preserve parity.

### Bridge Ingestion Flow

- Source emits telemetry/profile test packet.
- Packet enters bridge listener on client runtime.
- Envelope is validated and normalized.
- Packet is dispatched into in-memory React Context reducers/selectors.
- Active views re-render immediately with volatile state.
- Session refresh or context reset drops injected state by design.

### `activeCandidate` React Context Hook Engine

```ts
interface ActiveCandidateContextState {
  activeCandidate: Record<string, unknown> | null;
  setActiveCandidate: (value: Record<string, unknown> | null) => void;
  ingestBridgePacket: (envelope: GmsEnvelope) => void;
}
```

- `activeCandidate` is the real-time, volatile selection target for candidate-like profile visualization in dashboards.
- `ingestBridgePacket` accepts test packets and updates only live memory.
- All context updates are transactional at render-cycle scope to avoid partial UI states.

### Test-Only Injection via `window.postMessage`

```ts
window.postMessage(
  {
    channel: "CRM",
    actionName: "candidate.profile.mock.inject",
    payload: {
      id: "mock-bridge-001",
      displayName: "Bridge Lab Candidate",
      status: "active",
      score: 97
    },
    sender: "bridge-lab",
    epochMs: Date.now()
  },
  "*"
);
```

- Intended behavior:
  - immediate appearance in active dashboard views bound to `activeCandidate`
  - no write-through to persistence layers
  - no mutation of browser storage
  - safe disposal on reload/navigation reset
- This mechanism supports rapid UI and pipeline verification without contaminating production datasets.

---

## 4) REAL-TIME GLASSMORPHIC RENDERING SYSTEMS

### Centralized Data Loop -> Shared Layout Panels

- The GMS Hub streams normalized envelopes into client channel contexts.
- React Context API distributes state slices to shared layout panels and feature widgets.
- Update path:
  - socket event -> envelope parse -> channel reducer -> context publish -> component subscription update.
- Panels remain synchronized through context subscriptions rather than local prop-drilling chains.

### Real-Time UI State Domains

- **Connection state banners**
  - reflect `DISCONNECTED/CONNECTING/SUBSCRIBED/DEGRADED/RECOVERING`
  - update instantly on socket lifecycle transitions
- **Automated notification arrays**
  - append status and action events with timestamp ordering
  - prune with bounded queue policy for render performance
- **System alerts**
  - surface protocol violations, channel mismatches, or retry exhaustion
  - include sender, channel, and action/type metadata for triage

### Glassmorphic Visual Standard Definitions

```css
.gms-glass-panel {
  background: rgba(88, 28, 135, 0.40); /* bg-purple-900/40 */
  backdrop-filter: blur(14px);         /* backdrop-blur */
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.14); /* fine custom border */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.28);
}
```

- Required adaptation behavior:
  - visual tokens respond immediately to connection severity (healthy, degraded, disconnected)
  - alert emphasis scales through border opacity and background tint modifiers
  - notification stack maintains readability under blur overlays and dark gradient backdrops

### Rendering Governance

- All glassmorphic panels must consume centralized connection and alert context instead of duplicating status logic.
- CSS token drift is disallowed; shared utility classes or design tokens enforce consistency.
- Real-time transitions must avoid layout shift; use stable panel geometry and animation-safe opacity/background changes.

---

## Operational Guarantees and Validation Targets

- **Protocol consistency:** every message uses the mandatory GMS envelope.
- **Isolation:** channel decoupling prevents unintended WMS/CRM/TPR bleed-through.
- **Resilience:** exponential backoff + heartbeat supervision maintains service continuity under transient failures.
- **Safety:** bridge-lab injection remains memory-only and non-destructive.
- **UX reactivity:** glassmorphic dashboards reflect live pipeline health without manual refresh.
- **Naming governance:** all architecture artifacts conform to **GMS** system naming conventions.

## Recommended Audit Assertions

- Verify no packet bypasses envelope validation.
- Verify `epochMs` is present on all inbound/outbound events.
- Verify retry delay grows exponentially with jitter and caps at max.
- Verify bridge-lab injections never trigger persistence writes.
- Verify connection banners and alerts update within one render cycle after context mutation.
- Verify all documentation, labels, and state descriptors reference **GMS** nomenclature.
