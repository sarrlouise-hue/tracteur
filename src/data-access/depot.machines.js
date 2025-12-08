const Tractor = require('../models/modele.machine');

async function createTractor(data) {
  return await Tractor.create(data);
}

async function findById(id) {
  return await Tractor.findById(id).populate('prestataireId');
}

async function findByPrestataireId(prestataireId) {
  return await Tractor.find({ prestataireId });
}

async function findByFilter(filter, options = {}) {
  const { limit = 20, skip = 0, populate = false } = options;
  let query = Tractor.find(filter).limit(limit).skip(skip);
  if (populate) {
    query = query.populate('prestataireId');
  }
  return await query;
}

async function updateTractor(id, data) {
  return await Tractor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
}

async function deleteTractor(id) {
  return await Tractor.findByIdAndDelete(id);
}

async function count(filter = {}) {
  return await Tractor.countDocuments(filter);
}

module.exports = {
  createTractor,
  findById,
  findByPrestataireId,
  findByFilter,
  updateTractor,
  deleteTractor,
  count
};
