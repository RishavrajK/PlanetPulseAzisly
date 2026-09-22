/**
 * Centralised CO₂ emission factors (kg CO₂ per unit).
 * These are the fixed values specified in the hackathon brief.
 */
const EMISSION_FACTORS = {
  car:         { factor: 0.20, unit: 'km',   label: 'Car' },
  bus:         { factor: 0.08, unit: 'km',   label: 'Bus' },
  flight:      { factor: 0.25, unit: 'km',   label: 'Flight' },
  electricity: { factor: 0.80, unit: 'kWh',  label: 'Electricity' },
  veg_meal:    { factor: 0.50, unit: 'meal', label: 'Veg Meal' },
  non_veg_meal:{ factor: 2.00, unit: 'meal', label: 'Non-Veg Meal' },
};

/**
 * Thresholds above which a quantity is considered "absurd" (DP2).
 * The user is warned but not blocked.
 */
const ABSURD_THRESHOLDS = {
  car:          5000,   // km — ~3× a cross-country drive
  bus:          5000,   // km
  flight:       20000,  // km — exceeds Earth's circumference
  electricity:  10000,  // kWh — ~10× average UK monthly usage
  veg_meal:     50,     // meals — >2 per day for a month
  non_veg_meal: 50,     // meals
};

/**
 * Calculate CO₂ for a given activity type and quantity.
 * @param {string} type - Activity type key
 * @param {number} quantity
 * @returns {{ co2: number, unit: string, emissionFactor: number }}
 */
function calculateCO2(type, quantity) {
  const entry = EMISSION_FACTORS[type];
  if (!entry) throw new Error(`Unknown activity type: ${type}`);
  const co2 = parseFloat((quantity * entry.factor).toFixed(4));
  return { co2, unit: entry.unit, emissionFactor: entry.factor };
}

/**
 * Check whether a quantity is considered absurdly large (DP2).
 * @param {string} type
 * @param {number} quantity
 * @returns {boolean}
 */
function isAbsurd(type, quantity) {
  const threshold = ABSURD_THRESHOLDS[type];
  return threshold !== undefined && quantity > threshold;
}

module.exports = { EMISSION_FACTORS, ABSURD_THRESHOLDS, calculateCO2, isAbsurd };
