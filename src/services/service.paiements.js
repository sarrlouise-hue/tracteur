/**
 * Service - Paiements
 * Gestion des paiements via PayTech (Mobile Money Sénégal)
 * Documentation officielle: https://docs.intech.sn/doc_paytech.php
 *
 * Méthodes supportées:
 * - Orange Money
 * - Wave
 * - Free Money
 * - Carte Bancaire
 *
 * Fonctionnalités:
 * - Créer une demande de paiement
 * - Gérer les webhooks PayTech
 * - Vérifier les signatures de sécurité
 */

const axios = require('axios');
const crypto = require('crypto');
const paymentRepo = require('../data-access/depot.paiements');
const reservationRepo = require('../data-access/depot.reservations');
const paytechConfig = require('../config/configuration.paiements');
const logger = require('../utils/utilitaire.logs');

/**
 * Créer une intention de paiement via PayTech
 * @param {string} reservationId - ID de la réservation
 * @param {number} montant - Montant en FCFA
 * @param {string} moyen - Méthode de paiement (orange_money, wave, etc.)
 * @param {string} telephone - Numéro de téléphone client
 * @returns {Object} URL de paiement et token
 */
async function createPaymentIntent(reservationId, montant, moyen, telephone) {
  try {
    // Valider la configuration PayTech
    paytechConfig.validate();

    // Récupérer la réservation
    const reservation = await reservationRepo.findById(reservationId);
    if (!reservation) {
      throw new Error('Réservation non trouvée');
    }

    // Générer une référence unique de paiement
    const referencePaiement = generatePaymentReference();

    // Créer l'enregistrement de paiement en base
    const payment = await paymentRepo.createPayment({
      reservationId,
      montant,
      moyen,
      referencePaiement,
      status: 'pending'
    });

    // Préparer les données pour PayTech (selon la doc officielle)
    const paytechData = {
      // Paramètres obligatoires
      item_name: `Réservation ${reservation.serviceId?.nom || 'Service agricole'}`,
      item_price: montant,
      ref_command: referencePaiement,
      command_name: `Paiement réservation ${reservationId}`,

      // Paramètres optionnels
      currency: paytechConfig.currency, // XOF
      env: paytechConfig.environment, // 'test' ou 'prod'

      // URLs de callback
      ipn_url: paytechConfig.ipnUrl, // Webhook pour notifications
      success_url: paytechConfig.successUrl,
      cancel_url: paytechConfig.cancelUrl,

      // Méthode de paiement spécifique (optionnel)
      target_payment: moyen || undefined,

      // Champ personnalisé (métadonnées)
      custom_field: JSON.stringify({
        reservationId,
        paymentId: payment._id.toString(),
        telephone,
        source: 'ALLOTRACTEUR'
      })
    };

    logger.info(`💳 Initiation paiement PayTech: ${referencePaiement} (${montant} FCFA)`);

    // Appel à l'API PayTech
    const response = await axios.post(
      paytechConfig.getPaymentUrl(),
      paytechData,
      {
        headers: paytechConfig.getHeaders(),
        timeout: paytechConfig.timeout
      }
    );

    // Vérifier la réponse PayTech
    if (response.data.success === 1 || response.data.success === '1') {
      // Mettre à jour le paiement avec le token PayTech
      await paymentRepo.updatePayment(payment._id, {
        transactionId: response.data.token,
        metadata: {
          paytechResponse: response.data,
          redirectUrl: response.data.redirect_url
        }
      });

      logger.info(`✅ Paiement PayTech créé: ${referencePaiement}`);

      return {
        success: true,
        paymentUrl: response.data.redirect_url, // URL de paiement pour le client
        token: response.data.token, // Token unique de transaction
        reference: referencePaiement,
        payment: payment
      };
    } else {
      throw new Error(response.data.message || 'Erreur lors de la création du paiement PayTech');
    }
  } catch (error) {
    logger.error('❌ Erreur createPaymentIntent:', error.message);

    // Log détaillé pour le debug
    if (error.response) {
      logger.error('Réponse PayTech:', error.response.data);
    }

    throw new Error(`Échec création paiement: ${error.message}`);
  }
}

/**
 * Gérer le webhook PayTech (IPN - Instant Payment Notification)
 * Appelé par PayTech après chaque transaction
 *
 * @param {Object} webhookData - Données du webhook PayTech
 * @returns {boolean} True si traité avec succès
 */
async function handleWebhook(webhookData) {
  try {
    logger.info('📬 Réception webhook PayTech:', JSON.stringify(webhookData));

    const {
      ref_command,
      status,
      transaction_id,
      type_event,
      item_price,
      payment_method
    } = webhookData;

    // Trouver le paiement correspondant
    const payment = await paymentRepo.findByReference(ref_command);
    if (!payment) {
      logger.error(`❌ Paiement non trouvé pour référence: ${ref_command}`);
      return false;
    }

    let paymentStatus = 'pending';
    let reservationStatus = payment.reservationId?.etat || 'en_attente';

    // Statut PayTech: 1 = succès, -1 = échec
    if (status === 1 || status === '1' || type_event === 'payment_complete') {
      // Paiement réussi
      paymentStatus = 'success';
      reservationStatus = 'paye';

      await paymentRepo.updatePayment(payment._id, {
        status: paymentStatus,
        datePaiement: new Date(),
        transactionId: transaction_id,
        metadata: {
          ...payment.metadata,
          webhookData: webhookData,
          paymentMethod: payment_method,
          amount: item_price
        }
      });

      // Mettre à jour la réservation
      if (payment.reservationId) {
        await reservationRepo.updateReservation(payment.reservationId._id, {
          etat: reservationStatus,
          paye: true
        });
      }

      logger.info(`✅ Paiement confirmé: ${ref_command} (${item_price} FCFA)`);

    } else if (status === -1 || status === '-1' || type_event === 'payment_failed') {
      // Paiement échoué
      paymentStatus = 'failed';

      await paymentRepo.updatePayment(payment._id, {
        status: paymentStatus,
        errorMessage: webhookData.message || 'Paiement échoué',
        metadata: {
          ...payment.metadata,
          webhookData: webhookData
        }
      });

      logger.warn(`❌ Paiement échoué: ${ref_command}`);

    } else {
      // Statut inconnu
      logger.warn(`⚠️  Statut PayTech inconnu: ${status} pour ${ref_command}`);
    }

    return true;
  } catch (error) {
    logger.error('❌ Erreur handleWebhook:', error.message);
    return false;
  }
}

/**
 * Générer une référence de paiement unique
 * Format: AT-{timestamp}-{random}
 */
function generatePaymentReference() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AT-${timestamp}-${random}`;
}

/**
 * Vérifier la signature du webhook (sécurité)
 * Utilise HMAC-SHA256 avec le secret configuré
 *
 * @param {Object} payload - Données du webhook
 * @param {string} signature - Signature reçue de PayTech
 * @returns {boolean} True si signature valide
 */
function verifyWebhookSignature(payload, signature) {
  try {
    const hash = crypto
      .createHmac('sha256', paytechConfig.callbackSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    const isValid = hash === signature;

    if (!isValid) {
      logger.warn('⚠️  Signature webhook invalide !');
    }

    return isValid;
  } catch (error) {
    logger.error('❌ Erreur vérification signature:', error.message);
    return false;
  }
}

/**
 * Récupérer l'historique des paiements d'un utilisateur
 */
async function getUserPayments(userId, options = {}) {
  try {
    const { limit = 20, skip = 0 } = options;

    const payments = await paymentRepo.findByUserId(userId, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      sort: { createdAt: -1 }
    });

    return payments;
  } catch (error) {
    logger.error('❌ Erreur getUserPayments:', error.message);
    throw error;
  }
}

module.exports = {
  createPaymentIntent,
  handleWebhook,
  verifyWebhookSignature,
  getUserPayments,
  generatePaymentReference
};
