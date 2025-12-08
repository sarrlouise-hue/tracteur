/**
 * Configuration - SMS
 * Configuration pour l'envoi de SMS via API en ligne
 *
 * APIs SMS RECOMMANDÉES POUR LE SÉNÉGAL:
 *
 * 1. TWILIO (Recommandé - Mondial + Sénégal)
 *    - Site: https://www.twilio.com
 *    - Prix: ~0.05$ par SMS
 *    - Inscription: Gratuit avec crédit test
 *    - Format: SMS_API_URL=https://api.twilio.com/2010-04-01/Accounts/{AccountSID}/Messages.json
 *    - SMS_API_KEY=Account SID
 *    - SMS_API_SECRET=Auth Token
 *
 * 2. VONAGE (ex-Nexmo)
 *    - Site: https://www.vonage.com
 *    - Prix: ~0.05$ par SMS
 *    - Format: SMS_API_URL=https://rest.nexmo.com/sms/json
 *
 * 3. AFRICA'S TALKING (Spécialisé Afrique)
 *    - Site: https://africastalking.com
 *    - Meilleur pour l'Afrique
 *    - Format: SMS_API_URL=https://api.africastalking.com/version1/messaging
 *
 * 4. SMS.TO (Simple)
 *    - Site: https://sms.to
 *    - Très simple d'utilisation
 *    - Format: SMS_API_URL=https://api.sms.to/sms/send
 */

module.exports = {
  // Type de provider SMS ('twilio', 'africastalking', 'vonage', 'sms.to')
  provider: process.env.SMS_PROVIDER || 'twilio',

  // Clés API (à remplir après inscription)
  apiKey: process.env.SMS_API_KEY || '',
  apiSecret: process.env.SMS_API_SECRET || '',

  // URL de l'API (selon le provider)
  apiUrl: process.env.SMS_API_URL || '',

  // Numéro d'expéditeur (format: +221XXXXXXXXX ou nom alphanumérique)
  sender: process.env.SMS_SENDER || 'ALLOTRACTEUR',

  // Activer/Désactiver SMS (true = envoi réel, false = simulation)
  enabled: process.env.SMS_ENABLED === 'true',

  // Templates de messages SMS
  templates: {
    otp: (code) => `ALLOTRACTEUR: Votre code de verification est ${code}. Valide 10 minutes. Ne le partagez pas.`,
    welcome: (nom) => `Bienvenue sur ALLOTRACTEUR ${nom}! Votre compte a ete cree avec succes.`,
    reservation: (ref) => `ALLOTRACTEUR: Votre reservation ${ref} a ete confirmee.`,
    payment: (montant) => `ALLOTRACTEUR: Paiement de ${montant} FCFA recu avec succes.`,
    reminderBooking: (date) => `ALLOTRACTEUR: Rappel - Votre reservation est prevue le ${date}.`
  },

  // Configuration spécifique par provider
  getProviderConfig() {
    switch (this.provider) {
      case 'twilio':
        return {
          accountSid: this.apiKey,
          authToken: this.apiSecret,
          url: this.apiUrl || `https://api.twilio.com/2010-04-01/Accounts/${this.apiKey}/Messages.json`,
          method: 'POST',
          auth: 'basic', // Basic Auth (AccountSID:AuthToken)
          bodyFormat: 'form' // application/x-www-form-urlencoded
        };

      case 'africastalking':
        return {
          apiKey: this.apiKey,
          username: process.env.SMS_USERNAME || 'sandbox',
          url: this.apiUrl || 'https://api.africastalking.com/version1/messaging',
          method: 'POST',
          auth: 'apikey',
          bodyFormat: 'form'
        };

      case 'vonage':
        return {
          apiKey: this.apiKey,
          apiSecret: this.apiSecret,
          url: this.apiUrl || 'https://rest.nexmo.com/sms/json',
          method: 'POST',
          auth: 'params', // API Key + Secret dans les params
          bodyFormat: 'json'
        };

      case 'sms.to':
        return {
          apiKey: this.apiKey,
          url: this.apiUrl || 'https://api.sms.to/sms/send',
          method: 'POST',
          auth: 'bearer', // Bearer Token
          bodyFormat: 'json'
        };

      default:
        throw new Error(`Provider SMS non supporté: ${this.provider}`);
    }
  }
};
