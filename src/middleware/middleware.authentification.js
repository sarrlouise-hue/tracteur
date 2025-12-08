const jwt = require('jsonwebtoken');
const serverConfig = require('../config/configuration.serveur');
const logger = require('../utils/utilitaire.logs');

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token non fourni'
      });
    }
    
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;
    
    const decoded = jwt.verify(token, serverConfig.jwt.secret);
    
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Erreur authenticate:', error);
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    next();
  };
}

function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Non authentifié'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux administrateurs'
    });
  }

  next();
}

function isProducteur(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Non authentifié'
    });
  }

  if (req.user.role !== 'producteur') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux producteurs'
    });
  }

  next();
}

function isPrestataire(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Non authentifié'
    });
  }

  if (req.user.role !== 'prestataire') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux prestataires'
    });
  }

  next();
}

module.exports = {
  authenticate,
  authorize,
  isAdmin,
  isProducteur,
  isPrestataire
};
