import axios from 'axios';

// In production (Vercel), VITE_API_URL is set to the Railway backend URL.
// In development, falls back to '/api' which is proxied by Vite to localhost:5000.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
