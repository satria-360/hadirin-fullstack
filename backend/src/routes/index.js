const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const picketRoutes = require('./picket.routes');
const attendanceRoutes = require('./attendance.routes');
const studentRoutes = require('./student.routes');
const userRoutes = require('./user.routes');
const reportRoutes = require('./report.routes');

router.use('/auth', authRoutes);
router.use('/picket', picketRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/students', studentRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
