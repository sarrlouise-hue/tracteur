const searchService = require('../services/service.recherche');
const logger = require('../utils/utilitaire.logs');

/**
 * Rechercher des prestataires par géolocalisation et filtres
 */
async function rechercherPrestataires(req, res, next) {
  try {
    const { longitude, latitude, rayon, serviceId, disponibilite, limit, page } = req.query;

    const skip = page ? (parseInt(page) - 1) * (parseInt(limit) || 20) : 0;

    const filters = {
      longitude,
      latitude,
      rayon: rayon ? parseInt(rayon) : 50,
      serviceId,
      disponibilite: disponibilite !== 'false',
      limit: parseInt(limit) || 20,
      skip
    };

    const prestataires = await searchService.searchPrestataires(filters);

    res.json({
      success: true,
      data: {
        prestataires,
        total: prestataires.length,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      }
    });
  } catch (error) {
    logger.error('Erreur rechercherPrestataires:', error);
    next(error);
  }
}

/**
 * Rechercher des machines/tracteurs par filtres
 */
async function rechercherMachines(req, res, next) {
  try {
    const { type, marque, disponibilite, prestataireId, limit, page, longitude, latitude, rayon } = req.query;

    const skip = page ? (parseInt(page) - 1) * (parseInt(limit) || 20) : 0;

    const filters = {
      type,
      marque,
      disponibilite: disponibilite !== 'false',
      prestataireId,
      longitude,
      latitude,
      rayon: rayon ? parseInt(rayon) : 50,
      limit: parseInt(limit) || 20,
      skip
    };

    const machines = await searchService.searchTractors(filters);

    res.json({
      success: true,
      data: {
        machines,
        total: machines.length,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      }
    });
  } catch (error) {
    logger.error('Erreur rechercherMachines:', error);
    next(error);
  }
}

/**
 * Rechercher des services agricoles par géolocalisation
 */
async function rechercherServices(req, res, next) {
  try {
    const { type, longitude, latitude, rayon, disponibilite } = req.query;

    // Pour l'instant, recherche simple
    // TODO: Améliorer avec géolocalisation des prestataires offrant le service

    const filters = {
      type,
      disponibilite: disponibilite !== 'false'
    };

    const serviceRepo = require('../data-access/depot.services');
    const services = await serviceRepo.findByFilter(filters);

    res.json({
      success: true,
      data: {
        services,
        total: services.length
      }
    });
  } catch (error) {
    logger.error('Erreur rechercherServices:', error);
    next(error);
  }
}

module.exports = {
  rechercherPrestataires,
  rechercherMachines,
  rechercherServices
};
