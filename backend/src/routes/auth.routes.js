const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/request-reset-code', authController.requestResetCode);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticateToken, authController.getMe);
router.post('/generate-invite', authenticateToken, authController.generateInvite);

module.exports = router;
