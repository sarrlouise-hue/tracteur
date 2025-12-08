/**
 * Configuration - Serveur
 * Configuration générale du serveur Express
 */

module.exports = {
  // Port du serveur
  port: process.env.PORT || 4000,

  // Environnement
  env: process.env.NODE_ENV || 'development',

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'allotracteur_secret_key_2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },

  // Rate Limiting (anti-spam/DDoS)
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') // 100 requêtes max
  },

  // Sécurité
  security: {
    // Helmet configuration
    helmet: {
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false
    },

    // Bcrypt salt rounds
    bcryptSaltRounds: 10,

    // Session secret
    sessionSecret: process.env.SESSION_SECRET || 'allotracteur_session_secret'
  },

  // Base URL de l'API
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',

  // Frontend URL (pour redirections)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Validation
  validation: {
    // Longueur minimale mot de passe
    minPasswordLength: 6,

    // Longueur maximale champs texte
    maxTextLength: 500,

    // Taille max upload (5 MB)
    maxUploadSize: 5 * 1024 * 1024
  },

  // Logs
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || 'logs/'
  },

  // Vérifier que les variables critiques sont définies
  validate() {
    const required = ['JWT_SECRET', 'MONGO_URI'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0 && process.env.NODE_ENV === 'production') {
      throw new Error(`Variables d'environnement manquantes: ${missing.join(', ')}`);
    }

    // Vérifier que JWT_SECRET est fort en production
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET doit contenir au moins 32 caractères en production');
      }
    }

    return true;
  }
};
