import { DateTime } from 'luxon'

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
}

function applyTimezone(dateTime: DateTime, timezone: string): DateTime {
  const zoned = dateTime.setZone(timezone)
  if (!zoned.isValid) {
    console.warn(
      `Warning: Invalid timezone "${timezone}". Falling back to UTC.`,
    )
    return dateTime.toUTC()
  }
  return zoned
}

export function convertToTimezone(isoTimestamp: string, timezone: string) {
  const dt = DateTime.fromISO(isoTimestamp)
  return applyTimezone(dt, timezone)
}

export function getCurrentTimeInTimezone(timezone: string) {
  const dt = DateTime.now()
  return applyTimezone(dt, timezone)
}

export function getFormattedTimestamp(date: Date, timezone: string): string {
  const dateTime = DateTime.fromJSDate(date)
  return applyTimezone(dateTime, timezone).toFormat(
    'EEE, dd LLL yyyy HH:mm:ss \'GMT\'ZZ',
  )
}
