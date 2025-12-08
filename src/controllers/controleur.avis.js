const Review = require('../models/modele.avis');
const reservationRepo = require('../data-access/depot.reservations');
const prestataireRepo = require('../data-access/depot.prestataires');
const logger = require('../utils/utilitaire.logs');

async function createReview(req, res, next) {
  try {
    const producteurId = req.user.id;
    const { reservationId, note, commentaire, qualiteService, ponctualite, professionnalisme } = req.body;
    
    const reservation = await reservationRepo.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }
    
    if (reservation.producteurId.toString() !== producteurId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }
    
    if (reservation.etat !== 'termine' && reservation.etat !== 'paye') {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez évaluer qu\'une réservation terminée'
      });
    }
    
    const existingReview = await Review.findOne({ reservationId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà évalué cette réservation'
      });
    }
    
    const review = await Review.create({
      reservationId,
      prestataireId: reservation.prestataireId,
      producteurId,
      note,
      commentaire,
      qualiteService,
      ponctualite,
      professionnalisme
    });
    
    const reviews = await Review.find({ prestataireId: reservation.prestataireId });
    const averageNote = reviews.reduce((sum, r) => sum + r.note, 0) / reviews.length;
    
    await prestataireRepo.updatePrestataire(reservation.prestataireId, {
      noteGlobale: averageNote,
      nombreAvis: reviews.length
    });
    
    logger.info(`Avis créé: ${review._id}`);
    
    res.status(201).json({
      success: true,
      message: 'Avis ajouté',
      data: review
    });
  } catch (error) {
    logger.error('Erreur createReview:', error);
    next(error);
  }
}

async function getReviewsByPrestataire(req, res, next) {
  try {
    const { prestataireId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const reviews = await Review.find({ prestataireId, isVisible: true })
      .populate('producteurId', 'nom prenom photoProfil')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ prestataireId, isVisible: true });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    logger.error('Erreur getReviewsByPrestataire:', error);
    next(error);
  }
}

async function getAllReviews(req, res, next) {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const reviews = await Review.find({ isVisible: true })
      .populate('producteurId', 'nom prenom photoProfil')
      .populate('prestataireId', 'nom')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ isVisible: true });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    logger.error('Erreur getAllReviews:', error);
    next(error);
  }
}

async function getReviewById(req, res, next) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('producteurId', 'nom prenom photoProfil')
      .populate('prestataireId', 'nom')
      .populate('reservationId');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    logger.error('Erreur getReviewById:', error);
    next(error);
  }
}

async function updateReview(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const review = await Review.findByIdAndUpdate(id, updateData, { new: true });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    logger.info(`Avis mis à jour: ${id}`);

    res.json({
      success: true,
      message: 'Avis mis à jour',
      data: review
    });
  } catch (error) {
    logger.error('Erreur updateReview:', error);
    next(error);
  }
}

async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    logger.info(`Avis supprimé: ${id}`);

    res.json({
      success: true,
      message: 'Avis supprimé'
    });
  } catch (error) {
    logger.error('Erreur deleteReview:', error);
    next(error);
  }
}

module.exports = {
  createReview,
  getReviewsByPrestataire,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
};
