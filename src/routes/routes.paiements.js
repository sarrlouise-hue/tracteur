/**
 * Routes API - Paiements
 * Gestion des paiements mobile money (Wave, Orange Money, Free Money)
 */
const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/controleur.paiements');
const { authenticate, isAdmin } = require('../middleware/middleware.authentification');

router.post('/', authenticate, paiementController.createPayment);
router.get('/', authenticate, paiementController.getPayments);
router.get('/:id', authenticate, paiementController.getPaymentById);
router.put('/:id', authenticate, isAdmin, paiementController.updatePayment);
router.delete('/:id', authenticate, isAdmin, paiementController.deletePayment);

router.post('/webhook', paiementController.handleWebhook);

module.exports = router;
