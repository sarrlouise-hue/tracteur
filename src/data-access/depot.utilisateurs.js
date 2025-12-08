const User = require('../models/modele.utilisateur');

async function createUser(data) {
  return await User.create(data);
}

async function findById(id) {
  return await User.findById(id);
}

async function findByTelephone(telephone) {
  return await User.findOne({ telephone }).select('+motDePasseHash');
}

async function findByEmail(email) {
  return await User.findOne({ email });
}

async function findByFilter(filter, options = {}) {
  const { limit = 20, skip = 0, select } = options;
  let query = User.find(filter).limit(limit).skip(skip);
  if (select) {
    query = query.select(select);
  }
  return await query;
}

async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

async function count(filter = {}) {
  return await User.countDocuments(filter);
}

module.exports = {
  createUser,
  findById,
  findByTelephone,
  findByEmail,
  findByFilter,
  updateUser,
  deleteUser,
  count
};
