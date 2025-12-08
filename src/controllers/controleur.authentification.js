const authService = require('../services/service.authentification');
const logger = require('../utils/utilitaire.logs');

async function register(req, res, next) {
  try {
    const { nom, prenom, telephone, motDePasse, email } = req.body;

    const result = await authService.register({
      nom, prenom, telephone, motDePasse, email
    });
    
    logger.info(`Utilisateur enregistré: ${result.user._id}`);
    
    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: result
    });
  } catch (error) {
    logger.error('Erreur register:', error);
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { telephone, motDePasse } = req.body;
    
    const result = await authService.login(telephone, motDePasse);
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: result
    });
  } catch (error) {
    logger.error('Erreur login:', error);
    next(error);
  }
}

async function requestOTP(req, res, next) {
  try {
    const { telephone } = req.body;
    
    const result = await authService.requestOTP(telephone);
    
    res.json({
      success: true,
      message: 'Code OTP envoyé',
      data: { expiresAt: result.expiresAt }
    });
  } catch (error) {
    logger.error('Erreur requestOTP:', error);
    next(error);
  }
}

async function verifyOTP(req, res, next) {
  try {
    const { telephone, otp } = req.body;
    
    const isValid = await authService.verifyOTP(telephone, otp);
    
    if (isValid) {
      res.json({
        success: true,
        message: 'Code OTP vérifié'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Code OTP invalide ou expiré'
      });
    }
  } catch (error) {
    logger.error('Erreur verifyOTP:', error);
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const userRepo = require('../data-access/depot.utilisateurs');

    const user = await userRepo.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: authService.sanitizeUser(user)
    });
  } catch (error) {
    logger.error('Erreur getProfile:', error);
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await authService.logout(userId);

    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    logger.error('Erreur logout:', error);
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    res.json({
      success: true,
      message: 'Si cet email existe, un code de réinitialisation a été envoyé',
      data: { expiresAt: result.expiresAt }
    });
  } catch (error) {
    logger.error('Erreur forgotPassword:', error);
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { email, otp, nouveauMotDePasse } = req.body;

    const result = await authService.resetPassword(email, otp, nouveauMotDePasse);

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    logger.error('Erreur resetPassword:', error);
    next(error);
  }
}

async function resendOTP(req, res, next) {
  try {
    const { telephone } = req.body;

    const result = await authService.resendOTP(telephone);

    res.json({
      success: true,
      message: 'Code OTP renvoyé',
      data: { expiresAt: result.expiresAt }
    });
  } catch (error) {
    logger.error('Erreur resendOTP:', error);
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const oldToken = req.headers.authorization?.replace('Bearer ', '');

    if (!oldToken) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    const result = await authService.refreshToken(oldToken);

    res.json({
      success: true,
      message: 'Token renouvelé',
      token: result.token
    });
  } catch (error) {
    logger.error('Erreur refreshToken:', error);
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    const result = await authService.changePassword(userId, ancienMotDePasse, nouveauMotDePasse);

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    logger.error('Erreur changePassword:', error);
    next(error);
  }
}

async function verifyOTPAndActivate(req, res, next) {
  try {
    const { telephone, otp } = req.body;

    const result = await authService.verifyOTPAndActivate(telephone, otp);

    res.json({
      success: true,
      message: 'Compte activé avec succès',
      data: result
    });
  } catch (error) {
    logger.error('Erreur verifyOTPAndActivate:', error);
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  requestOTP,
  verifyOTP,
  resendOTP,
  verifyOTPAndActivate,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  getProfile
};
