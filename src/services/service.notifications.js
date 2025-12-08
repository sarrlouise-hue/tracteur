const Notification = require('../models/modele.notification');
const Historique = require('../models/modele.historique');
const logger = require('../utils/utilitaire.logs');

async function createNotification(destinataireId, titre, message, type, lien = null) {
  try {
    const notification = await Notification.create({
      destinataireId,
      titre,
      message,
      type,
      lien
    });

    logger.info(`📬 Notification créée pour utilisateur ${destinataireId}: ${type}`);
    return notification;
  } catch (error) {
    logger.error('Erreur createNotification:', error);
    throw error;
  }
}

async function createHistoryEntry(data) {
  try {
    const entry = await Historique.create(data);
    logger.info(`📝 Entrée historique créée: ${data.type}`);
    return entry;
  } catch (error) {
    logger.error('Erreur createHistoryEntry:', error);
    throw error;
  }
}

async function notifyReservationCreated(reservation) {
  try {
    const producteur = reservation.producteurId;
    const prestataire = reservation.machineId?.proprietaireId;

    await createNotification(
      producteur._id,
      'Réservation créée',
      `Votre réservation pour ${reservation.machineId?.nom} a été créée avec succès.`,
      'reservation',
      `/reservations/${reservation._id}`
    );

    if (prestataire) {
      await createNotification(
        prestataire._id,
        'Nouvelle réservation',
        `${producteur.prenom} ${producteur.nom} a réservé votre machine ${reservation.machineId?.nom}.`,
        'reservation',
        `/reservations/${reservation._id}`
      );
    }

    await createHistoryEntry({
      utilisateurId: producteur._id,
      type: 'reservation_created',
      description: `Réservation créée pour ${reservation.machineId?.nom}`,
      reservationId: reservation._id,
      machineId: reservation.machineId?._id
    });
  } catch (error) {
    logger.error('Erreur notifyReservationCreated:', error);
  }
}

async function notifyReservationConfirmed(reservation) {
  try {
    await createNotification(
      reservation.producteurId._id,
      'Réservation confirmée',
      `Votre réservation pour ${reservation.machineId?.nom} a été confirmée.`,
      'reservation',
      `/reservations/${reservation._id}`
    );

    await createHistoryEntry({
      utilisateurId: reservation.producteurId._id,
      type: 'reservation_confirmed',
      description: `Réservation confirmée pour ${reservation.machineId?.nom}`,
      reservationId: reservation._id
    });
  } catch (error) {
    logger.error('Erreur notifyReservationConfirmed:', error);
  }
}

async function notifyPaymentCompleted(payment) {
  try {
    await createNotification(
      payment.utilisateurId,
      'Paiement confirmé',
      `Votre paiement de ${payment.montant} FCFA a été confirmé.`,
      'payment',
      `/payments/${payment._id}`
    );

    await createHistoryEntry({
      utilisateurId: payment.utilisateurId,
      type: 'payment_completed',
      description: `Paiement de ${payment.montant} FCFA confirmé`,
      paiementId: payment._id,
      reservationId: payment.reservationId
    });
  } catch (error) {
    logger.error('Erreur notifyPaymentCompleted:', error);
  }
}

async function notifyNewAvis(avis) {
  try {
    const prestataire = avis.machineId?.proprietaireId;

    if (prestataire) {
      await createNotification(
        prestataire._id,
        'Nouvel avis',
        `${avis.auteurId.prenom} a laissé un avis ${avis.note}/5 sur ${avis.machineId?.nom}.`,
        'avis',
        `/machines/${avis.machineId?._id}`
      );
    }

    await createHistoryEntry({
      utilisateurId: avis.auteurId._id,
      type: 'avis_created',
      description: `Avis ${avis.note}/5 laissé sur ${avis.machineId?.nom}`,
      machineId: avis.machineId?._id
    });
  } catch (error) {
    logger.error('Erreur notifyNewAvis:', error);
  }
}

async function notifyMachineCreated(machine) {
  try {
    await createHistoryEntry({
      utilisateurId: machine.proprietaireId,
      type: 'machine_created',
      description: `Machine ${machine.nom} créée`,
      machineId: machine._id
    });
  } catch (error) {
    logger.error('Erreur notifyMachineCreated:', error);
  }
}

async function sendBulkNotifications(userIds, titre, message, type) {
  try {
    const notifications = userIds.map(userId => ({
      destinataireId: userId,
      titre,
      message,
      type
    }));

    await Notification.insertMany(notifications);
    logger.info(`📬 ${notifications.length} notifications envoyées`);
  } catch (error) {
    logger.error('Erreur sendBulkNotifications:', error);
    throw error;
  }
}

module.exports = {
  createNotification,
  createHistoryEntry,
  notifyReservationCreated,
  notifyReservationConfirmed,
  notifyPaymentCompleted,
  notifyNewAvis,
  notifyMachineCreated,
  sendBulkNotifications
};
