const Activity = require('../models/Activity');
const { calculateCO2, isAbsurd } = require('../utils/co2Calculator');

/**
 * Returns the Sunday–Saturday bounds for the week containing a given date.
 * DP3: week starts on Sunday.
 */
function getWeekBounds(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun, 6 = Sat
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// @desc  Get all activities (with optional filters)
// @route GET /api/activities
const getActivities = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
    const filter = {};

    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const activities = await Activity.find(filter).sort({ date: -1 });
    res.json({ success: true, count: activities.length, data: activities });
  } catch (err) {
    next(err);
  }
};

// @desc  Get this week's activities (Sunday → Saturday, DP3)
// @route GET /api/activities/week
const getWeekActivities = async (req, res, next) => {
  try {
    const { start, end } = getWeekBounds();
    const activities = await Activity.find({ date: { $gte: start, $lte: end } }).sort({ date: -1 });

    // Compute summary
    const totalCO2 = parseFloat(activities.reduce((sum, a) => sum + a.co2, 0).toFixed(4));

    // Breakdown by type
    const breakdown = {};
    for (const a of activities) {
      breakdown[a.type] = parseFloat(((breakdown[a.type] || 0) + a.co2).toFixed(4));
    }

    res.json({
      success: true,
      weekStart: start,
      weekEnd: end,
      totalCO2,
      breakdown,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Create a new activity
// @route POST /api/activities
const createActivity = async (req, res, next) => {
  try {
    const { type, quantity, date, note } = req.body;

    if (!type || quantity === undefined) {
      return res.status(400).json({ success: false, error: 'type and quantity are required' });
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, error: 'quantity must be a positive number' });
    }

    const { co2, unit, emissionFactor } = calculateCO2(type, qty);
    const absurdWarning = isAbsurd(type, qty);

    const activity = await Activity.create({
      type,
      quantity: qty,
      unit,
      emissionFactor,
      co2,
      date: date ? new Date(date) : new Date(),
      note: note || '',
    });

    res.status(201).json({
      success: true,
      data: activity,
      absurdWarning, // pass through to client so it can surface the DP2 warning
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete an activity
// @route DELETE /api/activities/:id
const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

module.exports = { getActivities, getWeekActivities, createActivity, deleteActivity };
