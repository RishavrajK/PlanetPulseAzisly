import { useState } from 'react';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import { useWeekActivities } from '../hooks/useActivities';

export default function LogActivity() {
  const { activities, loading, refetch } = useWeekActivities();
  const [key, setKey] = useState(0);

  const handleSuccess = () => {
    refetch();
    setKey((k) => k + 1);
  };

  const handleDelete = () => {
    refetch(); // FIX-5: id param removed (unused); full refetch keeps list in sync
  };

  // Show only last 5 for quick-view
  const recent = activities.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Log an Activity</h1>
        <p className="page-subtitle">
          Record a daily activity and we'll calculate its CO₂ footprint instantly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)' }}
           className="log-grid">
        {/* Form */}
        <div className="card animate-in">
          <div className="card-title">New Activity</div>
          <ActivityForm key={key} onSuccess={handleSuccess} />
        </div>

        {/* Recent entries */}
        <div className="card animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>This Week's Entries</div>
            <span className="text-xs text-muted">{activities.length} total</span>
          </div>
          <ActivityList
            activities={recent}
            loading={loading}
            onDelete={handleDelete}
          />
          {activities.length > 5 && (
            <p className="text-sm text-muted mt-4" style={{ textAlign: 'center' }}>
              Showing 5 of {activities.length} — <a href="/history" style={{ color: 'var(--color-primary)' }}>View all</a>
            </p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .log-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
