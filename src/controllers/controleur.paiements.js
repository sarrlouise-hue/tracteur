const paymentService = require('../services/service.paiements');
const paymentRepo = require('../data-access/depot.paiements');
const logger = require('../utils/utilitaire.logs');

async function createPayment(req, res, next) {
  try {
    const { reservationId, montant, moyen, telephone } = req.body;

    if (!montant || montant < 100) {
      return res.status(400).json({
        success: false,
        message: 'Le montant doit être supérieur ou égal à 100 FCFA'
      });
    }

    const result = await paymentService.createPaymentIntent(
      reservationId,
      montant,
      moyen,
      telephone
    );

    res.status(201).json({
      success: true,
      message: 'Paiement initié avec succès',
      data: {
        payment: result.payment,
        redirectUrl: result.paymentUrl,
        reference: result.reference,
        token: result.token
      }
    });
  } catch (error) {
    logger.error('Erreur createPayment:', error);
    next(error);
  }
}

async function getPayments(req, res, next) {
  try {
    const { limit = 20, skip = 0, status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    
    const payments = await paymentRepo.findByFilter(filter, {
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
    
    const total = await paymentRepo.count(filter);
    
    res.json({
      success: true,
      data: payments,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    logger.error('Erreur getPayments:', error);
    next(error);
  }
}

async function getPaymentById(req, res, next) {
  try {
    const { id } = req.params;
    const payment = await paymentRepo.findById(id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    logger.error('Erreur getPaymentById:', error);
    next(error);
  }
}

async function handleWebhook(req, res, next) {
  try {
    const webhookData = req.body;

    const success = await paymentService.handleWebhook(webhookData);

    if (success) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    logger.error('Erreur handleWebhook:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

async function updatePayment(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const payment = await paymentRepo.update(id, updateData);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    logger.info(`Paiement mis à jour: ${id}`);

    res.json({
      success: true,
      message: 'Paiement mis à jour',
      data: payment
    });
  } catch (error) {
    logger.error('Erreur updatePayment:', error);
    next(error);
  }
}

async function deletePayment(req, res, next) {
  try {
    const { id } = req.params;

    const payment = await paymentRepo.delete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    logger.info(`Paiement supprimé: ${id}`);

    res.json({
      success: true,
      message: 'Paiement supprimé'
    });
  } catch (error) {
    logger.error('Erreur deletePayment:', error);
    next(error);
  }
}

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  handleWebhook,
  updatePayment,
  deletePayment
};
