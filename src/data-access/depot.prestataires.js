const Prestataire = require('../models/modele.prestataire');

async function createPrestataire(data) {
  return await Prestataire.create(data);
}

async function findById(id) {
  return await Prestataire.findById(id)
    .populate('userId', 'nom prenom telephone photoProfil')
    .populate('servicesProposes')
    .populate('machines');
}

async function findByUserId(userId) {
  return await Prestataire.findOne({ userId })
    .populate('servicesProposes')
    .populate('machines');
}

async function findByFilter(filter, options = {}) {
  const { limit = 20, skip = 0, populate = true } = options;
  let query = Prestataire.find(filter).limit(limit).skip(skip);
  if (populate) {
    query = query
      .populate('userId', 'nom prenom telephone photoProfil')
      .populate('servicesProposes')
      .populate('machines');
  }
  return await query;
}

async function findNearby(longitude, latitude, maxDistance = 50000) {
  return await Prestataire.find({
    localisation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    disponibilite: true
  })
  .populate('userId', 'nom prenom telephone photoProfil')
  .populate('servicesProposes')
  .limit(50);
}

async function updatePrestataire(id, data) {
  return await Prestataire.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).populate('userId servicesProposes machines');
}

async function deletePrestataire(id) {
  return await Prestataire.findByIdAndDelete(id);
}

async function count(filter = {}) {
  return await Prestataire.countDocuments(filter);
}

module.exports = {
  createPrestataire,
  findById,
  findByUserId,
  findByFilter,
  findNearby,
  updatePrestataire,
  deletePrestataire,
  count
};
