/**
 * Utilitaire - OTP (One Time Password)
 * Génération et envoi de codes OTP par EMAIL + SMS
 *
 * Fonctionnalités:
 * - Générer code OTP à 6 chiffres
 * - Envoyer simultanément par EMAIL et SMS
 * - Vérifier expiration (10 minutes)
 */

const emailService = require('../services/service.email');
const smsService = require('../services/service.sms');
const logger = require('./utilitaire.logs');

/**
 * Générer un code OTP aléatoire
 * @param {number} length - Longueur du code (défaut: 6)
 * @returns {string} Code OTP
 */
function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Générer le temps d'expiration
 * @param {number} minutes - Durée de validité (défaut: 10)
 * @returns {Date} Date d'expiration
 */
function generateExpirationTime(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Vérifier si le code OTP est expiré
 * @param {Date} expirationTime - Date d'expiration
 * @returns {boolean} True si encore valide
 */
function verifyOTPExpiration(expirationTime) {
  return new Date() <= new Date(expirationTime);
}

/**
 * Envoyer OTP par EMAIL + SMS simultanément
 * @param {string} email - Email du destinataire
 * @param {string} telephone - Numéro de téléphone (+221XXXXXXXXX)
 * @param {string} otp - Code OTP
 * @param {string} nom - Nom de l'utilisateur
 * @returns {Object} Résultats des envois
 */
async function envoyerOTPComplet(email, telephone, otp, nom = 'Utilisateur') {
  const resultats = {
    email: { success: false },
    sms: { success: false }
  };

  try {
    // Envoi simultané EMAIL + SMS
    const [emailResult, smsResult] = await Promise.allSettled([
      emailService.envoyerOTP(email, otp, nom),
      smsService.envoyerOTP(telephone, otp)
    ]);

    // Résultat EMAIL
    if (emailResult.status === 'fulfilled') {
      resultats.email = emailResult.value;
      logger.info(`✅ OTP Email envoyé à ${email}`);
    } else {
      resultats.email = { success: false, error: emailResult.reason?.message };
      logger.error(`❌ Échec OTP Email: ${emailResult.reason?.message}`);
    }

    // Résultat SMS
    if (smsResult.status === 'fulfilled') {
      resultats.sms = smsResult.value;
      logger.info(`✅ OTP SMS envoyé à ${telephone}`);
    } else {
      resultats.sms = { success: false, error: smsResult.reason?.message };
      logger.error(`❌ Échec OTP SMS: ${smsResult.reason?.message}`);
    }

    // Au moins un canal doit fonctionner
    const auMoinsUnSucces = resultats.email.success || resultats.sms.success;

    return {
      success: auMoinsUnSucces,
      email: resultats.email,
      sms: resultats.sms,
      message: auMoinsUnSucces
        ? 'Code OTP envoyé avec succès'
        : 'Échec envoi OTP sur tous les canaux'
    };
  } catch (error) {
    logger.error('❌ Erreur envoi OTP:', error);
    throw new Error('Erreur lors de l\'envoi du code OTP');
  }
}

/**
 * Envoyer OTP via SMS uniquement (compatibilité)
 * @deprecated Utiliser envoyerOTPComplet() pour EMAIL + SMS
 */
async function sendOTPViaSMS(telephone, otp) {
  try {
    const result = await smsService.envoyerOTP(telephone, otp);
    logger.info(`📱 SMS OTP envoyé à ${telephone}: ${otp}`);
    return result.success;
  } catch (error) {
    logger.error('❌ Erreur SMS OTP:', error);
    return false;
  }
}

/**
 * Envoyer OTP via WhatsApp (future implémentation)
 * @deprecated Utiliser envoyerOTPComplet() pour EMAIL + SMS
 */
async function sendOTPViaWhatsApp(telephone, otp) {
  const message = `🌾 ALLOTRACTEUR\n\nVotre code de vérification: ${otp}\n\nValide pendant 10 minutes.`;
  logger.info(`[WhatsApp SIMULATION] Envoi OTP à ${telephone}: ${otp}`);
  // TODO: Implémenter l'API WhatsApp Business
  return true;
}

module.exports = {
  generateOTP,
  generateExpirationTime,
  verifyOTPExpiration,
  envoyerOTPComplet,
  sendOTPViaSMS,
  sendOTPViaWhatsApp
};
