/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns a Date object configured for Korea Standard Time (KST, Asia/Seoul).
 * Even if the system timezone is different, this Date represents KST year/month/date/day.
 */
export function getTodayKST(): Date {
  const now = new Date();
  // We format to KST and parse to a local Date, so getFullYear, getMonth, getDate, getDay return KST components
  try {
    const kstString = now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
    return new Date(kstString);
  } catch (e) {
    // Fallback in case Intl is not fully supported in simple mock runtimes
    return new Date(now.getTime() + (9 * 60 * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000));
  }
}

/**
 * Helper to get the Korean day name of week
 */
export function getKoreanDayOfWeek(date: Date): string {
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  return days[date.getDay()];
}

/**
 * Returns a string formatted like "5월 15일 금요일"
 */
export function formatKoreanDate(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayName = getKoreanDayOfWeek(date);
  return `${m}월 ${d}일 ${dayName}`;
}

/**
 * Returns a string formatted like "YYYYMMDD"
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

// Alias for formatMealDateKey as mentioned in prompt Section 1
export const formatMealDateKey = formatDateKey;

/**
 * Calculates and returns the list of Monday to Friday Date objects containing the given date.
 */
export function getWeekDates(date: Date): Date[] {
  const currentDay = date.getDay(); // 0 (Sun) to 6 (Sat)
  
  // Calculate difference to Monday. If Sunday(0), Monday is -6. If Sat(6), Monday is -5.
  // Else, difference is 1 - currentDay.
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + distanceToMonday);
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d);
  }
  return weekDates;
}

/**
 * Calculates "M월 N주차" (e.g., "5월 3주차") for the Korean calendar.
 * Monday starts the week.
 */
export function getWeekOfMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const currentDate = date.getDate();
  
  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const dayOfFirst = firstDayOfMonth.getDay(); // 0 is Sun, 1 is Mon, etc.
  
  // Adjust so Monday is 0, Sunday is 6
  const adjustedFirstDay = dayOfFirst === 0 ? 6 : dayOfFirst - 1;
  const week = Math.ceil((currentDate + adjustedFirstDay) / 7);
  return `${month + 1}월 ${week}주차`;
}

/**
 * Adjusts the starting selected date.
 * If today is weekday (Mon-Fri), return today.
 * If Saturday or Sunday, return the next Monday (or preceding Friday if Saturday).
 * To fulfill Way B: "자동으로 월요일 식단(다음 급식일)을 보여준다" -> returns 다음 월요일
 */
export function getDefaultSelectedDate(today: Date): Date {
  const day = today.getDay();
  if (day >= 1 && day <= 5) {
    return today;
  }
  const result = new Date(today);
  if (day === 6) {
    // Saturday -> Go forward 2 days to next Monday
    result.setDate(today.getDate() + 2);
  } else if (day === 0) {
    // Sunday -> Go forward 1 day to next Monday
    result.setDate(today.getDate() + 1);
  }
  return result;
}
