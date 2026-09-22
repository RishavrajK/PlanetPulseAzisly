import { formatWeekLabel } from '../utils/week';

/**
 * WeekProgress — shows the current week date range (DP3: Sun→Sat)
 * and a colour-coded progress bar of CO₂ vs target.
 */
export default function WeekProgress({ totalCO2 = 0, target = 20, loading }) {
  const safeTotal = typeof totalCO2 === 'number' && !isNaN(totalCO2) ? totalCO2 : 0;
  const safeTarget = typeof target === 'number' && !isNaN(target) && target > 0 ? target : 20;

  const pct = Math.min((safeTotal / safeTarget) * 100, 100);
  const rawPct = (safeTotal / safeTarget) * 100;

  let barClass = 'safe';
  if (rawPct >= 100) barClass = 'danger';
  else if (rawPct >= 75) barClass = 'caution';

  const weekLabel = formatWeekLabel();

  return (
    <div className="card animate-in" id="week-progress-card">
      <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
        <div>
          <div className="card-title">Weekly Progress</div>
          <span className="week-badge">📅 {weekLabel}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Target</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {loading ? '—' : `${target} kg`}
          </div>
        </div>
      </div>

      <div className="progress-wrap">
        <div className="progress-info">
          <span className="progress-label">
            {loading ? '—' : `${safeTotal.toFixed(2)} / ${safeTarget} kg CO₂`}
          </span>
          <span
            className="progress-pct"
            style={{ color: barClass === 'danger' ? 'var(--red-500)' : barClass === 'caution' ? 'var(--amber-500)' : 'var(--color-primary)' }}
          >
            {loading ? '—' : `${rawPct.toFixed(0)}%`}
          </span>
        </div>
        <div className="progress-track" id="weekly-progress-bar">
          <div
            className={`progress-bar ${barClass}`}
            style={{ width: loading ? '0%' : `${pct}%` }}
            role="progressbar"
            aria-valuenow={rawPct.toFixed(0)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="progress-info mt-2">
          <span className="text-xs text-muted">Sun – Sat week (DP3)</span>
          <span className="text-xs text-muted">
            {loading ? '' : rawPct <= 100
              ? `${(safeTarget - safeTotal).toFixed(2)} kg remaining`
              : `${(safeTotal - safeTarget).toFixed(2)} kg over target`}
          </span>
        </div>
      </div>
    </div>
  );
}
