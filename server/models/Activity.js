const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['car', 'bus', 'flight', 'electricity', 'veg_meal', 'non_veg_meal'],
      required: [true, 'Activity type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.001, 'Quantity must be greater than 0'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['km', 'kWh', 'meal'],
    },
    emissionFactor: {
      type: Number,
      required: true,
    },
    co2: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
    note: {
      type: String,
      default: '',
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Index for efficient week-range queries
activitySchema.index({ date: -1 });
activitySchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Activity', activitySchema);
