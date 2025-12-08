const express = require('express');
const router = express.Router();
const rechercheController = require('../controllers/controleur.recherche');

/**
 * Recherche de prestataires avec géolocalisation
 * GET /api/recherche/prestataires?latitude=14.7886&longitude=-16.9318&rayon=50
 */
router.get('/prestataires', rechercheController.rechercherPrestataires);

/**
 * Recherche de machines/tracteurs
 * GET /api/recherche/machines?type=tracteur&disponible=true
 */
router.get('/machines', rechercheController.rechercherMachines);

/**
 * Recherche de services agricoles
 * GET /api/recherche/services?type=labour
 */
router.get('/services', rechercheController.rechercherServices);

module.exports = router;
