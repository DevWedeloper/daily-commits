import { describe, expect, it } from "bun:test";
import { isSameDay } from './date';

describe("isSameDay function", () => {
  it("should return true for the same date", () => {
    const date1 = new Date(2024, 2, 19); // March 19, 2024
    const date2 = new Date(2024, 2, 19); // March 19, 2024
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it("should return false for different dates", () => {
    const date1 = new Date(2024, 2, 19);
    const date2 = new Date(2024, 2, 20);
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it("should return false for different months", () => {
    const date1 = new Date(2024, 2, 19);
    const date2 = new Date(2024, 3, 19);
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it("should return false for different years", () => {
    const date1 = new Date(2024, 2, 19);
    const date2 = new Date(2025, 2, 19);
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it("should return true if the time differs but the date is the same", () => {
    const date1 = new Date(2024, 2, 19, 8, 30); // March 19, 2024, 08:30 AM
    const date2 = new Date(2024, 2, 19, 20, 45); // March 19, 2024, 08:45 PM
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it("should handle edge cases like different time zones", () => {
    const date1 = new Date("2024-03-19T23:59:59Z"); // UTC time
    const date2 = new Date("2024-03-19T00:00:00-08:00"); // Different timezone
    expect(isSameDay(date1, date2)).toBe(true);
  });
});
