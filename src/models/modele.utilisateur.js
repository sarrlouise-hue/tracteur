const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  prenom: {
    type: String,
    trim: true
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    unique: true,
    index: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['producteur', 'prestataire', 'admin'],
    default: 'producteur'
  },
  motDePasseHash: {
    type: String,
    select: false
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  photoProfil: {
    type: String,
    default: ''
  },
  entreprise: {
    type: String,
    trim: true
  },
  localisation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    ville: String,
    region: String,
    adresse: String
  },
  otp: {
    type: String,
    select: false
  },
  otpExpiration: {
    type: Date,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
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

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'localisation.coordinates': '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
