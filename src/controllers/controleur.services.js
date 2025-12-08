const serviceRepo = require('../data-access/depot.services');
const logger = require('../utils/utilitaire.logs');

async function getServices(req, res, next) {
  try {
    const services = await serviceRepo.findAll();
    
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    logger.error('Erreur getServices:', error);
    next(error);
  }
}

async function getServiceById(req, res, next) {
  try {
    const { id } = req.params;
    const service = await serviceRepo.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    logger.error('Erreur getServiceById:', error);
    next(error);
  }
}

async function createService(req, res, next) {
  try {
    const { nom, description, prixUnitaire, unite, image } = req.body;
    
    const service = await serviceRepo.createService({
      nom, description, prixUnitaire, unite, image
    });
    
    logger.info(`Service créé: ${service._id}`);
    
    res.status(201).json({
      success: true,
      message: 'Service créé',
      data: service
    });
  } catch (error) {
    logger.error('Erreur createService:', error);
    next(error);
  }
}

async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const service = await serviceRepo.updateService(id, updateData);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    logger.info(`Service mis à jour: ${id}`);
    
    res.json({
      success: true,
      message: 'Service mis à jour',
      data: service
    });
  } catch (error) {
    logger.error('Erreur updateService:', error);
    next(error);
  }
}

async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    
    const service = await serviceRepo.deleteService(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    logger.info(`Service supprimé: ${id}`);
    
    res.json({
      success: true,
      message: 'Service supprimé'
    });
  } catch (error) {
    logger.error('Erreur deleteService:', error);
    next(error);
  }
}

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
