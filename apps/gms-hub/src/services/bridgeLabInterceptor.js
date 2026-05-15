import bridgeConfig from '../../lab-json-bridge.config.json'

const allowedOrigins = Array.isArray(
  bridgeConfig?.bridge_lab_specification?.allowed_origins,
)
  ? bridgeConfig.bridge_lab_specification.allowed_origins
  : []

const bridgeEventContract =
  bridgeConfig?.bridge_lab_specification?.ingress_contracts?.BridgeEventRequest ??
  {}

const requiredFields = Array.isArray(bridgeEventContract.required)
  ? bridgeEventContract.required
  : []

const eventTypeRules = bridgeEventContract.event_types ?? {}
const allowedEventTypes = Object.keys(eventTypeRules)
let activeCandidate = null

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const normalizeOrigin = (value) => {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

const buildWildcardMatcher = (pattern) => {
  const wildcardToken = '__wildcard__'
  const normalized = pattern.replace(/\*/g, wildcardToken)
  const parsed = normalizeOrigin(normalized)
  if (!parsed) {
    return null
  }

  const hostRegexSource = parsed.hostname
    .split(wildcardToken)
    .map(escapeRegExp)
    .join('.+')

  return {
    protocol: parsed.protocol,
    port: parsed.port,
    hostRegex: new RegExp(`^${hostRegexSource}$`),
  }
}

const isOriginAllowed = (origin) => {
  const originUrl = normalizeOrigin(origin)
  if (!originUrl) {
    return false
  }

  return allowedOrigins.some((allowed) => {
    if (typeof allowed !== 'string' || allowed.trim().length === 0) {
      return false
    }

    if (allowed.includes('*')) {
      const matcher = buildWildcardMatcher(allowed)
      if (!matcher) {
        return false
      }

      if (matcher.protocol && matcher.protocol !== originUrl.protocol) {
        return false
      }

      if (matcher.port !== originUrl.port) {
        return false
      }

      return matcher.hostRegex.test(originUrl.hostname)
    }

    const allowedUrl = normalizeOrigin(allowed)
    return allowedUrl ? allowedUrl.origin === originUrl.origin : false
  })
}

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isValidTimestamp = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return true
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return !Number.isNaN(Date.parse(value))
  }

  return false
}

const hasRequiredPayloadFields = (eventType, payload) => {
  const payloadRequired = Array.isArray(eventTypeRules?.[eventType]?.payload_required)
    ? eventTypeRules[eventType].payload_required
    : []

  if (!payloadRequired.every((key) => key in payload)) {
    return false
  }

  if (eventType === 'inventory.sync') {
    return (
      typeof payload.inventoryId === 'string' &&
      payload.inventoryId.trim().length > 0 &&
      Array.isArray(payload.items)
    )
  }

  if (eventType === 'cadence.calibrate') {
    return (
      typeof payload.cadenceId === 'string' &&
      payload.cadenceId.trim().length > 0 &&
      (typeof payload.target === 'string' || typeof payload.target === 'number')
    )
  }

  return true
}

const isValidBridgeEventRequest = (candidate) => {
  if (!isPlainObject(candidate)) {
    return false
  }

  if (!requiredFields.every((field) => field in candidate)) {
    return false
  }

  if (typeof candidate.eventType !== 'string') {
    return false
  }

  if (!allowedEventTypes.includes(candidate.eventType)) {
    return false
  }

  if (!isPlainObject(candidate.payload)) {
    return false
  }

  if (!isValidTimestamp(candidate.timestamp)) {
    return false
  }

  if (typeof candidate.source !== 'string' || candidate.source.trim().length === 0) {
    return false
  }

  return hasRequiredPayloadFields(candidate.eventType, candidate.payload)
}

const deepClone = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value))
}

const generateEventId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `bridge-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const initializeActiveCandidateInterceptor = (onValidCandidateCallback) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handler = (event) => {
    if (!event || !isOriginAllowed(event.origin)) {
      return
    }

    if (!isPlainObject(event.data)) {
      return
    }

    if (!isValidBridgeEventRequest(event.data)) {
      return
    }

    const eventId = generateEventId()
    const snapshot = deepClone({
      ...event.data,
      eventId,
      receivedAt: new Date().toISOString(),
    })

    activeCandidate = snapshot

    if (typeof onValidCandidateCallback === 'function') {
      onValidCandidateCallback(snapshot)
    }

    if (event.source && typeof event.source.postMessage === 'function') {
      event.source.postMessage(
        {
          type: 'BridgeEventAck',
          eventId,
          status: 'accepted',
        },
        event.origin,
      )
    }
  }

  window.addEventListener('message', handler)

  return () => {
    window.removeEventListener('message', handler)
    activeCandidate = null
  }
}

export const getActiveCandidateSnapshot = () =>
  activeCandidate ? deepClone(activeCandidate) : null
