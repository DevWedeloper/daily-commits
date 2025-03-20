import { DateTime } from 'luxon';

export const isSameDay = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const applyTimezone = (dateTime: DateTime, timezone: string): DateTime => {
  const zoned = dateTime.setZone(timezone);
  if (!zoned.isValid) {
    console.warn(
      `Warning: Invalid timezone "${timezone}". Falling back to UTC.`
    );
    return dateTime.toUTC();
  }
  return zoned;
};

export const convertToTimezone = (isoTimestamp: string, timezone: string) => {
  const dt = DateTime.fromISO(isoTimestamp);
  return applyTimezone(dt, timezone);
};

export const getCurrentTimeInTimezone = (timezone: string) => {
  const dt = DateTime.now();
  return applyTimezone(dt, timezone);
};

export const getFormattedTimestamp = (timezone: string): string => {
  const dt = DateTime.now();
  return applyTimezone(dt, timezone).toFormat(
    "EEE, dd LLL yyyy HH:mm:ss 'GMT'ZZ"
  );
};
