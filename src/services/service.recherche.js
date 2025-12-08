const prestataireRepo = require('../data-access/depot.prestataires');
const tractorRepo = require('../data-access/depot.machines');
const { calculateDistance, kilometersToMeters } = require('../utils/utilitaire.geolocalisation');
const logger = require('../utils/utilitaire.logs');

async function searchPrestataires(filters) {
  const { longitude, latitude, rayon = 50, serviceId, disponibilite = true, limit = 20, skip = 0 } = filters;
  
  try {
    let prestataires = [];
    
    if (longitude && latitude) {
      const maxDistance = kilometersToMeters(rayon);
      prestataires = await prestataireRepo.findNearby(
        parseFloat(longitude),
        parseFloat(latitude),
        maxDistance
      );
    } else {
      prestataires = await prestataireRepo.findByFilter(
        { disponibilite },
        { limit, skip }
      );
    }
    
    if (serviceId) {
      prestataires = prestataires.filter(p =>
        p.servicesProposes.some(s => s._id.toString() === serviceId)
      );
    }
    
    if (longitude && latitude) {
      prestataires = prestataires.map(p => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          p.localisation.coordinates[1],
          p.localisation.coordinates[0]
        );
        return {
          ...p.toObject(),
          distance: Math.round(distance * 10) / 10
        };
      });
      prestataires.sort((a, b) => a.distance - b.distance);
    }
    
    logger.info(`Recherche prestataires: ${prestataires.length} résultats`);
    return prestataires;
  } catch (error) {
    logger.error('Erreur searchPrestataires:', error);
    throw error;
  }
}

async function searchTractors(filters) {
  const { type, marque, disponibilite = true, prestataireId, limit = 20, skip = 0 } = filters;
  
  const query = { disponibilite };
  if (type) query.type = type;
  if (marque) query.marque = new RegExp(marque, 'i');
  if (prestataireId) query.prestataireId = prestataireId;
  
  const tractors = await tractorRepo.findByFilter(query, {
    limit, skip, populate: true
  });
  
  logger.info(`Recherche tracteurs: ${tractors.length} résultats`);
  return tractors;
}

module.exports = {
  searchPrestataires,
  searchTractors
};
