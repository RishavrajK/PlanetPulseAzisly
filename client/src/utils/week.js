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
 * Returns an ISO date string (YYYY-MM-DD) for an input[type="date"].
 */
export function toInputDate(date = new Date()) {
  return new Date(date).toISOString().split('T')[0];
}
