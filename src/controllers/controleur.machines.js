const tractorRepo = require('../data-access/depot.machines');
const prestataireRepo = require('../data-access/depot.prestataires');
const uploadService = require('../services/service.telechargement');
const logger = require('../utils/utilitaire.logs');

async function createTractor(req, res, next) {
  try {
    const { type, marque, modele, annee, etat, puissance, prixLocation, description } = req.body;
    const userId = req.user.id;
    
    const prestataire = await prestataireRepo.findByUserId(userId);
    if (!prestataire) {
      return res.status(403).json({
        success: false,
        message: 'Vous devez être prestataire pour ajouter une machine'
      });
    }
    
    const tractor = await tractorRepo.createTractor({
      prestataireId: prestataire._id,
      type, marque, modele, annee, etat,
      puissance, prixLocation, description
    });
    
    await prestataireRepo.updatePrestataire(prestataire._id, {
      $push: { machines: tractor._id }
    });
    
    logger.info(`Tracteur créé: ${tractor._id}`);
    
    res.status(201).json({
      success: true,
      message: 'Machine ajoutée',
      data: tractor
    });
  } catch (error) {
    logger.error('Erreur createTractor:', error);
    next(error);
  }
}

async function uploadTractorImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }
    
    const uploadPromises = req.files.map(file =>
      uploadService.uploadImage(file.buffer, 'allo-tracteur/tractors')
    );
    
    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map(r => r.url);
    
    res.json({
      success: true,
      message: 'Images uploadées',
      data: { images: imageUrls }
    });
  } catch (error) {
    logger.error('Erreur uploadTractorImages:', error);
    next(error);
  }
}

async function getTractors(req, res, next) {
  try {
    const { type, marque, disponibilite, prestataireId, limit = 20, skip = 0 } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (marque) filter.marque = new RegExp(marque, 'i');
    if (disponibilite !== undefined) filter.disponibilite = disponibilite === 'true';
    if (prestataireId) filter.prestataireId = prestataireId;
    
    const tractors = await tractorRepo.findByFilter(filter, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      populate: true
    });
    
    const total = await tractorRepo.count(filter);
    
    res.json({
      success: true,
      data: tractors,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    logger.error('Erreur getTractors:', error);
    next(error);
  }
}

async function getTractorById(req, res, next) {
  try {
    const { id } = req.params;
    const tractor = await tractorRepo.findById(id);
    
    if (!tractor) {
      return res.status(404).json({
        success: false,
        message: 'Machine non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: tractor
    });
  } catch (error) {
    logger.error('Erreur getTractorById:', error);
    next(error);
  }
}

async function updateTractor(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const tractor = await tractorRepo.updateTractor(id, updateData);
    
    if (!tractor) {
      return res.status(404).json({
        success: false,
        message: 'Machine non trouvée'
      });
    }
    
    logger.info(`Tracteur mis à jour: ${id}`);
    
    res.json({
      success: true,
      message: 'Machine mise à jour',
      data: tractor
    });
  } catch (error) {
    logger.error('Erreur updateTractor:', error);
    next(error);
  }
}

async function deleteTractor(req, res, next) {
  try {
    const { id } = req.params;
    
    const tractor = await tractorRepo.deleteTractor(id);
    
    if (!tractor) {
      return res.status(404).json({
        success: false,
        message: 'Machine non trouvée'
      });
    }
    
    logger.info(`Tracteur supprimé: ${id}`);
    
    res.json({
      success: true,
      message: 'Machine supprimée'
    });
  } catch (error) {
    logger.error('Erreur deleteTractor:', error);
    next(error);
  }
}

module.exports = {
  createTractor,
  uploadTractorImages,
  getTractors,
  getTractorById,
  updateTractor,
  deleteTractor
};
