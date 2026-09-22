import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const CATEGORY_COLORS = {
  car:          '#ef4444',
  bus:          '#f97316',
  flight:       '#a855f7',
  electricity:  '#eab308',
  veg_meal:     '#22c55e',
  non_veg_meal: '#ec4899',
};

const CATEGORY_LABELS = {
  car:          'Car',
  bus:          'Bus',
  flight:       'Flight',
  electricity:  'Electricity',
  veg_meal:     'Veg Meal',
  non_veg_meal: 'Non-Veg Meal',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div style={{
        background: '#fff', border: '1px solid var(--green-200)',
        borderRadius: 'var(--r-md)', padding: '10px 14px',
        boxShadow: 'var(--shadow-md)', fontSize: '0.875rem',
      }}>
        <div style={{ fontWeight: 700 }}>{item.name}</div>
        <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          {item.value.toFixed(3)} kg CO₂
        </div>
        <div style={{ color: 'var(--color-text-muted)' }}>
          {item.payload.percent.toFixed(1)}%
        </div>
      </div>
    );
  }
  return null;
};

export default function CategoryBreakdown({ breakdown, loading }) {
  if (loading) return <div className="spinner" />;

  const data = Object.entries(breakdown || {})
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: CATEGORY_LABELS[key] ?? key,
      key,
      value: parseFloat(value.toFixed(4)),
      percent: 0, // will be filled by recharts
    }));

  // Calculate percentages for custom tooltip
  const total = data.reduce((s, d) => s + d.value, 0);
  data.forEach((d) => { d.percent = total > 0 ? (d.value / total) * 100 : 0; });

  if (data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: 'var(--sp-8)' }}>
        <div className="empty-icon">📊</div>
        <div className="empty-title">No data yet</div>
        <div className="empty-desc">Log some activities to see your breakdown chart.</div>
      </div>
    );
  }

  return (
    <div id="category-breakdown-card">
      <div className="card-title">CO₂ by Category</div>
      <div className="breakdown-chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="70%"
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={700}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={CATEGORY_COLORS[entry.key] ?? '#94a3b8'}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
