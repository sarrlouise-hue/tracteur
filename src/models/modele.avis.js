const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true,
    unique: true,
    index: true
  },
  prestataireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire',
    required: true
  },
  producteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: Number,
    required: [true, 'La note est requise'],
    min: 1,
    max: 5
  },
  commentaire: {
    type: String,
    maxlength: 500
  },
  qualiteService: {
    type: Number,
    min: 1,
    max: 5
  },
  ponctualite: {
    type: Number,
    min: 1,
    max: 5
  },
  professionnalisme: {
    type: Number,
    min: 1,
    max: 5
  },
  isVisible: {
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

ReviewSchema.index({ prestataireId: 1 });
ReviewSchema.index({ producteurId: 1 });
ReviewSchema.index({ note: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
