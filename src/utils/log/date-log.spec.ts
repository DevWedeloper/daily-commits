import { describe, expect, it } from 'bun:test'
import { dateExists, findInsertIndex } from './date-log'

describe('findInsertIndex', () => {
  it('returns 0 when inserting before the first line', () => {
    const lines = [
      'Backdated commit on 06 Dec 2025',
      'Backdated commit on 07 Dec 2025',
    ]
    const targetDate = new Date('2025-12-05')
    const index = findInsertIndex(lines, targetDate)
    expect(index).toBe(0)
  })

  it('returns middle index when inserting between lines', () => {
    const lines = [
      'Backdated commit on 06 Dec 2025',
      'Backdated commit on 08 Dec 2025',
    ]
    const targetDate = new Date('2025-12-07')
    const index = findInsertIndex(lines, targetDate)
    expect(index).toBe(1)
  })

  it('returns length when inserting after all lines', () => {
    const lines = [
      'Backdated commit on 06 Dec 2025',
      'Backdated commit on 07 Dec 2025',
    ]
    const targetDate = new Date('2025-12-08')
    const index = findInsertIndex(lines, targetDate)
    expect(index).toBe(lines.length)
  })

  it('ignores lines without a valid date', () => {
    const lines = [
      'Some random text',
      'Backdated commit on 06 Dec 2025',
    ]
    const targetDate = new Date('2025-12-05')
    const index = findInsertIndex(lines, targetDate)
    expect(index).toBe(1)
  })

  it('handles empty lines array', () => {
    const lines: string[] = []
    const targetDate = new Date('2025-12-05')
    const index = findInsertIndex(lines, targetDate)
    expect(index).toBe(0)
  })
})

describe('dateExists', () => {
  it('returns true when a matching date exists', () => {
    const lines = [
      'Backdated commit on 06 Dec 2025',
      'Backdated commit on 07 Dec 2025',
    ]
    const targetDate = new Date('2025-12-06')
    expect(dateExists(lines, targetDate)).toBe(true)
  })

  it('returns false when no matching date exists', () => {
    const lines = [
      'Backdated commit on 06 Dec 2025',
      'Backdated commit on 07 Dec 2025',
    ]
    const targetDate = new Date('2025-12-08')
    expect(dateExists(lines, targetDate)).toBe(false)
  })

  it('ignores lines without a valid date', () => {
    const lines = [
      'Some random text',
      'Backdated commit on 06 Dec 2025',
    ]
    const targetDate = new Date('2025-12-05')
    expect(dateExists(lines, targetDate)).toBe(false)
  })

  it('handles multiple lines with the same date', () => {
    const lines = [
      'Backdated commit on 06 Dec 2025',
      'Another commit on 06 Dec 2025',
      'Backdated commit on 07 Dec 2025',
    ]
    const targetDate = new Date('2025-12-06')
    expect(dateExists(lines, targetDate)).toBe(true)
  })

  it('returns false for empty lines array', () => {
    const lines: string[] = []
    const targetDate = new Date('2025-12-06')
    expect(dateExists(lines, targetDate)).toBe(false)
  })
})
