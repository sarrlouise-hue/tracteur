const mongoose = require('mongoose');

const HistoriqueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['auth', 'reservation', 'payment', 'profile', 'machine', 'service', 'system'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

HistoriqueSchema.index({ userId: 1 });
HistoriqueSchema.index({ type: 1 });
HistoriqueSchema.index({ date: -1 });

module.exports = mongoose.model('Historique', HistoriqueSchema);
