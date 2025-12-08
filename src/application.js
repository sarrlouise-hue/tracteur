const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/utilitaire.logs');
const { errorHandler } = require('./middleware/middleware.erreurs');
const i18nMiddleware = require('./middleware/middleware.i18n');

const routesAuth = require('./routes/routes.authentification');
const routesPrestataires = require('./routes/routes.prestataires');
const routesMachines = require('./routes/routes.machines');
const routesServices = require('./routes/routes.services');
const routesReservations = require('./routes/routes.reservations');
const routesPaiements = require('./routes/routes.paiements');
const routesAvis = require('./routes/routes.avis');
const routesRecherche = require('./routes/routes.recherche');
const routesAdmin = require('./routes/routes.admin');
const routesProducteur = require('./routes/routes.producteur');
const routesPrestataire = require('./routes/routes.prestataire');
const routesHistorique = require('./routes/routes.historique');
const routesNotifications = require('./routes/routes.notifications');
const routesUtilisateurs = require('./routes/routes.utilisateurs');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});

app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(i18nMiddleware);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bienvenue sur l'API ALLOTRACTEUR",
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      api: "/api",
      documentation: "/api-docs",
      auth: {
        inscription: "POST /api/auth/inscription",
        connexion: "POST /api/auth/connexion",
        verifierOTP: "POST /api/auth/verifier-otp",
        renvoyerOTP: "POST /api/auth/renvoyer-otp"
      },
      prestataires: {
        liste: "GET /api/prestataires",
        profil: "GET /api/prestataires/:id",
        creer: "POST /api/prestataires"
      },
      machines: {
        liste: "GET /api/machines",
        details: "GET /api/machines/:id",
        creer: "POST /api/machines",
        modifier: "PUT /api/machines/:id",
        supprimer: "DELETE /api/machines/:id"
      },
      services: {
        liste: "GET /api/services",
        details: "GET /api/services/:id",
        creer: "POST /api/services"
      },
      reservations: {
        liste: "GET /api/reservations",
        details: "GET /api/reservations/:id",
        creer: "POST /api/reservations",
        modifier: "PUT /api/reservations/:id",
        annuler: "PUT /api/reservations/:id/annuler"
      },
      paiements: {
        initier: "POST /api/payments/initier",
        statut: "GET /api/payments/:id",
        webhook: "POST /api/payments/webhook"
      },
      recherche: {
        machines: "GET /api/recherche/machines",
        services: "GET /api/recherche/services",
        prestataires: "GET /api/recherche/prestataires"
      },
      admin: {
        dashboard: "GET /api/admin/dashboard",
        utilisateurs: "GET /api/admin/utilisateurs",
        statistiques: "GET /api/admin/statistiques"
      },
      producteur: {
        dashboard: "GET /api/producteur/dashboard",
        reservations: "GET /api/producteur/reservations",
        favoris: "GET /api/producteur/favoris"
      },
      prestataire: {
        dashboard: "GET /api/prestataire/dashboard",
        machines: "GET /api/prestataire/machines",
        services: "GET /api/prestataire/services",
        reservations: "GET /api/prestataire/reservations",
        statistiques: "GET /api/prestataire/statistiques"
      }
    },
    status: "OK"
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API ALLOTRACTEUR fonctionnelle',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', routesAuth);
app.use('/api/admin', routesAdmin);
app.use('/api/producteur', routesProducteur);
app.use('/api/prestataire', routesPrestataire);
app.use('/api/prestataires', routesPrestataires);
app.use('/api/machines', routesMachines);
app.use('/api/services', routesServices);
app.use('/api/reservations', routesReservations);
app.use('/api/payments', routesPaiements);
app.use('/api/avis', routesAvis);
app.use('/api/recherche', routesRecherche);
app.use('/api/historique', routesHistorique);
app.use('/api/notifications', routesNotifications);
app.use('/api/users', routesUtilisateurs);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

app.use(errorHandler);

module.exports = app;
