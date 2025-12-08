const Service = require('../models/modele.service');

async function createService(data) {
  return await Service.create(data);
}

async function findById(id) {
  return await Service.findById(id);
}

async function findByFilter(filter, options = {}) {
  const { limit = 50, skip = 0 } = options;
  return await Service.find(filter).limit(limit).skip(skip);
}

async function findAll() {
  return await Service.find({ isActive: true });
}

async function updateService(id, data) {
  return await Service.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
}

async function deleteService(id) {
  return await Service.findByIdAndDelete(id);
}

async function count(filter = {}) {
  return await Service.countDocuments(filter);
}

module.exports = {
  createService,
  findById,
  findByFilter,
  findAll,
  updateService,
  deleteService,
  count
};
