/**
 * Routes API - Avis et Évaluations
 * Gestion des avis clients sur les prestataires
 */
const express = require('express');
const router = express.Router();
const avisController = require('../controllers/controleur.avis');
const { authenticate, isAdmin } = require('../middleware/middleware.authentification');
const { validate, schemas } = require('../middleware/middleware.validation');

router.post(
  '/',
  authenticate,
  validate(schemas.createReview),
  avisController.createReview
);

router.get('/', avisController.getAllReviews);
router.get('/prestataire/:prestataireId', avisController.getReviewsByPrestataire);
router.get('/:id', avisController.getReviewById);
router.put('/:id', authenticate, avisController.updateReview);
router.delete('/:id', authenticate, isAdmin, avisController.deleteReview);

module.exports = router;
