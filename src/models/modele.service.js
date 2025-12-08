const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du service est requis'],
    trim: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  prixUnitaire: {
    type: Number,
    required: [true, 'Le prix unitaire est requis'],
    min: 0
  },
  unite: {
    type: String,
    default: 'hectare',
    enum: ['hectare', 'heure', 'journee', 'piece']
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

ServiceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
