const translations = {
  fr: {
    auth: {
      loginSuccess: 'Connexion réussie',
      loginFailed: 'Identifiants incorrects',
      registerSuccess: 'Inscription réussie',
      emailSent: 'Email envoyé',
      otpSent: 'Code OTP envoyé',
      otpInvalid: 'Code OTP invalide',
      passwordChanged: 'Mot de passe modifié',
      unauthorized: 'Non autorisé',
      tokenInvalid: 'Token invalide ou expiré'
    },
    reservations: {
      created: 'Réservation créée',
      confirmed: 'Réservation confirmée',
      cancelled: 'Réservation annulée',
      notFound: 'Réservation non trouvée',
      alreadyBooked: 'Machine déjà réservée pour ces dates'
    },
    payments: {
      initiated: 'Paiement initié avec succès',
      completed: 'Paiement confirmé',
      failed: 'Paiement échoué',
      minAmount: 'Le montant doit être supérieur ou égal à 100 FCFA'
    },
    machines: {
      created: 'Machine créée',
      updated: 'Machine mise à jour',
      deleted: 'Machine supprimée',
      notFound: 'Machine non trouvée',
      unavailable: 'Machine non disponible'
    },
    users: {
      profileUpdated: 'Profil mis à jour',
      accountActivated: 'Compte activé',
      accountDeactivated: 'Compte désactivé',
      roleChanged: 'Rôle utilisateur modifié'
    },
    errors: {
      serverError: 'Erreur serveur',
      validationError: 'Erreur de validation',
      notFound: 'Ressource non trouvée',
      forbidden: 'Accès interdit'
    }
  },

  wo: {
    auth: {
      loginSuccess: 'Connexion bi baax na',
      loginFailed: 'Informations yi baaxul',
      registerSuccess: 'Inscription bi baax na',
      emailSent: 'Email yi yonnee na',
      otpSent: 'Code OTP yi yonnee na',
      otpInvalid: 'Code OTP bi baaxul',
      passwordChanged: 'Mot de passe bi soppi na',
      unauthorized: 'Amul autorisation',
      tokenInvalid: 'Token bi baaxul walla timissou'
    },
    reservations: {
      created: 'Réservation bi defal na',
      confirmed: 'Réservation bi konfirme na',
      cancelled: 'Réservation bi anulee na',
      notFound: 'Réservation bi gisul',
      alreadyBooked: 'Machine bi reservee na ci fan bii'
    },
    payments: {
      initiated: 'Paiement bi taamee na ak succès',
      completed: 'Paiement bi konfirme na',
      failed: 'Paiement bi dalee',
      minAmount: 'Montant bi war na duggal 100 FCFA'
    },
    machines: {
      created: 'Machine bi defal na',
      updated: 'Machine bi soppi na',
      deleted: 'Machine bi resee na',
      notFound: 'Machine bi gisul',
      unavailable: 'Machine bi amul disponibilité'
    },
    users: {
      profileUpdated: 'Profil bi soppi na',
      accountActivated: 'Compte bi aktive na',
      accountDeactivated: 'Compte bi désaktive na',
      roleChanged: 'Role utilisateur bi soppi na'
    },
    errors: {
      serverError: 'Problème ci serveur',
      validationError: 'Problème ci validation',
      notFound: 'Ressource bi gisul',
      forbidden: 'Accès bi interdit'
    }
  },

  en: {
    auth: {
      loginSuccess: 'Login successful',
      loginFailed: 'Invalid credentials',
      registerSuccess: 'Registration successful',
      emailSent: 'Email sent',
      otpSent: 'OTP code sent',
      otpInvalid: 'Invalid OTP code',
      passwordChanged: 'Password changed',
      unauthorized: 'Unauthorized',
      tokenInvalid: 'Invalid or expired token'
    },
    reservations: {
      created: 'Reservation created',
      confirmed: 'Reservation confirmed',
      cancelled: 'Reservation cancelled',
      notFound: 'Reservation not found',
      alreadyBooked: 'Machine already booked for these dates'
    },
    payments: {
      initiated: 'Payment initiated successfully',
      completed: 'Payment confirmed',
      failed: 'Payment failed',
      minAmount: 'Amount must be greater than or equal to 100 FCFA'
    },
    machines: {
      created: 'Machine created',
      updated: 'Machine updated',
      deleted: 'Machine deleted',
      notFound: 'Machine not found',
      unavailable: 'Machine unavailable'
    },
    users: {
      profileUpdated: 'Profile updated',
      accountActivated: 'Account activated',
      accountDeactivated: 'Account deactivated',
      roleChanged: 'User role changed'
    },
    errors: {
      serverError: 'Server error',
      validationError: 'Validation error',
      notFound: 'Resource not found',
      forbidden: 'Access forbidden'
    }
  }
};

function getTranslation(lang, key) {
  const langCode = lang || 'fr';

  const keys = key.split('.');
  let value = translations[langCode];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }

  return value || key;
}

function translate(req) {
  const lang = req.headers['accept-language']?.split(',')[0]?.substring(0, 2) ||
               req.query.lang ||
               'fr';

  return (key) => getTranslation(lang, key);
}

module.exports = {
  translations,
  getTranslation,
  translate
};
