const express = require('express');
const router = express.Router();
const producteurController = require('../controllers/controleur.producteur');
const { authenticate, isProducteur } = require('../middleware/middleware.authentification');

router.use(authenticate);
router.use(isProducteur);

router.get('/dashboard', producteurController.getDashboardStats);
router.get('/reservations', producteurController.getMesReservations);
router.get('/paiements', producteurController.getMesPaiements);
router.get('/avis', producteurController.getMesAvis);
router.get('/machines-disponibles', producteurController.getMachinesDisponibles);
router.get('/historique', producteurController.getHistoriqueReservations);

module.exports = router;
