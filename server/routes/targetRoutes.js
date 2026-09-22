const express = require('express');
const router = express.Router();
const { getTarget, updateTarget } = require('../controllers/targetController');

// GET /api/target
// PUT /api/target
router.route('/').get(getTarget).put(updateTarget);

module.exports = router;
