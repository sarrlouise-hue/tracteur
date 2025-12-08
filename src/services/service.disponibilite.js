const Reservation = require('../models/modele.reservation');
const Machine = require('../models/modele.machine');
const logger = require('../utils/utilitaire.logs');

async function checkAvailability(machineId, dateDebut, dateFin, excludeReservationId = null) {
  try {
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    if (startDate >= endDate) {
      return {
        available: false,
        reason: 'La date de fin doit être après la date de début'
      };
    }

    if (startDate < new Date()) {
      return {
        available: false,
        reason: 'La date de début ne peut pas être dans le passé'
      };
    }

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return {
        available: false,
        reason: 'Machine non trouvée'
      };
    }

    if (!machine.disponible) {
      return {
        available: false,
        reason: 'Machine marquée comme non disponible'
      };
    }

    const query = {
      machineId,
      statut: { $in: ['en_attente', 'confirmee', 'en_cours'] },
      $or: [
        {
          dateDebut: { $lte: endDate },
          dateFin: { $gte: startDate }
        }
      ]
    };

    if (excludeReservationId) {
      query._id = { $ne: excludeReservationId };
    }

    const conflictingReservations = await Reservation.find(query);

    if (conflictingReservations.length > 0) {
      return {
        available: false,
        reason: 'Machine déjà réservée pour ces dates',
        conflictingReservations: conflictingReservations.map(r => ({
          id: r._id,
          dateDebut: r.dateDebut,
          dateFin: r.dateFin,
          statut: r.statut
        }))
      };
    }

    return {
      available: true,
      message: 'Machine disponible pour ces dates'
    };
  } catch (error) {
    logger.error('Erreur checkAvailability:', error);
    throw error;
  }
}

async function getAvailableDates(machineId, startDate, endDate) {
  try {
    const reservations = await Reservation.find({
      machineId,
      statut: { $in: ['confirmee', 'en_cours'] },
      dateDebut: { $lte: new Date(endDate) },
      dateFin: { $gte: new Date(startDate) }
    }).sort({ dateDebut: 1 });

    const unavailablePeriods = reservations.map(r => ({
      start: r.dateDebut,
      end: r.dateFin
    }));

    return {
      availablePeriods: calculateAvailablePeriods(
        new Date(startDate),
        new Date(endDate),
        unavailablePeriods
      ),
      unavailablePeriods
    };
  } catch (error) {
    logger.error('Erreur getAvailableDates:', error);
    throw error;
  }
}

function calculateAvailablePeriods(rangeStart, rangeEnd, unavailablePeriods) {
  const availablePeriods = [];
  let currentDate = new Date(rangeStart);

  unavailablePeriods.sort((a, b) => new Date(a.start) - new Date(b.start));

  for (const period of unavailablePeriods) {
    const periodStart = new Date(period.start);

    if (currentDate < periodStart) {
      availablePeriods.push({
        start: new Date(currentDate),
        end: new Date(periodStart)
      });
    }

    const periodEnd = new Date(period.end);
    if (periodEnd > currentDate) {
      currentDate = periodEnd;
    }
  }

  if (currentDate < rangeEnd) {
    availablePeriods.push({
      start: new Date(currentDate),
      end: new Date(rangeEnd)
    });
  }

  return availablePeriods;
}

async function calculatePrice(machineId, dateDebut, dateFin) {
  try {
    const machine = await Machine.findById(machineId);
    if (!machine) {
      throw new Error('Machine non trouvée');
    }

    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      throw new Error('Durée invalide');
    }

    let pricePerDay = machine.prixParJour;
    let discount = 0;

    if (days >= 30) {
      discount = 0.20;
    } else if (days >= 14) {
      discount = 0.15;
    } else if (days >= 7) {
      discount = 0.10;
    }

    const basePrice = pricePerDay * days;
    const discountAmount = basePrice * discount;
    const finalPrice = basePrice - discountAmount;

    return {
      days,
      pricePerDay,
      basePrice,
      discount: discount * 100,
      discountAmount,
      finalPrice
    };
  } catch (error) {
    logger.error('Erreur calculatePrice:', error);
    throw error;
  }
}

async function getSuggestedDates(machineId, durationDays = 3, limit = 5) {
  try {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    const suggestions = [];
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() + 1);

    while (suggestions.length < limit && checkDate < maxDate) {
      const endDate = new Date(checkDate);
      endDate.setDate(endDate.getDate() + durationDays);

      const availability = await checkAvailability(machineId, checkDate, endDate);

      if (availability.available) {
        const pricing = await calculatePrice(machineId, checkDate, endDate);

        suggestions.push({
          dateDebut: new Date(checkDate),
          dateFin: new Date(endDate),
          days: durationDays,
          price: pricing.finalPrice,
          discount: pricing.discount
        });
      }

      checkDate.setDate(checkDate.getDate() + 1);
    }

    return suggestions;
  } catch (error) {
    logger.error('Erreur getSuggestedDates:', error);
    throw error;
  }
}

module.exports = {
  checkAvailability,
  getAvailableDates,
  calculatePrice,
  getSuggestedDates
};
