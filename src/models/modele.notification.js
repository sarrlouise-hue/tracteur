const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['reservation', 'paiement', 'systeme', 'annulation', 'confirmation', 'rappel'],
    required: true
  },
  titre: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  lu: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lien: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

NotificationSchema.index({ userId: 1, lu: 1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
