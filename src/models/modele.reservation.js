const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  producteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prestataireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire',
    required: true
  },
  tractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tractor'
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'La date est requise']
  },
  heure: {
    type: String,
    required: [true, 'L\'heure est requise']
  },
  duree: {
    type: Number,
    default: 1
  },
  superficie: {
    type: Number,
    default: 0
  },
  etat: {
    type: String,
    enum: ['en_attente', 'confirme', 'en_cours', 'termine', 'paye', 'annule'],
    default: 'en_attente'
  },
  cout: {
    type: Number,
    required: true,
    min: 0
  },
  localisation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  adresseTravail: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  motifAnnulation: {
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

ReservationSchema.index({ producteurId: 1 });
ReservationSchema.index({ prestataireId: 1 });
ReservationSchema.index({ date: 1 });
ReservationSchema.index({ etat: 1 });

module.exports = mongoose.model('Reservation', ReservationSchema);
