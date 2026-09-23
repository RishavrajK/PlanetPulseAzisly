import axios from 'axios';

// Normalize VITE_API_URL to handle missing protocol, trailing slashes, or missing /api path
let rawUrl = (import.meta.env.VITE_API_URL || '/api').trim();

if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://') && !rawUrl.startsWith('/')) {
  rawUrl = `https://${rawUrl}`;
}

if (rawUrl.startsWith('http')) {
  rawUrl = rawUrl.replace(/\/+$/, '');
  if (!rawUrl.endsWith('/api')) {
    rawUrl = `${rawUrl}/api`;
  }
}

const api = axios.create({
  baseURL: rawUrl,
  headers: { 'Content-Type': 'application/json' },
});

// ── Activities ────────────────────────────────────────────────────────────────

/** Fetch all activities, optionally filtered. */
export const getActivities = (filters = {}) =>
  api.get('/activities', { params: filters });

/** Fetch activities for the current Sun–Sat week (DP3). */
export const getWeekActivities = () => api.get('/activities/week');

/** Log a new activity. */
export const createActivity = (data) => api.post('/activities', data);

/** Delete an activity by ID. */
export const deleteActivity = (id) => api.delete(`/activities/${id}`);

// ── Target ────────────────────────────────────────────────────────────────────

/** Get the current weekly target (default 20 kg). */
export const getTarget = () => api.get('/target');

/** Update the weekly target. */
export const updateTarget = (weeklyTarget) => api.put('/target', { weeklyTarget });

export default api;
