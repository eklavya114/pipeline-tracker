import { describe, it, expect } from 'vitest'
import { parseDetailsBlock } from '../details-block-parser'

describe('parseDetailsBlock', () => {
  it('parses company with colon separator', () => {
    expect(parseDetailsBlock('Company: Acme')).toEqual({ companyName: 'Acme' })
  })

  it('parses company name label', () => {
    expect(parseDetailsBlock('Company Name: Acme')).toEqual({ companyName: 'Acme' })
  })

  it('parses role', () => {
    expect(parseDetailsBlock('Role: Engineer')).toEqual({ roleTitle: 'Engineer' })
  })

  it('parses role title', () => {
    expect(parseDetailsBlock('Role Title: Senior Engineer')).toEqual({ roleTitle: 'Senior Engineer' })
  })

  it('parses position', () => {
    expect(parseDetailsBlock('Position: Manager')).toEqual({ roleTitle: 'Manager' })
  })

  it('parses job title', () => {
    expect(parseDetailsBlock('Job Title: Director')).toEqual({ roleTitle: 'Director' })
  })

  it('parses status', () => {
    expect(parseDetailsBlock('Status: Applied')).toEqual({ status: 'Applied' })
  })

  it('parses round', () => {
    expect(parseDetailsBlock('Round: Technical Round 1')).toEqual({ round: 'Technical Round 1' })
  })

  it('parses candidate', () => {
    expect(parseDetailsBlock('Candidate: John Doe')).toEqual({ candidateName: 'John Doe' })
  })

  it('parses candidate name', () => {
    expect(parseDetailsBlock('Candidate Name: Jane Doe')).toEqual({ candidateName: 'Jane Doe' })
  })

  it('parses name', () => {
    expect(parseDetailsBlock('Name: Alice')).toEqual({ candidateName: 'Alice' })
  })

  it('parses email', () => {
    expect(parseDetailsBlock('Email: test@example.com')).toEqual({ email: 'test@example.com' })
  })

  it('parses candidate email', () => {
    expect(parseDetailsBlock('Candidate Email: test@example.com')).toEqual({ email: 'test@example.com' })
  })

  it('parses phone', () => {
    expect(parseDetailsBlock('Phone: 555-1234')).toEqual({ phone: '555-1234' })
  })

  it('parses linkedin', () => {
    expect(parseDetailsBlock('LinkedIn: https://linkedin.com/in/test')).toEqual({ linkedinUrl: 'https://linkedin.com/in/test' })
  })

  it('parses linkedin url', () => {
    expect(parseDetailsBlock('LinkedIn URL: https://linkedin.com/in/test')).toEqual({ linkedinUrl: 'https://linkedin.com/in/test' })
  })

  it('parses source', () => {
    expect(parseDetailsBlock('Source: LinkedIn')).toEqual({ source: 'LinkedIn' })
  })

  it('parses applied', () => {
    expect(parseDetailsBlock('Applied: 2024-01-01')).toEqual({ appliedAt: '2024-01-01' })
  })

  it('parses applied date', () => {
    expect(parseDetailsBlock('Applied Date: 2024-01-01')).toEqual({ appliedAt: '2024-01-01' })
  })

  it('parses applied on', () => {
    expect(parseDetailsBlock('Applied On: 2024-01-01')).toEqual({ appliedAt: '2024-01-01' })
  })

  it('parses notes', () => {
    expect(parseDetailsBlock('Notes: Some notes here')).toEqual({ notes: 'Some notes here' })
  })

  it('ignores unknown labels', () => {
    expect(parseDetailsBlock('Unknown Field: value')).toEqual({})
  })

  it('ignores lines without separator', () => {
    expect(parseDetailsBlock('No separator here')).toEqual({})
  })

  it('handles extra whitespace around label and value', () => {
    expect(parseDetailsBlock('  Company  :   Acme  ')).toEqual({ companyName: 'Acme' })
  })

  it('parses en-dash separator', () => {
    expect(parseDetailsBlock('Company – Acme')).toEqual({ companyName: 'Acme' })
  })

  it('parses hyphen separator', () => {
    expect(parseDetailsBlock('Company - Acme')).toEqual({ companyName: 'Acme' })
  })

  it('is case-insensitive for labels', () => {
    expect(parseDetailsBlock('COMPANY: Acme')).toEqual({ companyName: 'Acme' })
  })

  it('parses multiple fields', () => {
    const input = 'Company: Acme\nRole: Engineer\nEmail: test@example.com'
    expect(parseDetailsBlock(input)).toEqual({
      companyName: 'Acme',
      roleTitle: 'Engineer',
      email: 'test@example.com',
    })
  })

  it('returns empty object for empty input', () => {
    expect(parseDetailsBlock('')).toEqual({})
  })
})
