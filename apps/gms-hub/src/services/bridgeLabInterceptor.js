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
let interceptorCount = 0
let fallbackCounter = 0

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
    .join('[^.]+')

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

const matchesType = (value, expected) => {
  if (Array.isArray(expected)) {
    return expected.some((type) => matchesType(value, type))
  }

  if (expected === 'array') {
    return Array.isArray(value)
  }

  if (expected === 'number') {
    return typeof value === 'number' && Number.isFinite(value)
  }

  if (expected === 'string') {
    return typeof value === 'string' && value.trim().length > 0
  }

  if (expected === 'object') {
    return isPlainObject(value)
  }

  return true
}

const hasRequiredPayloadFields = (eventType, payload) => {
  const payloadRequired = Array.isArray(eventTypeRules?.[eventType]?.payload_required)
    ? eventTypeRules[eventType].payload_required
    : []

  if (!payloadRequired.every((key) => key in payload)) {
    return false
  }

  const payloadShape = isPlainObject(eventTypeRules?.[eventType]?.payload_shape)
    ? eventTypeRules[eventType].payload_shape
    : {}

  return Object.entries(payloadShape).every(
    ([key, typeSpec]) => key in payload && matchesType(payload[key], typeSpec),
  )
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

const deepCloneFallback = (value) => {
  if (Array.isArray(value)) {
    return value.map((entry) => deepCloneFallback(entry))
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, deepCloneFallback(entry)]),
    )
  }

  return value
}

const deepClone = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return deepCloneFallback(value)
}

const generateEventId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    const uuidVersionMask = 0x0f
    const uuidVersionValue = 0x40
    const uuidVariantMask = 0x3f
    const uuidVariantValue = 0x80
    bytes[6] = (bytes[6] & uuidVersionMask) | uuidVersionValue
    bytes[8] = (bytes[8] & uuidVariantMask) | uuidVariantValue
    const toHex = (value) => value.toString(16).padStart(2, '0')
    const segments = [
      bytes.slice(0, 4),
      bytes.slice(4, 6),
      bytes.slice(6, 8),
      bytes.slice(8, 10),
      bytes.slice(10, 16),
    ]
    return segments.map((segment) => [...segment].map(toHex).join('')).join('-')
  }

  fallbackCounter = (fallbackCounter + 1) % 1000000
  const randomToken = Math.random().toString(16).slice(2).padEnd(8, '0').slice(0, 8)
  return `bridge-${Date.now()}-${fallbackCounter}-${randomToken}`
}

export const initializeActiveCandidateInterceptor = (onValidCandidateCallback) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  interceptorCount += 1

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
    interceptorCount = Math.max(0, interceptorCount - 1)
    if (interceptorCount === 0) {
      activeCandidate = null
    }
  }
}

export const getActiveCandidateSnapshot = () =>
  activeCandidate ? deepClone(activeCandidate) : null
