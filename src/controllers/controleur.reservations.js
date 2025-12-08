const bookingService = require('../services/service.reservations');
const reservationRepo = require('../data-access/depot.reservations');
const logger = require('../utils/utilitaire.logs');

async function createBooking(req, res, next) {
  try {
    const producteurId = req.user.id;
    const bookingData = { ...req.body, producteurId };
    
    const reservation = await bookingService.createBooking(bookingData);
    
    res.status(201).json({
      success: true,
      message: 'Réservation créée',
      data: reservation
    });
  } catch (error) {
    logger.error('Erreur createBooking:', error);
    next(error);
  }
}

async function getBookings(req, res, next) {
  try {
    const userId = req.user.id;
    const { role } = req.user;
    const { limit = 20, skip = 0, etat } = req.query;
    
    const filter = {};
    if (etat) filter.etat = etat;
    
    if (role === 'producteur') {
      filter.producteurId = userId;
    } else if (role === 'prestataire') {
      const prestataireRepo = require('../data-access/depot.prestataires');
      const prestataire = await prestataireRepo.findByUserId(userId);
      if (prestataire) {
        filter.prestataireId = prestataire._id;
      }
    }
    
    const reservations = await reservationRepo.findByFilter(filter, {
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
    
    const total = await reservationRepo.count(filter);
    
    res.json({
      success: true,
      data: reservations,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    logger.error('Erreur getBookings:', error);
    next(error);
  }
}

async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;
    const reservation = await reservationRepo.findById(id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    logger.error('Erreur getBookingById:', error);
    next(error);
  }
}

async function confirmBooking(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const reservation = await bookingService.confirmBooking(id, userId);
    
    res.json({
      success: true,
      message: 'Réservation confirmée',
      data: reservation
    });
  } catch (error) {
    logger.error('Erreur confirmBooking:', error);
    next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const { motif } = req.body;
    const userId = req.user.id;

    const reservation = await bookingService.cancelBooking(id, userId, motif);

    res.json({
      success: true,
      message: 'Réservation annulée',
      data: reservation
    });
  } catch (error) {
    logger.error('Erreur cancelBooking:', error);
    next(error);
  }
}

async function updateBooking(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const reservation = await reservationRepo.update(id, updateData);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    logger.info(`Réservation mise à jour: ${id}`);

    res.json({
      success: true,
      message: 'Réservation mise à jour',
      data: reservation
    });
  } catch (error) {
    logger.error('Erreur updateBooking:', error);
    next(error);
  }
}

async function deleteBooking(req, res, next) {
  try {
    const { id } = req.params;

    const reservation = await reservationRepo.delete(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    logger.info(`Réservation supprimée: ${id}`);

    res.json({
      success: true,
      message: 'Réservation supprimée'
    });
  } catch (error) {
    logger.error('Erreur deleteBooking:', error);
    next(error);
  }
}

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  confirmBooking,
  cancelBooking,
  updateBooking,
  deleteBooking
};
