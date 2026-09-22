const Target = require('../models/Target');

// @desc  Get the current weekly target (creates default 20 kg if none exists)
// @route GET /api/target
const getTarget = async (req, res, next) => {
  try {
    let target = await Target.findOne();
    if (!target) {
      target = await Target.create({ weeklyTarget: 20 });
    }
    res.json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};

// @desc  Update (upsert) the weekly target
// @route PUT /api/target
const updateTarget = async (req, res, next) => {
  try {
    const { weeklyTarget } = req.body;
    if (weeklyTarget === undefined || isNaN(parseFloat(weeklyTarget))) {
      return res.status(400).json({ success: false, error: 'weeklyTarget must be a number' });
    }
    const value = parseFloat(weeklyTarget);
    if (value <= 0) {
      return res.status(400).json({ success: false, error: 'weeklyTarget must be greater than 0' });
    }

    // Upsert — always keep a single document
    const target = await Target.findOneAndUpdate(
      {},
      { weeklyTarget: value },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: target });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTarget, updateTarget };
