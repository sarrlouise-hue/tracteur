const reservationRepo = require('../data-access/depot.reservations');
const prestataireRepo = require('../data-access/depot.prestataires');
const tractorRepo = require('../data-access/depot.machines');
const serviceRepo = require('../data-access/depot.services');
const Notification = require('../models/modele.notification');
const logger = require('../utils/utilitaire.logs');

async function createBooking(bookingData) {
  const { producteurId, prestataireId, tractorId, serviceId, date, heure, 
          duree, superficie, localisation, adresseTravail, notes } = bookingData;
  
  const prestataire = await prestataireRepo.findById(prestataireId);
  if (!prestataire) throw new Error('Prestataire non trouvé');
  if (!prestataire.disponibilite) throw new Error('Ce prestataire n\'est pas disponible actuellement');
  
  if (tractorId) {
    const tractor = await tractorRepo.findById(tractorId);
    if (!tractor || !tractor.disponibilite) throw new Error('Cette machine n\'est pas disponible');
  }
  
  const service = await serviceRepo.findById(serviceId);
  if (!service) throw new Error('Service non trouvé');
  
  const conflicts = await reservationRepo.findConflicts(prestataireId, date, heure);
  if (conflicts.length > 0) throw new Error('Ce créneau est déjà réservé');
  
  const cout = calculateCost(service, duree, superficie);
  
  const reservation = await reservationRepo.createReservation({
    producteurId, prestataireId, tractorId, serviceId, date, heure,
    duree, superficie, cout, localisation, adresseTravail, notes,
    etat: 'en_attente'
  });
  
  await createNotification({
    userId: prestataire.userId,
    type: 'reservation',
    titre: 'Nouvelle réservation',
    message: `Vous avez une nouvelle demande de réservation pour le ${new Date(date).toLocaleDateString()}`,
    data: { reservationId: reservation._id }
  });
  
  logger.info(`Réservation créée: ${reservation._id}`);
  return reservation;
}

async function confirmBooking(reservationId, prestataireUserId) {
  const reservation = await reservationRepo.findById(reservationId);
  if (!reservation) throw new Error('Réservation non trouvée');
  if (reservation.prestataireId.userId.toString() !== prestataireUserId) throw new Error('Non autorisé');
  if (reservation.etat !== 'en_attente') throw new Error('Cette réservation ne peut pas être confirmée');
  
  const updatedReservation = await reservationRepo.updateReservation(reservationId, { etat: 'confirme' });
  
  await createNotification({
    userId: reservation.producteurId,
    type: 'confirmation',
    titre: 'Réservation confirmée',
    message: 'Votre réservation a été confirmée par le prestataire',
    data: { reservationId }
  });
  
  logger.info(`Réservation confirmée: ${reservationId}`);
  return updatedReservation;
}

async function cancelBooking(reservationId, userId, motif) {
  const reservation = await reservationRepo.findById(reservationId);
  if (!reservation) throw new Error('Réservation non trouvée');
  
  if (reservation.producteurId.toString() !== userId && 
      reservation.prestataireId.userId.toString() !== userId) {
    throw new Error('Non autorisé');
  }
  
  if (['termine', 'paye', 'annule'].includes(reservation.etat)) {
    throw new Error('Cette réservation ne peut pas être annulée');
  }
  
  const updatedReservation = await reservationRepo.updateReservation(reservationId, {
    etat: 'annule',
    motifAnnulation: motif
  });
  
  const notifUserId = reservation.producteurId.toString() === userId
    ? reservation.prestataireId.userId : reservation.producteurId;
  
  await createNotification({
    userId: notifUserId,
    type: 'annulation',
    titre: 'Réservation annulée',
    message: `La réservation du ${new Date(reservation.date).toLocaleDateString()} a été annulée`,
    data: { reservationId, motif }
  });
  
  logger.info(`Réservation annulée: ${reservationId}`);
  return updatedReservation;
}

function calculateCost(service, duree = 1, superficie = 0) {
  let cost = 0;
  if (service.unite === 'hectare') {
    cost = service.prixUnitaire * superficie;
  } else if (service.unite === 'heure' || service.unite === 'journee') {
    cost = service.prixUnitaire * duree;
  } else {
    cost = service.prixUnitaire;
  }
  return Math.round(cost);
}

async function createNotification(notifData) {
  try {
    await Notification.create(notifData);
  } catch (error) {
    logger.error('Erreur création notification:', error);
  }
}

module.exports = {
  createBooking,
  confirmBooking,
  cancelBooking,
  calculateCost
};
