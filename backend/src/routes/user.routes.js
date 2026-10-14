const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.put('/profile', authenticateToken, userController.updateProfile);
router.put('/change-password', authenticateToken, userController.changePassword);

module.exports = router;
