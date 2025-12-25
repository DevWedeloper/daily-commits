import { describe, expect, it, spyOn } from 'bun:test'
import { DateTime } from 'luxon'
import {
  convertToTimezone,
  getCurrentTimeInTimezone,
  getFormattedTimestamp,
  isSameDay,
} from './timezone'

describe('isSameDay function', () => {
  it('should return true for the same date', () => {
    const date1 = new Date(2024, 2, 19) // March 19, 2024
    const date2 = new Date(2024, 2, 19) // March 19, 2024
    expect(isSameDay(date1, date2)).toBe(true)
  })

  it('should return false for different dates', () => {
    const date1 = new Date(2024, 2, 19)
    const date2 = new Date(2024, 2, 20)
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('should return false for different months', () => {
    const date1 = new Date(2024, 2, 19)
    const date2 = new Date(2024, 3, 19)
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('should return false for different years', () => {
    const date1 = new Date(2024, 2, 19)
    const date2 = new Date(2025, 2, 19)
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('should return true if the time differs but the date is the same', () => {
    const date1 = new Date(2024, 2, 19, 8, 30) // March 19, 2024, 08:30 AM
    const date2 = new Date(2024, 2, 19, 20, 45) // March 19, 2024, 08:45 PM
    expect(isSameDay(date1, date2)).toBe(true)
  })

  it('should handle edge cases like different time zones', () => {
    const date1 = new Date('2024-03-19T23:59:59Z') // UTC time
    const date2 = new Date('2024-03-19T00:00:00-08:00') // Different timezone
    expect(isSameDay(date1, date2)).toBe(true)
  })
})

describe('convertToTimezone', () => {
  it('should convert an ISO timestamp to the specified timezone', () => {
    const isoTimestamp = '2024-03-19T12:00:00Z'
    const timezone = 'America/New_York'

    const result = convertToTimezone(isoTimestamp, timezone)

    expect(result.zoneName).toBe(timezone)
    expect(result.toISO()).not.toBeNull()
  })

  it('should fallback to UTC if the timezone is invalid', () => {
    const isoTimestamp = '2024-03-19T12:00:00Z'
    const invalidTimezone = 'Invalid/Timezone'
    spyOn(console, 'warn')

    const result = convertToTimezone(isoTimestamp, invalidTimezone)

    expect(console.warn).toHaveBeenCalledWith(
      `Warning: Invalid timezone "${invalidTimezone}". Falling back to UTC.`,
    )
    expect(result.zoneName).toBe('UTC')
  })
})

describe('getCurrentTimeInTimezone', () => {
  it('should return the current time in the specified timezone', () => {
    const timezone = 'America/Los_Angeles'

    // Mock DateTime.now() to return a fixed time
    const mockDateTime = DateTime.fromISO('2024-03-19T12:00:00Z')
    spyOn(DateTime, 'now').mockReturnValue(mockDateTime as DateTime<true>)

    const result = getCurrentTimeInTimezone(timezone)

    expect(result.zoneName).toBe(timezone)
    expect(result.toISO()).toContain('2024-03-19T') // Ensuring correct date
  })

  it('should fallback to UTC if the timezone is invalid', () => {
    const invalidTimezone = 'Invalid/Timezone'

    // Mock DateTime.now() to return a fixed time
    const mockDateTime = DateTime.fromISO('2024-03-19T12:00:00Z')
    spyOn(DateTime, 'now').mockReturnValue(mockDateTime as DateTime<true>)
    spyOn(console, 'warn')

    const result = getCurrentTimeInTimezone(invalidTimezone)

    expect(console.warn).toHaveBeenCalledWith(
      `Warning: Invalid timezone "${invalidTimezone}". Falling back to UTC.`,
    )
    expect(result.zoneName).toBe('UTC')
  })
})

describe('getFormattedTimestamp', () => {
  it('should return a correctly formatted timestamp for a valid timezone', () => {
    const timezone = 'America/New_York'
    const formattedTimestamp = getFormattedTimestamp(timezone)

    const dateTime = DateTime.now().setZone(timezone)
    expect(formattedTimestamp).toContain(
      dateTime.toFormat('EEE, dd LLL yyyy HH'),
    )
  })

  it('should return a UTC formatted timestamp if an invalid timezone is provided', () => {
    const invalidTimezone = 'Invalid/Timezone'
    const consoleWarnSpy = spyOn(console, 'warn').mockImplementation(() => {})

    const formattedTimestamp = getFormattedTimestamp(invalidTimezone)

    const dateTime = DateTime.now().toUTC()
    expect(formattedTimestamp).toContain(
      dateTime.toFormat('EEE, dd LLL yyyy HH'),
    )
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Warning: Invalid timezone \"${invalidTimezone}\". Falling back to UTC.`,
    )
  })

  it('should return different timestamps for different timezones', () => {
    const timestampNY = getFormattedTimestamp('America/New_York')
    const timestampLA = getFormattedTimestamp('America/Los_Angeles')
    expect(timestampNY).not.toBe(timestampLA)
  })
})
