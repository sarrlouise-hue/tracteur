const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  montant: {
    type: Number,
    required: true,
    min: 0
  },
  moyen: {
    type: String,
    enum: ['wave', 'orange_money', 'free_money', 'card', 'especes'],
    required: true
  },
  referencePaiement: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  transactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  datePaiement: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  errorMessage: {
    type: String
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

PaymentSchema.index({ reservationId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ datePaiement: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
