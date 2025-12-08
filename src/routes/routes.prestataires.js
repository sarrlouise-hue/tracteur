/**
 * Routes API - Prestataires
 * Gestion des prestataires de services agricoles
 */
const express = require('express');
const router = express.Router();
const prestataireController = require('../controllers/controleur.prestataires');
const { authenticate, authorize, isAdmin } = require('../middleware/middleware.authentification');
const { validate, schemas } = require('../middleware/middleware.validation');

router.post(
  '/',
  authenticate,
  authorize('prestataire', 'admin'),
  validate(schemas.createPrestataire),
  prestataireController.createPrestataire
);

router.get('/', prestataireController.getPrestataires);
router.get('/search', prestataireController.searchNearby);
router.get('/:id', prestataireController.getPrestataireById);

router.put(
  '/:id',
  authenticate,
  authorize('prestataire', 'admin'),
  prestataireController.updatePrestataire
);

router.delete(
  '/:id',
  authenticate,
  isAdmin,
  prestataireController.deletePrestataire
);

module.exports = router;
