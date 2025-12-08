const paymentService = require('../services/service.paiements');
const logger = require('../utils/utilitaire.logs');

async function handlePaytechWebhook(req, res) {
  try {
    const signature = req.headers['x-paytech-signature'];
    const payload = req.body;
    
    if (signature) {
      const isValid = paymentService.verifyWebhookSignature(payload, signature);
      if (!isValid) {
        logger.warn('Signature webhook invalide');
        return res.status(401).json({ success: false, message: 'Signature invalide' });
      }
    }
    
    const success = await paymentService.handleWebhook(payload);
    
    if (success) {
      logger.info('Webhook Paytech traité avec succès');
      return res.status(200).json({ success: true });
    } else {
      logger.error('Échec traitement webhook Paytech');
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    logger.error('Erreur webhook Paytech:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

module.exports = {
  handlePaytechWebhook
};
