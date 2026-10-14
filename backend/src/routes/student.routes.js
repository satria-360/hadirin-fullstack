const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/create', authenticateToken, studentController.createStudent);
router.put('/:id/update-piket-day', authenticateToken, studentController.updatePicketDay);

module.exports = router;
