require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./application');
const logger = require('./utils/utilitaire.logs');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

async function demarrerServeur() {
  try {
    logger.info('🌾 ALLOTRACTEUR - Démarrage du serveur...');

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info('✅ Connecté à MongoDB Atlas');

    mongoose.connection.on('error', (err) => {
      logger.error('❌ Erreur MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  Déconnecté de MongoDB');
    });

    const server = app.listen(PORT, () => {
      logger.info(`✅ Serveur démarré sur le port ${PORT}`);
      logger.info(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📡 API disponible sur: http://localhost:${PORT}`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
    });

    process.on('SIGTERM', () => {
      logger.info('👋 Signal SIGTERM reçu, arrêt gracieux...');
      server.close(() => {
        logger.info('✅ Serveur fermé');
        mongoose.connection.close(false, () => {
          logger.info('✅ Connexion MongoDB fermée');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      logger.info('👋 Signal SIGINT reçu, arrêt...');
      server.close(() => {
        logger.info('✅ Serveur fermé');
        mongoose.connection.close(false, () => {
          logger.info('✅ Connexion MongoDB fermée');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    logger.error('❌ Erreur fatale au démarrage:', error);
    process.exit(1);
  }
}

demarrerServeur();
