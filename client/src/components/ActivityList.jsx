import { useState } from 'react';
import { formatDate } from '../utils/week.js';
import { deleteActivity } from '../services/api.js';

const LABELS = {
  car: 'Car 🚗', bus: 'Bus 🚌', flight: 'Flight ✈️',
  electricity: 'Electricity ⚡', veg_meal: 'Veg Meal 🥗', non_veg_meal: 'Non-Veg 🍖',
};

const UNITS = { car: 'km', bus: 'km', flight: 'km', electricity: 'kWh', veg_meal: 'meal', non_veg_meal: 'meal' };

export default function ActivityList({ activities, loading, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    setDeletingId(id);
    try {
      await deleteActivity(id);
      onDelete?.(id);
    } catch {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="spinner" />;

  if (!activities || activities.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🌿</div>
        <div className="empty-title">No activities found</div>
        <div className="empty-desc">Log your first activity using the button above.</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="activity-table" id="activity-list-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Activity</th>
            <th>Quantity</th>
            <th>CO₂ (kg)</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a) => (
            <tr key={a._id} className="animate-in">
              <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                {formatDate(a.date)}
              </td>
              <td>
                <span className={`badge badge-${a.type}`}>
                  {LABELS[a.type] ?? a.type}
                </span>
              </td>
              <td style={{ color: 'var(--slate-600)' }}>
                {a.quantity} {UNITS[a.type] ?? a.unit}
              </td>
              <td className="activity-co2">
                {a.co2.toFixed(3)}
              </td>
              <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.note || '—'}
              </td>
              <td>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(a._id)}
                  disabled={deletingId === a._id}
                  aria-label={`Delete activity: ${LABELS[a.type]}`}
                  id={`delete-activity-${a._id}`}
                >
                  {deletingId === a._id ? '…' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
