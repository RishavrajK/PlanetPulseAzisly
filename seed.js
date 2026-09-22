/**
 * PlanetPulse — Demo Data Seeder
 * Posts realistic activities to the running API at localhost:5000
 * Run with: node seed.js
 */

const API = 'http://localhost:5000/api/activities';

// ── Demo activities ────────────────────────────────────────────────────────
// Current week: Sep 21 (Sun) – Sep 27 (Sat), 2026
// Target: 20 kg  →  Week total ~21.1 kg  →  triggers DP1 nudge banner ✓
// All 6 activity types represented ✓

const activities = [
  // ── This week (Sep 21–22) ─────────────────────────────────────────────
  // Car 40 km × 0.20 = 8.00 kg
  {
    type: 'car',
    quantity: 40,
    date: '2026-09-22',
    note: 'Morning commute to office',
  },
  // Non-veg meal 1 × 2.00 = 2.00 kg
  {
    type: 'non_veg_meal',
    quantity: 1,
    date: '2026-09-22',
    note: 'Chicken tikka lunch',
  },
  // Electricity 8 kWh × 0.80 = 6.40 kg
  {
    type: 'electricity',
    quantity: 8,
    date: '2026-09-22',
    note: 'Home AC and appliances',
  },
  // Bus 20 km × 0.08 = 1.60 kg
  {
    type: 'bus',
    quantity: 20,
    date: '2026-09-21',
    note: 'Weekend transit to market',
  },
  // Veg meal 3 × 0.50 = 1.50 kg
  {
    type: 'veg_meal',
    quantity: 3,
    date: '2026-09-21',
    note: 'Sunday breakfast, lunch & dinner',
  },
  // Car 8 km × 0.20 = 1.60 kg
  {
    type: 'car',
    quantity: 8,
    date: '2026-09-21',
    note: 'Evening neighbourhood drive',
  },
  // ── Week total: 8.00 + 2.00 + 6.40 + 1.60 + 1.50 + 1.60 = 21.10 kg
  // Target = 20 kg → exceeds by 1.10 kg → DP1 nudge banner fires ✓

  // ── Previous week (Sep 14–20) — history page demo ─────────────────────
  // Flight 600 km × 0.25 = 150.00 kg (Delhi → Mumbai domestic)
  {
    type: 'flight',
    quantity: 600,
    date: '2026-09-15',
    note: 'Delhi to Mumbai — business trip',
  },
  // Car 55 km × 0.20 = 11.00 kg
  {
    type: 'car',
    quantity: 55,
    date: '2026-09-14',
    note: 'Sunday road trip',
  },
  // Electricity 12 kWh × 0.80 = 9.60 kg
  {
    type: 'electricity',
    quantity: 12,
    date: '2026-09-16',
    note: 'Home electricity — weekday',
  },
  // Non-veg meal 2 × 2.00 = 4.00 kg
  {
    type: 'non_veg_meal',
    quantity: 2,
    date: '2026-09-17',
    note: 'Dinner out with family',
  },
];

// ── Seeder ─────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 PlanetPulse Demo Data Seeder\n');

  let weekTotal = 0;
  let successCount = 0;

  for (const activity of activities) {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      const data = await res.json();

      if (data.success) {
        successCount++;
        const isCurrentWeek = activity.date >= '2026-09-21';
        if (isCurrentWeek) weekTotal += data.data.co2;

        const tag = isCurrentWeek ? '[THIS WEEK]' : '[HISTORY  ]';
        const warn = data.absurdWarning ? ' ⚠️  absurd-input flag returned' : '';
        console.log(
          `  ✓ ${tag} ${activity.type.padEnd(14)} ${String(activity.quantity).padStart(5)} ${
            data.data.unit.padEnd(4)
          }  →  ${data.data.co2.toFixed(3).padStart(8)} kg CO₂  ${activity.note}${warn}`
        );
      } else {
        console.error(`  ✗ FAILED  ${activity.type}: ${data.error}`);
      }
    } catch (err) {
      console.error(`  ✗ ERROR   ${activity.type}: ${err.message}`);
    }
  }

  console.log(`\n  Seeded ${successCount}/${activities.length} activities`);
  console.log(`  Current-week CO₂ total : ${weekTotal.toFixed(3)} kg`);
  console.log(`  Weekly target           : 20 kg`);
  console.log(
    weekTotal > 20
      ? `  DP1 nudge banner        : ✓ WILL SHOW (over by ${(weekTotal - 20).toFixed(3)} kg)`
      : `  DP1 nudge banner        : ✗ Will not show (under target)`
  );
  console.log('\n  Open http://localhost:5173 to see the demo.\n');
}

seed().catch((err) => {
  console.error('\n✗ Seeder failed:', err.message);
  console.error('  Is the server running? Try: npm run dev (from project root)');
});
