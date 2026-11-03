export interface DetailsBlockParseResult {
  companyName?: string
  roleTitle?: string
  status?: string
  round?: string
  candidateName?: string
  email?: string
  phone?: string
  linkedinUrl?: string
  source?: string
  appliedAt?: string
  notes?: string
}

const LABEL_MAP: Record<string, keyof DetailsBlockParseResult> = {
  company: 'companyName',
  'company name': 'companyName',
  role: 'roleTitle',
  'role title': 'roleTitle',
  position: 'roleTitle',
  'job title': 'roleTitle',
  status: 'status',
  round: 'round',
  candidate: 'candidateName',
  'candidate name': 'candidateName',
  name: 'candidateName',
  email: 'email',
  'candidate email': 'email',
  phone: 'phone',
  linkedin: 'linkedinUrl',
  'linkedin url': 'linkedinUrl',
  source: 'source',
  applied: 'appliedAt',
  'applied date': 'appliedAt',
  'applied on': 'appliedAt',
  notes: 'notes',
}

const LINE_PATTERN = /^([^:\-–]+)[:\-–]\s*(.+)$/

export function parseDetailsBlock(rawText: string): DetailsBlockParseResult {
  const result: DetailsBlockParseResult = {}

  for (const line of rawText.split('\n')) {
    const match = LINE_PATTERN.exec(line)
    if (!match) continue

    const label = match[1].trim().toLowerCase()
    const value = match[2].trim()
    const field = LABEL_MAP[label]

    if (field) {
      result[field] = value
    }
  }

  return result
}
