const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/history/:date', authenticateToken, attendanceController.getHistoryByDate);
router.post('/save-proof', authenticateToken, attendanceController.saveProof);
router.post('/save-all', attendanceController.saveAll);
router.post('/import-batch', attendanceController.importBatch);
router.get('/export/excel', authenticateToken, attendanceController.exportExcel);

module.exports = router;
