const express = require('express');
const router = express.Router();
const picketController = require('../controllers/picket.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/dashboard', authenticateToken, picketController.getDashboard);
router.get('/reports', authenticateToken, picketController.getPicketReports);
router.post('/upload', picketController.uploadPicket);

module.exports = router;
