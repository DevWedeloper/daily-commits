import { describe, expect, it } from 'bun:test'
import { formatDateGMT8 } from './format'

describe('formatDateGMT8', () => {
  it('formats a date correctly in GMT+8', () => {
    const date = new Date('2025-12-06T04:00:00Z') // UTC
    const result = formatDateGMT8(date)

    expect(result).toBe('Sat, 06 Dec 2025 12:00:00 GMT+08:00')
  })

  it('pads single-digit day, hour, minute, and second', () => {
    const date = new Date('2025-01-01T00:01:02Z')
    const result = formatDateGMT8(date)

    expect(result).toBe('Wed, 01 Jan 2025 08:01:02 GMT+08:00')
  })

  it('handles day rollover when adding GMT+8 offset', () => {
    const date = new Date('2025-12-31T20:30:45Z')
    const result = formatDateGMT8(date)

    expect(result).toBe('Thu, 01 Jan 2026 04:30:45 GMT+08:00')
  })

  it('handles month rollover correctly', () => {
    const date = new Date('2025-02-28T18:00:00Z')
    const result = formatDateGMT8(date)

    expect(result).toBe('Sat, 01 Mar 2025 02:00:00 GMT+08:00')
  })
})
