/**
 * Routes API - Réservations
 * Gestion des réservations de machines et services
 */
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/controleur.reservations');
const { authenticate } = require('../middleware/middleware.authentification');
const { validate, schemas } = require('../middleware/middleware.validation');

router.post(
  '/',
  authenticate,
  validate(schemas.createReservation),
  reservationController.createBooking
);

router.get('/', authenticate, reservationController.getBookings);
router.get('/:id', authenticate, reservationController.getBookingById);

router.put('/:id/confirm', authenticate, reservationController.confirmBooking);
router.put('/:id/cancel', authenticate, reservationController.cancelBooking);
router.put('/:id', authenticate, reservationController.updateBooking);
router.delete('/:id', authenticate, reservationController.deleteBooking);

module.exports = router;
