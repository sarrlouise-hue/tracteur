/**
 * Middleware - Gestion des Erreurs
 * Gestion centralisée des erreurs
 */

const logger = require('../utils/utilitaire.logs');

/**
 * Middleware 404 - Route non trouvée
 */
function notFound(req, res, next) {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

/**
 * Middleware de gestion des erreurs
 */
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Logger l'erreur
  logger.error('Erreur:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    statusCode
  });

  // Masquer détails techniques en production
  const response = {
    success: false,
    message: err.message || 'Erreur serveur'
  };

  // Ajouter stack trace seulement en développement
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.url = req.originalUrl;
  }

  // Erreurs spécifiques MongoDB
  if (err.name === 'CastError') {
    response.message = 'ID invalide';
    return res.status(400).json(response);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    response.message = `Ce ${field} est déjà utilisé`;
    return res.status(400).json(response);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    response.message = messages.join(', ');
    return res.status(400).json(response);
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    response.message = 'Token invalide';
    return res.status(401).json(response);
  }

  if (err.name === 'TokenExpiredError') {
    response.message = 'Token expiré';
    return res.status(401).json(response);
  }

  // Erreur par défaut
  res.status(statusCode).json(response);
}

/**
 * Wrapper pour les fonctions async
 * Évite try/catch dans chaque route
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Middleware pour gérer les erreurs non capturées
 */
function setupUncaughtHandlers() {
  // Erreurs non capturées
  process.on('uncaughtException', (error) => {
    logger.error('❌ Uncaught Exception:', error);
    // Ne pas crasher en production - logger et continuer
    if (process.env.NODE_ENV === 'production') {
      // Envoyer alerte (email, Slack, etc.)
      return;
    }
    process.exit(1);
  });

  // Promises rejetées non gérées
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('❌ Unhandled Rejection:', reason);
    // Ne pas crasher en production
    if (process.env.NODE_ENV === 'production') {
      return;
    }
  });
}

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  setupUncaughtHandlers
};
