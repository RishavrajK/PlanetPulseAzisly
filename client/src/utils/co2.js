/**
 * Emission factors — mirrors server/utils/co2Calculator.js exactly.
 * Used client-side for instant CO₂ preview before the API call.
 */
export const EMISSION_FACTORS = {
  car:          { factor: 0.20, unit: 'km',   label: 'Car 🚗' },
  bus:          { factor: 0.08, unit: 'km',   label: 'Bus 🚌' },
  flight:       { factor: 0.25, unit: 'km',   label: 'Flight ✈️' },
  electricity:  { factor: 0.80, unit: 'kWh',  label: 'Electricity ⚡' },
  veg_meal:     { factor: 0.50, unit: 'meal', label: 'Veg Meal 🥗' },
  non_veg_meal: { factor: 2.00, unit: 'meal', label: 'Non-Veg Meal 🍖' },
};

/** Thresholds above which a quantity is flagged as absurd (DP2). */
export const ABSURD_THRESHOLDS = {
  car:          5000,
  bus:          5000,
  flight:       20000,
  electricity:  10000,
  veg_meal:     50,
  non_veg_meal: 50,
};

/**
 * Calculate CO₂ kg for a given type and quantity.
 * @param {string} type
 * @param {number} quantity
 * @returns {number}
 */
export function calculateCO2(type, quantity) {
  const entry = EMISSION_FACTORS[type];
  if (!entry || !quantity) return 0;
  return parseFloat((quantity * entry.factor).toFixed(4));
}

/** Returns true if the quantity crosses the absurd threshold for this type. */
export function isAbsurd(type, quantity) {
  const threshold = ABSURD_THRESHOLDS[type];
  return threshold !== undefined && parseFloat(quantity) > threshold;
}

/** Human-readable label for a type key. */
export function getLabel(type) {
  return EMISSION_FACTORS[type]?.label ?? type;
}

/** Unit string for a type key. */
export function getUnit(type) {
  return EMISSION_FACTORS[type]?.unit ?? '';
}
