/**
 * DashboardStats — three stat cards showing:
 *  1. Total CO₂ this week
 *  2. Number of activities logged this week
 *  3. Highest-impact activity category
 */
export default function DashboardStats({ totalCO2, count, breakdown, loading }) {
  // Find the highest-impact category
  const topCategory = breakdown
    ? Object.entries(breakdown).sort(([, a], [, b]) => b - a)[0]
    : null;

  const LABELS = {
    car: 'Car 🚗',
    bus: 'Bus 🚌',
    flight: 'Flight ✈️',
    electricity: 'Electricity ⚡',
    veg_meal: 'Veg Meal 🥗',
    non_veg_meal: 'Non-Veg 🍖',
  };

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-card" style={{ opacity: 0.5 }}>
            <div className="stat-label">Loading…</div>
            <div className="stat-value">—</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid animate-in">
      {/* Total CO₂ */}
      <div className="stat-card" id="stat-total-co2">
        <div className="stat-label">This Week</div>
        <div className="stat-value">
          {totalCO2?.toFixed(2) ?? '0.00'}
          <span className="unit"> kg CO₂</span>
        </div>
        <div className="text-muted text-sm mt-2">Total carbon footprint</div>
        <span className="stat-icon">🌍</span>
      </div>

      {/* Activities count */}
      <div className="stat-card" id="stat-activity-count">
        <div className="stat-label">Activities Logged</div>
        <div className="stat-value">{count ?? 0}</div>
        <div className="text-muted text-sm mt-2">This week's entries</div>
        <span className="stat-icon">📋</span>
      </div>

      {/* Top category */}
      <div className="stat-card" id="stat-top-category">
        <div className="stat-label">Highest Impact</div>
        {topCategory ? (
          <>
            <div className="stat-value" style={{ fontSize: '1.4rem' }}>
              {LABELS[topCategory[0]] ?? topCategory[0]}
            </div>
            <div className="text-muted text-sm mt-2">
              {topCategory[1].toFixed(2)} kg CO₂
            </div>
          </>
        ) : (
          <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>
            None yet
          </div>
        )}
        <span className="stat-icon">⚡</span>
      </div>
    </div>
  );
}
