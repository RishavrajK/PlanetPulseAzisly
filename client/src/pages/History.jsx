import { useState, useMemo } from 'react';
import { useAllActivities } from '../hooks/useActivities';
import ActivityList from '../components/ActivityList';
import { toInputDate } from '../utils/week';

const ACTIVITY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'car', label: 'Car 🚗' },
  { value: 'bus', label: 'Bus 🚌' },
  { value: 'flight', label: 'Flight ✈️' },
  { value: 'electricity', label: 'Electricity ⚡' },
  { value: 'veg_meal', label: 'Veg Meal 🥗' },
  { value: 'non_veg_meal', label: 'Non-Veg Meal 🍖' },
];

export default function History() {
  const [filters, setFilters] = useState({ type: '', startDate: '', endDate: '' });
  const [applied, setApplied] = useState({});

  const { activities, loading, remove } = useAllActivities(applied);
  const safeActivities = Array.isArray(activities) ? activities : [];

  const totalCO2 = useMemo(
    () => safeActivities.reduce((s, a) => s + (a?.co2 || 0), 0),
    [safeActivities]
  );

  const handleFilter = () => setApplied({ ...filters });

  const handleReset = () => {
    setFilters({ type: '', startDate: '', endDate: '' });
    setApplied({});
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Activity History</h1>
        <p className="page-subtitle">Browse, filter, and manage all your logged activities.</p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" id="history-filter-bar">
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-type">Activity Type</label>
          <select
            id="filter-type"
            className="form-control"
            value={filters.type}
            onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
            style={{ padding: 'var(--sp-2) var(--sp-3)' }}
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-start">From</label>
          <input
            id="filter-start"
            type="date"
            className="form-control"
            value={filters.startDate}
            onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
            style={{ padding: 'var(--sp-2) var(--sp-3)' }}
            max={toInputDate()}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-end">To</label>
          <input
            id="filter-end"
            type="date"
            className="form-control"
            value={filters.endDate}
            onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
            style={{ padding: 'var(--sp-2) var(--sp-3)' }}
            max={toInputDate()}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'flex-end' }}>
          <button id="apply-filter-btn" className="btn btn-primary btn-sm" onClick={handleFilter}>
            Apply
          </button>
          <button id="reset-filter-btn" className="btn btn-ghost btn-sm" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* Summary */}
      {!loading && safeActivities.length > 0 && (
        <div className="flex items-center gap-4 mb-4 animate-in" style={{ flexWrap: 'wrap' }}>
          <span className="text-muted text-sm">
            <strong style={{ color: 'var(--color-text)' }}>{safeActivities.length}</strong> activities found
          </span>
          <span className="text-muted text-sm">
            Total: <strong style={{ color: 'var(--color-primary)' }}>{totalCO2.toFixed(3)} kg CO₂</strong>
          </span>
        </div>
      )}

      {/* List */}
      <div className="card animate-in" id="history-activity-list">
        <ActivityList
          activities={safeActivities}
          loading={loading}
          onDelete={remove}
        />
      </div>
    </div>
  );
}
