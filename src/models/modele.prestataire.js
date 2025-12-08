const mongoose = require('mongoose');

const PrestataireSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  localisation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(value) {
          return value.length === 2;
        },
        message: 'Les coordonnées doivent contenir [longitude, latitude]'
      }
    }
  },
  adresse: {
    type: String,
    default: ''
  },
  servicesProposes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  machines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tractor'
  }],
  disponibilite: {
    type: Boolean,
    default: true
  },
  noteGlobale: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  nombreAvis: {
    type: Number,
    default: 0
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

PrestataireSchema.index({ localisation: '2dsphere' });
PrestataireSchema.index({ disponibilite: 1 });

module.exports = mongoose.model('Prestataire', PrestataireSchema);
