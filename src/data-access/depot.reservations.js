const Reservation = require('../models/modele.reservation');

async function createReservation(data) {
  return await Reservation.create(data);
}

async function findById(id) {
  return await Reservation.findById(id)
    .populate('producteurId', 'nom prenom telephone')
    .populate('prestataireId')
    .populate('tractorId')
    .populate('serviceId');
}

async function findByFilter(filter, options = {}) {
  const { limit = 20, skip = 0, populate = true, sort = { createdAt: -1 } } = options;
  let query = Reservation.find(filter).limit(limit).skip(skip).sort(sort);
  if (populate) {
    query = query
      .populate('producteurId', 'nom prenom telephone photoProfil')
      .populate('prestataireId')
      .populate('tractorId')
      .populate('serviceId');
  }
  return await query;
}

async function findByProducteur(producteurId, options = {}) {
  return await findByFilter({ producteurId }, options);
}

async function findByPrestataire(prestataireId, options = {}) {
  return await findByFilter({ prestataireId }, options);
}

async function findConflicts(prestataireId, date, heure) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return await Reservation.find({
    prestataireId,
    date: { $gte: startOfDay, $lte: endOfDay },
    heure,
    etat: { $in: ['en_attente', 'confirme', 'en_cours'] }
  });
}

async function updateReservation(id, data) {
  return await Reservation.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).populate('producteurId prestataireId tractorId serviceId');
}

async function deleteReservation(id) {
  return await Reservation.findByIdAndDelete(id);
}

async function count(filter = {}) {
  return await Reservation.countDocuments(filter);
}

module.exports = {
  createReservation,
  findById,
  findByFilter,
  findByProducteur,
  findByPrestataire,
  findConflicts,
  updateReservation,
  deleteReservation,
  count
};
