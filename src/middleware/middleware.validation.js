const Joi = require('joi');
const logger = require('../utils/utilitaire.logs');

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      logger.warn('Validation error:', errors);
      
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors
      });
    }
    
    next();
  };
}

const schemas = {
  register: Joi.object({
    nom: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Le nom est requis',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères',
      'any.required': 'Le nom est requis'
    }),
    prenom: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Le prénom est requis',
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
      'any.required': 'Le prénom est requis'
    }),
    telephone: Joi.string().pattern(/^221[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Le numéro doit être au format 221XXXXXXXXX',
      'any.required': 'Le numéro de téléphone est requis'
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Email invalide'
    }),
    motDePasse: Joi.string().min(6).max(100).required().messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'string.max': 'Le mot de passe ne peut pas dépasser 100 caractères',
      'any.required': 'Le mot de passe est requis'
    })
    // ROLE RETIRÉ - Toujours 'producteur' par défaut
  }),
  
  login: Joi.object({
    telephone: Joi.string().required().messages({
      'any.required': 'Le téléphone est requis'
    }),
    motDePasse: Joi.string().required().messages({
      'any.required': 'Le mot de passe est requis'
    })
  }),
  
  createPrestataire: Joi.object({
    description: Joi.string().allow(''),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    adresse: Joi.string().allow(''),
    servicesProposes: Joi.array().items(Joi.string())
  }),
  
  createTractor: Joi.object({
    type: Joi.string().valid('Tracteur', 'Moissonneuse', 'Charrue', 'Semoir', 'Autre').required(),
    marque: Joi.string().required(),
    modele: Joi.string().required(),
    annee: Joi.number().integer().min(1950).max(new Date().getFullYear() + 1),
    etat: Joi.string().valid('Neuf', 'Excellent', 'Bon', 'Moyen', 'A réparer'),
    puissance: Joi.string().allow(''),
    prixLocation: Joi.number().min(0),
    description: Joi.string().allow('')
  }),
  
  createReservation: Joi.object({
    prestataireId: Joi.string().required(),
    tractorId: Joi.string(),
    serviceId: Joi.string().required(),
    date: Joi.date().required(),
    heure: Joi.string().required(),
    duree: Joi.number().min(1),
    superficie: Joi.number().min(0),
    adresseTravail: Joi.string().allow(''),
    notes: Joi.string().allow('')
  }),
  
  createReview: Joi.object({
    reservationId: Joi.string().required(),
    note: Joi.number().integer().min(1).max(5).required(),
    commentaire: Joi.string().max(500),
    qualiteService: Joi.number().integer().min(1).max(5),
    ponctualite: Joi.number().integer().min(1).max(5),
    professionnalisme: Joi.number().integer().min(1).max(5)
  })
};

module.exports = {
  validate,
  schemas
};
