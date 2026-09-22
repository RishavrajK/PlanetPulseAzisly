/**
 * Week utility (DP3): week starts on Sunday, ends on Saturday.
 */

/**
 * Returns the Sunday–Saturday bounds for the current week.
 * @returns {{ start: Date, end: Date }}
 */
export function getWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * Returns a formatted label like "Sep 21 – Sep 27".
 */
export function formatWeekLabel() {
  const { start, end } = getWeekRange();
  const opts = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
}

/**
 * Formats a Date object as "Mon, Sep 22".
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns a YYYY-MM-DD string in LOCAL time for an input[type="date"].
 * Uses local date parts (not toISOString which is UTC) to avoid
 * showing yesterday's date for users in UTC+ timezones after midnight. (FIX-3)
 */
export function toInputDate(date = new Date()) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
