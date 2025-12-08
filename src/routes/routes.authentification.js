const express = require('express');
const router = express.Router();
const authController = require('../controllers/controleur.authentification');
const { authenticate } = require('../middleware/middleware.authentification');
const { validate, schemas } = require('../middleware/middleware.validation');

router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/request-otp', authController.requestOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/verify-otp-activate', authController.verifyOTPAndActivate);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authenticate, authController.changePassword);
router.post('/refresh-token', authController.refreshToken);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
