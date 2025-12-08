/**
 * Service - SMS
 * Service d'envoi de SMS via API Sénégalaise
 * Supporte: Orange SMS API, Atos, Intouch
 *
 * Fonctionnalités:
 * - Envoyer code OTP par SMS
 * - Envoyer notifications SMS
 */

const axios = require('axios');
const smsConfig = require('../config/configuration.sms');
const logger = require('../utils/utilitaire.logs');

/**
 * Envoyer un SMS OTP
 * @param {string} telephone - Numéro de téléphone au format +221XXXXXXXXX
 * @param {string} code - Code OTP à 6 chiffres
 */
async function envoyerOTP(telephone, code) {
  try {
    // Si SMS désactivé, simuler l'envoi
    if (!smsConfig.enabled) {
      logger.info(`📱 SMS OTP (SIMULATION) vers ${telephone}: ${code}`);
      return {
        success: true,
        simulated: true,
        message: 'SMS simulé (activer SMS_ENABLED=true dans .env)'
      };
    }

    // Format du numéro de téléphone
    const telFormate = telephone.startsWith('+221') ? telephone : `+221${telephone}`;

    // Message SMS
    const message = smsConfig.templates.otp(code);

    // Envoi via API SMS (Orange SMS API exemple)
    const response = await axios.post(
      smsConfig.apiUrl,
      {
        outboundSMSMessageRequest: {
          address: telFormate,
          senderAddress: smsConfig.sender,
          outboundSMSTextMessage: {
            message: message
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${smsConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    logger.info(`📱 SMS OTP envoyé à ${telFormate}`);

    return {
      success: true,
      messageId: response.data?.outboundSMSMessageRequest?.resourceURL || 'sent',
      provider: 'Orange SMS API'
    };
  } catch (error) {
    logger.error('❌ Erreur envoi SMS OTP:', error.message);

    // Si l'API échoue, logger mais ne pas bloquer
    logger.warn('SMS non envoyé - vérifier configuration SMS_API_KEY et SMS_API_URL');

    return {
      success: false,
      error: error.message,
      simulated: true,
      message: 'SMS non envoyé - vérifier configuration API'
    };
  }
}

/**
 * Envoyer un SMS de notification
 */
async function envoyerNotification(telephone, message) {
  try {
    if (!smsConfig.enabled) {
      logger.info(`📱 SMS notification (SIMULATION) vers ${telephone}`);
      return { success: true, simulated: true };
    }

    const telFormate = telephone.startsWith('+221') ? telephone : `+221${telephone}`;

    const response = await axios.post(
      smsConfig.apiUrl,
      {
        outboundSMSMessageRequest: {
          address: telFormate,
          senderAddress: smsConfig.sender,
          outboundSMSTextMessage: {
            message: message
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${smsConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    logger.info(`📱 SMS notification envoyé à ${telFormate}`);
    return { success: true };
  } catch (error) {
    logger.error('❌ Erreur envoi SMS notification:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  envoyerOTP,
  envoyerNotification
};
