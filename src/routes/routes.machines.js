/**
 * Routes API - Machines Agricoles
 * Gestion des tracteurs, moissonneuses et équipements
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const machineController = require('../controllers/controleur.machines');
const { authenticate, authorize } = require('../middleware/middleware.authentification');
const { validate, schemas } = require('../middleware/middleware.validation');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post(
  '/',
  authenticate,
  authorize('prestataire', 'admin'),
  validate(schemas.createTractor),
  machineController.createTractor
);

router.post(
  '/upload',
  authenticate,
  authorize('prestataire', 'admin'),
  upload.array('images', 5),
  machineController.uploadTractorImages
);

router.get('/', machineController.getTractors);
router.get('/:id', machineController.getTractorById);

router.put(
  '/:id',
  authenticate,
  authorize('prestataire', 'admin'),
  machineController.updateTractor
);

router.delete(
  '/:id',
  authenticate,
  authorize('prestataire', 'admin'),
  machineController.deleteTractor
);

module.exports = router;
