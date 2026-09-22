import { useState, useEffect } from 'react';
import { getTarget, updateTarget } from '../services/api';

/** Hook for reading and updating the weekly CO₂ target. */
export function useTarget() {
  const [target, setTarget] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTarget()
      .then((res) => setTarget(res.data.data.weeklyTarget))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  const saveTarget = async (value) => {
    try {
      setSaving(true);
      setError(null);
      const res = await updateTarget(parseFloat(value));
      setTarget(res.data.data.weeklyTarget);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { target, loading, saving, error, saveTarget };
}
