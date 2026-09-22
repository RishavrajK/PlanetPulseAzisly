const mongoose = require('mongoose');

// Single-document model — only one target record ever exists.
// Always use upsert to read/write.
const targetSchema = new mongoose.Schema(
  {
    weeklyTarget: {
      type: Number,
      default: 20,
      min: [0.1, 'Target must be greater than 0'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Target', targetSchema);
