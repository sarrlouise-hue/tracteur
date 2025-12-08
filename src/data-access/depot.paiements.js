const Payment = require('../models/modele.paiement');

async function createPayment(data) {
  return await Payment.create(data);
}

async function findById(id) {
  return await Payment.findById(id).populate('reservationId');
}

async function findByReservationId(reservationId) {
  return await Payment.findOne({ reservationId }).populate('reservationId');
}

async function findByReference(referencePaiement) {
  return await Payment.findOne({ referencePaiement }).populate('reservationId');
}

async function findByFilter(filter, options = {}) {
  const { limit = 20, skip = 0, sort = { createdAt: -1 } } = options;
  return await Payment.find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sort)
    .populate('reservationId');
}

async function updatePayment(id, data) {
  return await Payment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).populate('reservationId');
}

async function updateByReference(referencePaiement, data) {
  return await Payment.findOneAndUpdate(
    { referencePaiement },
    data,
    { new: true, runValidators: true }
  ).populate('reservationId');
}

async function count(filter = {}) {
  return await Payment.countDocuments(filter);
}

module.exports = {
  createPayment,
  findById,
  findByReservationId,
  findByReference,
  findByFilter,
  updatePayment,
  updateByReference,
  count
};
