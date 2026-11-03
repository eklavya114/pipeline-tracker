const LEGAL_SUFFIXES = /\b(inc|corp|corporation|llc|ltd|limited|plc|co)\.?$/i

export function normaliseCompanyName(rawName: string): string {
  const trimmed = rawName.trim()
  const lowered = trimmed.toLowerCase()
  const stripped = lowered.replace(LEGAL_SUFFIXES, '').trim()
  return stripped
}
