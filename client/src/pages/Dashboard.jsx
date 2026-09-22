import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeekActivities } from '../hooks/useActivities';
import { useTarget } from '../hooks/useTarget';
import DashboardStats from '../components/DashboardStats';
import WeekProgress from '../components/WeekProgress';
import NudgeBanner from '../components/NudgeBanner';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TargetEditor from '../components/TargetEditor';

export default function Dashboard() {
  const { totalCO2, breakdown, count, loading: weekLoading, refetch } = useWeekActivities();
  const { target, loading: targetLoading } = useTarget();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTargetSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
    refetch();
  }, [refetch]);

  const loading = weekLoading || targetLoading;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your carbon footprint at a glance</p>
        </div>
        <Link to="/log" className="btn btn-primary" id="dashboard-log-btn">
          + Log Activity
        </Link>
      </div>

      {/* Stat Cards */}
      <DashboardStats
        totalCO2={totalCO2}
        count={count}
        breakdown={breakdown}
        loading={loading}
      />

      {/* DP1 Nudge Banner — shows only when target exceeded */}
      <NudgeBanner totalCO2={totalCO2} target={target} />

      {/* Week Progress + Target Editor row */}
      <div className="dashboard-grid mt-4">
        <div>
          <WeekProgress totalCO2={totalCO2} target={target} loading={loading} />
        </div>
        <div>
          <TargetEditor key={refreshKey} onTargetSaved={handleTargetSaved} />
        </div>

        {/* Full-width breakdown chart */}
        <div className="full-width card">
          <CategoryBreakdown breakdown={breakdown} loading={loading} />
        </div>
      </div>
    </div>
  );
}
