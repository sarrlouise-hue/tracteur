/**
 * Service - Email (Nodemailer)
 * Service d'envoi d'emails via Gmail
 *
 * Fonctionnalités:
 * - Envoyer code OTP par email
 * - Envoyer emails de bienvenue
 * - Envoyer notifications
 */

const transporter = require('../config/configuration.email');
const logger = require('../utils/utilitaire.logs');

/**
 * Envoyer un email OTP
 * @param {string} destinataire - Email du destinataire
 * @param {string} code - Code OTP à 6 chiffres
 * @param {string} nom - Nom de l'utilisateur (optionnel)
 */
async function envoyerOTP(destinataire, code, nom = 'Utilisateur') {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ALLOTRACTEUR <noreply@allotracteur.sn>',
      to: destinataire,
      subject: 'Code de vérification ALLOTRACTEUR',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2E7D32; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .code { font-size: 32px; font-weight: bold; color: #2E7D32; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #FFF3CD; border-left: 4px solid #FFC107; padding: 10px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌾 ALLOTRACTEUR</h1>
              <p>Plateforme de location de machines agricoles</p>
            </div>
            <div class="content">
              <h2>Bonjour ${nom},</h2>
              <p>Vous avez demandé un code de vérification pour accéder à votre compte ALLOTRACTEUR.</p>

              <div class="code">${code}</div>

              <p>Ce code est valide pendant <strong>10 minutes</strong>.</p>

              <div class="warning">
                <strong>⚠️ Sécurité:</strong> Ne partagez jamais ce code avec qui que ce soit.
                L'équipe ALLOTRACTEUR ne vous demandera jamais votre code de vérification.
              </div>

              <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
            </div>
            <div class="footer">
              <p>ALLOTRACTEUR - Sénégal 🇸🇳</p>
              <p>Au service de l'agriculture sénégalaise 🚜</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email OTP envoyé à ${destinataire}: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    logger.error('❌ Erreur envoi email OTP:', error);
    throw new Error('Échec envoi email: ' + error.message);
  }
}

/**
 * Envoyer un email de bienvenue
 */
async function envoyerBienvenue(destinataire, nom, role) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: destinataire,
      subject: 'Bienvenue sur ALLOTRACTEUR',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #2E7D32; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bienvenue sur ALLOTRACTEUR !</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${nom},</h2>
              <p>Votre compte ${role === 'prestataire' ? 'prestataire' : 'producteur'} a été créé avec succès !</p>
              <p>Vous pouvez maintenant accéder à toutes les fonctionnalités de notre plateforme.</p>
              <p>Merci de rejoindre notre communauté agricole !</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email bienvenue envoyé à ${destinataire}`);
    return { success: true };
  } catch (error) {
    logger.error('❌ Erreur envoi email bienvenue:', error);
    throw error;
  }
}

/**
 * Envoyer email de réinitialisation de mot de passe
 */
async function envoyerResetPassword(destinataire, code, nom = 'Utilisateur') {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ALLOTRACTEUR <noreply@allotracteur.sn>',
      to: destinataire,
      subject: '🔒 Réinitialisation de votre mot de passe',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #D32F2F; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .code { font-size: 32px; font-weight: bold; color: #D32F2F; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #FFEBEE; border-left: 4px solid #D32F2F; padding: 10px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Réinitialisation mot de passe</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${nom},</h2>
              <p>Vous avez demandé à réinitialiser votre mot de passe ALLOTRACTEUR.</p>

              <p>Voici votre code de réinitialisation :</p>
              <div class="code">${code}</div>

              <p>Ce code est valide pendant <strong>15 minutes</strong>.</p>

              <div class="warning">
                <strong>⚠️ IMPORTANT:</strong> Si vous n'avez pas demandé cette réinitialisation,
                veuillez ignorer cet email et votre mot de passe restera inchangé.
              </div>
            </div>
            <div class="footer">
              <p>ALLOTRACTEUR - Sénégal 🇸🇳</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email reset password envoyé à ${destinataire}: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    logger.error('❌ Erreur envoi email reset password:', error);
    throw new Error('Échec envoi email: ' + error.message);
  }
}

/**
 * Envoyer confirmation de changement de mot de passe
 */
async function envoyerConfirmationResetPassword(destinataire, nom = 'Utilisateur') {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ALLOTRACTEUR <noreply@allotracteur.sn>',
      to: destinataire,
      subject: '✅ Votre mot de passe a été modifié',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2E7D32; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .success { background: #E8F5E9; border-left: 4px solid #2E7D32; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Mot de passe modifié</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${nom},</h2>

              <div class="success">
                <strong>✅ Succès!</strong> Votre mot de passe ALLOTRACTEUR a été modifié avec succès.
              </div>

              <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>

              <p>Si vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement.</p>
            </div>
            <div class="footer">
              <p>ALLOTRACTEUR - Sénégal 🇸🇳</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email confirmation reset envoyé à ${destinataire}`);
    return { success: true };
  } catch (error) {
    logger.error('❌ Erreur envoi email confirmation:', error);
    throw error;
  }
}

module.exports = {
  envoyerOTP,
  envoyerBienvenue,
  envoyerResetPassword,
  envoyerConfirmationResetPassword
};
