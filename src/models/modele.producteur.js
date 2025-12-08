const mongoose = require('mongoose');

const ProducteurSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  localisation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
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
  superficie: {
    type: Number,
    default: 0
  },
  typeCulture: {
    type: [String],
    default: []
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

ProducteurSchema.index({ localisation: '2dsphere' });

module.exports = mongoose.model('Producteur', ProducteurSchema);
