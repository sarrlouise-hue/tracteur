/**
 * Routes API - Services Agricoles
 * Gestion des services (Labour, Semis, Récolte, etc.)
 */
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/controleur.services');
const { authenticate, authorize } = require('../middleware/middleware.authentification');

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  serviceController.createService
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  serviceController.updateService
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  serviceController.deleteService
);

module.exports = router;
