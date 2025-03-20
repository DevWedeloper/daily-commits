import { DateTime } from 'luxon';

export const isSameDay = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const convertToTimezone = (isoTimestamp: string, timezone: string) =>
  DateTime.fromISO(isoTimestamp).setZone(timezone);

export const getCurrentTimeInTimezone = (timezone: string) =>
  DateTime.now().setZone(timezone);

export const getFormattedTimestamp = (timezone: string): string => {
  const getDateTime = () => {
    const dateTime = DateTime.now().setZone(timezone);

    if (!dateTime.isValid) {
      console.warn(
        `Warning: Invalid timezone "${timezone}". Falling back to UTC.`
      );
      return DateTime.now().toUTC();
    }

    return dateTime;
  };

  return getDateTime().toFormat("EEE, dd LLL yyyy HH:mm:ss 'GMT'ZZ");
};
