const express = require('express');
const router = express.Router();
const {
  getActivities,
  getWeekActivities,
  createActivity,
  deleteActivity,
} = require('../controllers/activityController');

// GET  /api/activities/week  — MUST be before /:id to avoid conflicts
router.get('/week', getWeekActivities);

// GET  /api/activities        (supports ?type=&startDate=&endDate=)
// POST /api/activities
router.route('/').get(getActivities).post(createActivity);

// DELETE /api/activities/:id
router.delete('/:id', deleteActivity);

module.exports = router;
