/**
 * NudgeBanner — DP1: shown when weekly CO₂ exceeds the target.
 * Warns + encourages, never shames or blocks.
 */
export default function NudgeBanner({ totalCO2, target }) {
  const overage = totalCO2 - target;

  // Only show when actually over target. Use explicit null checks (FIX-4):
  // !totalCO2 would suppress the banner when totalCO2 = 0 (correct, but fragile),
  // so we guard with == null instead and also reject target <= 0.
  if (totalCO2 == null || target == null || target <= 0 || totalCO2 <= target) return null;

  return (
    <div className="alert alert-warning animate-in" id="nudge-banner" role="alert">
      <span className="alert-icon">⚠️</span>
      <div className="alert-body">
        <div className="alert-title">
          You've exceeded your weekly target by {overage.toFixed(2)} kg CO₂
        </div>
        <div className="alert-message">
          Small changes still make a big difference. Consider reducing high-impact
          activities — like flights or non-veg meals — for the rest of the week.
          Every action counts! 🌱
        </div>
      </div>
    </div>
  );
}
