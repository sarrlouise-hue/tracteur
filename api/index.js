const mongoose = require('mongoose');
const app = require('../src/application');

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectToDatabase() {
  if (!MONGO_URI) {
    console.error('[Vercel] MONGO_URI non défini');
    throw new Error('MONGO_URI non défini dans les variables d\'environnement');
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('[Vercel] Utilisation connexion MongoDB existante');
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000
      });
    }

    isConnected = true;
    console.log('[Vercel] Connecté à MongoDB Atlas');
  } catch (error) {
    console.error('[Vercel] Erreur MongoDB:', error.message);
    isConnected = false;
    throw error;
  }
}

module.exports = async (req, res) => {
  try {
    if (!MONGO_URI) {
      console.error('[Vercel] Variables d\'environnement manquantes');
      return res.status(503).json({
        success: false,
        message: 'Service temporairement indisponible',
        error: 'Configuration manquante sur Vercel. Ajoutez MONGO_URI dans Settings → Environment Variables'
      });
    }

    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('[Vercel] Erreur handler:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
};
