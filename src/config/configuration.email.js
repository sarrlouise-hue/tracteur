/**
 * Configuration - Email (Nodemailer)
 * Configuration pour l'envoi d'emails via Gmail
 */

const nodemailer = require('nodemailer');

// Créer le transporteur Nodemailer avec Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // false pour port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Vérifier la connexion au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur configuration email:', error);
  } else {
    console.log('✅ Serveur email prêt à envoyer des messages');
  }
});

module.exports = transporter;
