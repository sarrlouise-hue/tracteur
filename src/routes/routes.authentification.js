const express = require('express');
const router = express.Router();
const authController = require('../controllers/controleur.authentification');
const { authenticate } = require('../middleware/middleware.authentification');
const { validate, schemas } = require('../middleware/middleware.validation');

// ✔️ Inscription
router.post('/inscription', validate(schemas.register), authController.register);

// ✔️ Connexion
router.post('/connexion', validate(schemas.login), authController.login);

// ✔️ Déconnexion
router.post('/logout', authenticate, authController.logout);

// ✔️ Demande OTP
router.post('/demander-otp', authController.requestOTP);

// ✔️ Vérifier OTP
router.post('/verifier-otp', authController.verifyOTP);

// ✔️ Renvoyer OTP
router.post('/renvoyer-otp', authController.resendOTP);

// ✔️ Vérifier OTP + activer compte
router.post('/verifier-otp-activer', authController.verifyOTPAndActivate);

// ✔️ Mot de passe oublié
router.post('/mot-de-passe-oublie', authController.forgotPassword);

// ✔️ Réinitialisation mot de passe
router.post('/reinitialiser-mot-de-passe', authController.resetPassword);

// ✔️ Changer mot de passe connecté
router.post('/changer-mot-de-passe', authenticate, authController.changePassword);

// ✔️ Refresh token
router.post('/refresh-token', authController.refreshToken);

// ✔️ Profil utilisateur
router.get('/profil', authenticate, authController.getProfile);

module.exports = router;
