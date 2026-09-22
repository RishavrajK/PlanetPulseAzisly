import { useState, useEffect, useCallback } from 'react';
import { getWeekActivities, getActivities, deleteActivity } from '../services/api';

/** Hook for this week's activities + summary data. */
export function useWeekActivities() {
  const [data, setData] = useState({
    activities: [],
    totalCO2: 0,
    breakdown: {},
    weekStart: null,
    weekEnd: null,
    count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeek = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getWeekActivities();
      setData({
        activities: res.data.data,
        totalCO2: res.data.totalCO2,
        breakdown: res.data.breakdown,
        weekStart: res.data.weekStart,
        weekEnd: res.data.weekEnd,
        count: res.data.count,
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWeek(); }, [fetchWeek]);

  return { ...data, loading, error, refetch: fetchWeek };
}

/** Hook for the history page — all activities with filter support. */
export function useAllActivities(filters = {}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getActivities(filters);
      setActivities(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const remove = async (id) => {
    await deleteActivity(id);
    setActivities((prev) => prev.filter((a) => a._id !== id));
  };

  return { activities, loading, error, refetch: fetchAll, remove };
}
