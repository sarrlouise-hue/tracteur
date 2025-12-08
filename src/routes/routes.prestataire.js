const express = require('express');
const router = express.Router();
const prestataireController = require('../controllers/controleur.prestataires');
const { authenticate, isPrestataire } = require('../middleware/middleware.authentification');

router.use(authenticate);
router.use(isPrestataire);

router.get('/dashboard', prestataireController.getDashboardStats);
router.get('/machines', prestataireController.getMesMachines);
router.get('/reservations', prestataireController.getMesReservations);
router.get('/paiements', prestataireController.getMesPaiements);
router.get('/avis', prestataireController.getMesAvis);
router.get('/machines/:machineId/statistiques', prestataireController.getStatistiquesMachine);
router.get('/calendrier', prestataireController.getCalendrierReservations);

module.exports = router;
