/**
 * Service - Authentification
 * Gestion de l'authentification et des OTP
 *
 * Fonctionnalités:
 * - Inscription utilisateur
 * - Connexion avec JWT
 * - Envoi OTP par EMAIL + SMS simultanément
 * - Vérification OTP
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../data-access/depot.utilisateurs');
const { generateOTP, generateExpirationTime, verifyOTPExpiration, envoyerOTPComplet } = require('../utils/utilitaire.otp');
const emailService = require('./service.email');
const serverConfig = require('../config/configuration.serveur');
const logger = require('../utils/utilitaire.logs');

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Object} Utilisateur créé + token JWT
 */
async function register(userData) {
  const { telephone, motDePasse, nom, prenom, email } = userData;

  // Vérifier si le téléphone existe déjà
  const existingUser = await userRepo.findByTelephone(telephone);
  if (existingUser) {
    throw new Error('Ce numéro de téléphone est déjà utilisé');
  }

  // Vérifier si l'email existe déjà
  if (email) {
    const existingEmail = await userRepo.findByEmail(email);
    if (existingEmail) {
      throw new Error('Cet email est déjà utilisé');
    }
  }

  // Hasher le mot de passe
  if (!motDePasse || motDePasse.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }

  const motDePasseHash = await bcrypt.hash(motDePasse, 10);

  // Créer l'utilisateur (TOUJOURS producteur par défaut - admin change dans MongoDB)
  const user = await userRepo.createUser({
    nom,
    prenom,
    telephone,
    email: email || `${telephone}@allotracteur.sn`,
    motDePasseHash,
    role: 'producteur' // FIXE - seul admin peut changer dans MongoDB
  });

  logger.info(`✅ Nouvel utilisateur créé: ${user._id} (${telephone})`);

  // Envoyer email de bienvenue
  if (email) {
    try {
      await emailService.envoyerBienvenue(email, `${prenom} ${nom}`, 'producteur');
    } catch (error) {
      logger.warn('❌ Email bienvenue non envoyé:', error.message);
      // Ne pas bloquer l'inscription si email échoue
    }
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
}

/**
 * Connexion utilisateur
 * @param {string} telephone - Numéro de téléphone
 * @param {string} motDePasse - Mot de passe
 * @returns {Object} Utilisateur + token JWT
 */
async function login(telephone, motDePasse) {
  const user = await userRepo.findByTelephone(telephone);

  if (!user) {
    throw new Error('Identifiants incorrects');
  }

  if (!user.isActive) {
    throw new Error('Ce compte est désactivé');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasseHash);
  if (!isPasswordValid) {
    throw new Error('Identifiants incorrects');
  }

  logger.info(`✅ Connexion utilisateur: ${user._id} (${telephone})`);

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
}

/**
 * Demander un code OTP (envoi EMAIL + SMS simultané)
 * @param {string} telephone - Numéro de téléphone
 * @returns {Object} Informations OTP (sans le code pour sécurité)
 */
async function requestOTP(telephone) {
  // Trouver l'utilisateur
  const user = await userRepo.findByTelephone(telephone);

  if (!user) {
    // Ne pas révéler si l'utilisateur existe ou non (sécurité)
    throw new Error('Utilisateur non trouvé');
  }

  // Générer le code OTP
  const otp = generateOTP();
  const otpExpiration = generateExpirationTime(10); // 10 minutes

  // Envoyer OTP par EMAIL + SMS simultanément
  try {
    const resultat = await envoyerOTPComplet(
      user.email || `${telephone}@allotracteur.sn`,
      telephone,
      otp,
      `${user.prenom} ${user.nom}`
    );

    logger.info(`📧📱 OTP généré pour ${telephone}: Email=${resultat.email.success}, SMS=${resultat.sms.success}`);

    // Sauvegarder l'OTP dans l'utilisateur (optionnel, pour vérification)
    await userRepo.updateUser(user._id, {
      otp: otp,
      otpExpiration: otpExpiration
    });

    return {
      success: resultat.success,
      expiresAt: otpExpiration,
      channels: {
        email: resultat.email.success,
        sms: resultat.sms.success
      },
      message: resultat.message
    };
  } catch (error) {
    logger.error('❌ Erreur requestOTP:', error);
    throw new Error('Impossible d\'envoyer le code OTP');
  }
}

/**
 * Vérifier un code OTP
 * @param {string} telephone - Numéro de téléphone
 * @param {string} otp - Code OTP à vérifier
 * @returns {boolean} True si valide
 */
async function verifyOTP(telephone, otp) {
  const user = await userRepo.findByTelephone(telephone);

  if (!user) {
    logger.warn(`❌ Tentative vérification OTP sur téléphone inexistant: ${telephone}`);
    return false;
  }

  // Vérifier si l'OTP correspond
  if (user.otp !== otp) {
    logger.warn(`❌ OTP incorrect pour ${telephone}`);
    return false;
  }

  // Vérifier si l'OTP est expiré
  if (!verifyOTPExpiration(user.otpExpiration)) {
    logger.warn(`❌ OTP expiré pour ${telephone}`);
    return false;
  }

  logger.info(`✅ OTP vérifié avec succès pour ${telephone}`);

  // Effacer l'OTP après vérification
  await userRepo.updateUser(user._id, {
    otp: null,
    otpExpiration: null,
    isActive: true // Activer le compte si c'était une vérification
  });

  return true;
}

/**
 * Générer un token JWT
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      telephone: user.telephone,
      role: user.role
    },
    serverConfig.jwt.secret,
    { expiresIn: serverConfig.jwt.expiresIn }
  );
}

/**
 * Vérifier un token JWT
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, serverConfig.jwt.secret);
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
}

/**
 * Demander réinitialisation mot de passe (envoi OTP par email)
 * @param {string} email - Email de l'utilisateur
 * @returns {Object} Informations sur l'envoi
 */
async function forgotPassword(email) {
  // Trouver l'utilisateur par email
  const user = await userRepo.findByEmail(email);

  if (!user) {
    // Ne pas révéler si l'utilisateur existe (sécurité)
    throw new Error('Si cet email existe, un code de réinitialisation a été envoyé');
  }

  // Générer le code OTP
  const otp = generateOTP();
  const otpExpiration = generateExpirationTime(15); // 15 minutes pour reset password

  // Envoyer OTP par EMAIL uniquement
  try {
    await emailService.envoyerResetPassword(email, otp, `${user.prenom} ${user.nom}`);

    logger.info(`📧 OTP réinitialisation envoyé à ${email}`);

    // Sauvegarder l'OTP
    await userRepo.updateUser(user._id, {
      otp: otp,
      otpExpiration: otpExpiration
    });

    return {
      success: true,
      message: 'Code de réinitialisation envoyé par email',
      expiresAt: otpExpiration
    };
  } catch (error) {
    logger.error('❌ Erreur forgotPassword:', error);
    throw new Error('Impossible d\'envoyer le code de réinitialisation');
  }
}

/**
 * Réinitialiser le mot de passe avec OTP
 * @param {string} email - Email de l'utilisateur
 * @param {string} otp - Code OTP reçu
 * @param {string} nouveauMotDePasse - Nouveau mot de passe
 * @returns {Object} Confirmation
 */
async function resetPassword(email, otp, nouveauMotDePasse) {
  const user = await userRepo.findByEmail(email);

  if (!user) {
    throw new Error('Email non trouvé');
  }

  // Vérifier l'OTP
  if (user.otp !== otp) {
    throw new Error('Code de réinitialisation incorrect');
  }

  if (!verifyOTPExpiration(user.otpExpiration)) {
    throw new Error('Code de réinitialisation expiré');
  }

  // Valider le nouveau mot de passe
  if (!nouveauMotDePasse || nouveauMotDePasse.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }

  // Hasher le nouveau mot de passe
  const motDePasseHash = await bcrypt.hash(nouveauMotDePasse, 10);

  // Mettre à jour le mot de passe et effacer l'OTP
  await userRepo.updateUser(user._id, {
    motDePasseHash,
    otp: null,
    otpExpiration: null
  });

  logger.info(`✅ Mot de passe réinitialisé pour ${email}`);

  // Envoyer email de confirmation
  try {
    await emailService.envoyerConfirmationResetPassword(email, `${user.prenom} ${user.nom}`);
  } catch (error) {
    logger.warn('❌ Email confirmation non envoyé:', error.message);
  }

  return {
    success: true,
    message: 'Mot de passe réinitialisé avec succès'
  };
}

/**
 * Déconnexion (invalide le token côté client)
 * Note: JWT est stateless, la déconnexion se fait côté client en supprimant le token
 * @param {string} userId - ID de l'utilisateur
 * @returns {Object} Confirmation
 */
async function logout(userId) {
  logger.info(`👋 Déconnexion utilisateur: ${userId}`);

  return {
    success: true,
    message: 'Déconnexion réussie'
  };
}

/**
 * Renvoyer un code OTP (si expiré ou perdu)
 * @param {string} telephone - Numéro de téléphone
 * @returns {Object} Informations OTP
 */
async function resendOTP(telephone) {
  return await requestOTP(telephone);
}

/**
 * Refresh token (renouveler le JWT avant expiration)
 * @param {string} oldToken - Ancien token JWT
 * @returns {Object} Nouveau token
 */
function refreshToken(oldToken) {
  try {
    const decoded = jwt.verify(oldToken, serverConfig.jwt.secret);

    const newToken = jwt.sign(
      {
        id: decoded.id,
        telephone: decoded.telephone,
        role: decoded.role
      },
      serverConfig.jwt.secret,
      { expiresIn: serverConfig.jwt.expiresIn }
    );

    logger.info(`🔄 Token refresh pour utilisateur: ${decoded.id}`);

    return {
      success: true,
      token: newToken
    };
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
}

/**
 * Changer le mot de passe (utilisateur connecté)
 * @param {string} userId - ID utilisateur
 * @param {string} ancienMotDePasse - Ancien mot de passe
 * @param {string} nouveauMotDePasse - Nouveau mot de passe
 * @returns {Object} Confirmation
 */
async function changePassword(userId, ancienMotDePasse, nouveauMotDePasse) {
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Vérifier l'ancien mot de passe
  const isValidPassword = await bcrypt.compare(ancienMotDePasse, user.motDePasseHash);
  if (!isValidPassword) {
    throw new Error('Ancien mot de passe incorrect');
  }

  // Valider le nouveau mot de passe
  if (!nouveauMotDePasse || nouveauMotDePasse.length < 6) {
    throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères');
  }

  // Vérifier que le nouveau est différent de l'ancien
  const isSamePassword = await bcrypt.compare(nouveauMotDePasse, user.motDePasseHash);
  if (isSamePassword) {
    throw new Error('Le nouveau mot de passe doit être différent de l\'ancien');
  }

  // Hasher le nouveau mot de passe
  const motDePasseHash = await bcrypt.hash(nouveauMotDePasse, 10);

  // Mettre à jour
  await userRepo.updateUser(userId, { motDePasseHash });

  logger.info(`✅ Mot de passe changé pour utilisateur: ${userId}`);

  // Envoyer email de confirmation
  if (user.email) {
    try {
      await emailService.envoyerConfirmationResetPassword(user.email, `${user.prenom} ${user.nom}`);
    } catch (error) {
      logger.warn('❌ Email confirmation non envoyé:', error.message);
    }
  }

  return {
    success: true,
    message: 'Mot de passe changé avec succès'
  };
}

/**
 * Vérifier OTP et activer compte
 * @param {string} telephone - Numéro de téléphone
 * @param {string} otp - Code OTP
 * @returns {Object} User + Token si succès
 */
async function verifyOTPAndActivate(telephone, otp) {
  const isValid = await verifyOTP(telephone, otp);

  if (!isValid) {
    throw new Error('Code OTP invalide ou expiré');
  }

  // Récupérer l'utilisateur activé
  const user = await userRepo.findByTelephone(telephone);
  const token = generateToken(user);

  return {
    success: true,
    user: sanitizeUser(user),
    token
  };
}

/**
 * Nettoyer les données utilisateur (retirer le mot de passe)
 */
function sanitizeUser(user) {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.motDePasseHash;
  delete userObj.otp;
  delete userObj.otpExpiration;
  delete userObj.__v;
  return userObj;
}

module.exports = {
  register,
  login,
  logout,
  requestOTP,
  verifyOTP,
  resendOTP,
  verifyOTPAndActivate,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  generateToken,
  verifyToken,
  sanitizeUser
};
