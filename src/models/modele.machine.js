const mongoose = require('mongoose');

const TractorSchema = new mongoose.Schema({
  prestataireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire',
    required: true
  },
  type: {
    type: String,
    enum: ['Tracteur', 'Moissonneuse', 'Charrue', 'Semoir', 'Autre'],
    default: 'Tracteur'
  },
  marque: {
    type: String,
    required: [true, 'La marque est requise'],
    trim: true
  },
  modele: {
    type: String,
    required: [true, 'Le modèle est requis'],
    trim: true
  },
  annee: {
    type: Number,
    min: 1950,
    max: new Date().getFullYear() + 1
  },
  etat: {
    type: String,
    enum: ['Neuf', 'Excellent', 'Bon', 'Moyen', 'A réparer'],
    default: 'Bon'
  },
  puissance: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  disponibilite: {
    type: Boolean,
    default: true
  },
  prixLocation: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
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

TractorSchema.index({ prestataireId: 1 });
TractorSchema.index({ type: 1 });
TractorSchema.index({ disponibilite: 1 });

module.exports = mongoose.model('Tractor', TractorSchema);
