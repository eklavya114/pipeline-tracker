import { describe, it, expect } from 'vitest'
import { normaliseCompanyName } from '../company-normaliser'

describe('normaliseCompanyName', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normaliseCompanyName('  Acme  ')).toBe('acme')
  })

  it('converts to lowercase', () => {
    expect(normaliseCompanyName('ACME')).toBe('acme')
  })

  it('removes trailing inc', () => {
    expect(normaliseCompanyName('Acme Inc')).toBe('acme')
  })

  it('removes trailing inc with period', () => {
    expect(normaliseCompanyName('Acme Inc.')).toBe('acme')
  })

  it('removes trailing corp', () => {
    expect(normaliseCompanyName('Acme Corp')).toBe('acme')
  })

  it('removes trailing corporation', () => {
    expect(normaliseCompanyName('Acme Corporation')).toBe('acme')
  })

  it('removes trailing llc', () => {
    expect(normaliseCompanyName('Acme LLC')).toBe('acme')
  })

  it('removes trailing ltd', () => {
    expect(normaliseCompanyName('Acme Ltd')).toBe('acme')
  })

  it('removes trailing limited', () => {
    expect(normaliseCompanyName('Acme Limited')).toBe('acme')
  })

  it('removes trailing plc', () => {
    expect(normaliseCompanyName('Acme PLC')).toBe('acme')
  })

  it('removes trailing co', () => {
    expect(normaliseCompanyName('Acme Co')).toBe('acme')
  })

  it('does not remove suffix in the middle of the name', () => {
    expect(normaliseCompanyName('Incorporated Tech')).toBe('incorporated tech')
  })

  it('handles empty string', () => {
    expect(normaliseCompanyName('')).toBe('')
  })

  it('handles name that is only whitespace', () => {
    expect(normaliseCompanyName('   ')).toBe('')
  })

  it('preserves multi-word company names after suffix removal', () => {
    expect(normaliseCompanyName('Google Inc.')).toBe('google')
  })

  it('handles co with period', () => {
    expect(normaliseCompanyName('Acme Co.')).toBe('acme')
  })
})
