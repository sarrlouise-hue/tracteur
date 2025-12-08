const reservationRepo = require('../data-access/depot.reservations');
const machineRepo = require('../data-access/depot.machines');
const paymentRepo = require('../data-access/depot.paiements');
const logger = require('../utils/utilitaire.logs');
const Reservation = require('../models/modele.reservation');
const Payment = require('../models/modele.paiement');
const Machine = require('../models/modele.machine');
const Avis = require('../models/modele.avis');

async function getDashboardStats(req, res, next) {
  try {
    const producteurId = req.user.id;

    const totalReservations = await Reservation.countDocuments({ producteurId });
    const reservationsEnAttente = await Reservation.countDocuments({
      producteurId,
      statut: 'en_attente'
    });
    const reservationsConfirmees = await Reservation.countDocuments({
      producteurId,
      statut: 'confirmee'
    });
    const reservationsEnCours = await Reservation.countDocuments({
      producteurId,
      statut: 'en_cours'
    });
    const reservationsTerminees = await Reservation.countDocuments({
      producteurId,
      statut: 'terminee'
    });
    const reservationsAnnulees = await Reservation.countDocuments({
      producteurId,
      statut: 'annulee'
    });

    const depensesTotales = await Payment.aggregate([
      {
        $match: {
          utilisateurId: producteurId,
          statut: 'valide'
        }
      },
      { $group: { _id: null, total: { $sum: '$montant' } } }
    ]);

    const depensesParMois = await Payment.aggregate([
      {
        $match: {
          utilisateurId: producteurId,
          statut: 'valide',
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$montant' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const reservationsParType = await Reservation.aggregate([
      { $match: { producteurId } },
      {
        $lookup: {
          from: 'machines',
          localField: 'machineId',
          foreignField: '_id',
          as: 'machine'
        }
      },
      { $unwind: '$machine' },
      {
        $group: {
          _id: '$machine.type',
          count: { $sum: 1 }
        }
      }
    ]);

    const dernieresReservations = await Reservation.find({ producteurId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('machineId', 'nom type tarifParHeure images')
      .populate('prestataireId', 'nom prenom telephone');

    const avisRecents = await Avis.find({
      reservationId: {
        $in: await Reservation.find({ producteurId }).distinct('_id')
      }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('utilisateurId', 'nom prenom')
      .populate('reservationId');

    const machinesPreferees = await Reservation.aggregate([
      { $match: { producteurId, statut: 'terminee' } },
      {
        $group: {
          _id: '$machineId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'machines',
          localField: '_id',
          foreignField: '_id',
          as: 'machine'
        }
      },
      { $unwind: '$machine' }
    ]);

    res.json({
      success: true,
      data: {
        reservations: {
          total: totalReservations,
          enAttente: reservationsEnAttente,
          confirmees: reservationsConfirmees,
          enCours: reservationsEnCours,
          terminees: reservationsTerminees,
          annulees: reservationsAnnulees
        },
        finances: {
          depensesTotales: depensesTotales[0]?.total || 0,
          depensesParMois
        },
        statistiques: {
          reservationsParType,
          machinesPreferees
        },
        activiteRecente: {
          dernieresReservations,
          avisRecents
        }
      }
    });
  } catch (error) {
    logger.error('Erreur getDashboardStats producteur:', error);
    next(error);
  }
}

async function getMesReservations(req, res, next) {
  try {
    const producteurId = req.user.id;
    const { statut, page = 1, limit = 20 } = req.query;

    const query = { producteurId };
    if (statut) query.statut = statut;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reservations = await Reservation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('machineId', 'nom type tarifParHeure images localisation')
      .populate('prestataireId', 'nom prenom telephone email');

    const total = await Reservation.countDocuments(query);

    res.json({
      success: true,
      data: {
        reservations,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Erreur getMesReservations producteur:', error);
    next(error);
  }
}

async function getMesPaiements(req, res, next) {
  try {
    const producteurId = req.user.id;
    const { statut, page = 1, limit = 20 } = req.query;

    const query = { utilisateurId: producteurId };
    if (statut) query.statut = statut;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const paiements = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reservationId');

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        paiements,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Erreur getMesPaiements producteur:', error);
    next(error);
  }
}

async function getMesAvis(req, res, next) {
  try {
    const producteurId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const reservations = await Reservation.find({ producteurId }).distinct('_id');

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const avis = await Avis.find({ reservationId: { $in: reservations } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('utilisateurId', 'nom prenom')
      .populate('reservationId', 'dateDebut dateFin')
      .populate({
        path: 'reservationId',
        populate: {
          path: 'machineId',
          select: 'nom type'
        }
      });

    const total = await Avis.countDocuments({ reservationId: { $in: reservations } });

    const moyenneGlobale = await Avis.aggregate([
      { $match: { reservationId: { $in: reservations } } },
      { $group: { _id: null, moyenne: { $avg: '$note' } } }
    ]);

    res.json({
      success: true,
      data: {
        avis,
        total,
        moyenneGlobale: moyenneGlobale[0]?.moyenne || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Erreur getMesAvis producteur:', error);
    next(error);
  }
}

async function getMachinesDisponibles(req, res, next) {
  try {
    const { type, localisation, rayon = 50, page = 1, limit = 20 } = req.query;

    const query = { disponible: true };
    if (type) query.type = type;

    let machines;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (localisation) {
      const [longitude, latitude] = localisation.split(',').map(Number);

      machines = await Machine.find(query)
        .where('localisation.coordinates')
        .near({
          center: { coordinates: [longitude, latitude] },
          maxDistance: parseInt(rayon) * 1000
        })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('prestataireId', 'nom prenom telephone email noteGlobale nombreAvis');
    } else {
      machines = await Machine.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('prestataireId', 'nom prenom telephone email noteGlobale nombreAvis');
    }

    const total = await Machine.countDocuments(query);

    res.json({
      success: true,
      data: {
        machines,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Erreur getMachinesDisponibles producteur:', error);
    next(error);
  }
}

async function getHistoriqueReservations(req, res, next) {
  try {
    const producteurId = req.user.id;
    const { annee, mois } = req.query;

    const query = {
      producteurId,
      statut: 'terminee'
    };

    if (annee) {
      const dateDebut = new Date(annee, mois ? mois - 1 : 0, 1);
      const dateFin = new Date(annee, mois ? mois : 12, 0, 23, 59, 59);
      query.dateFin = { $gte: dateDebut, $lte: dateFin };
    }

    const reservations = await Reservation.find(query)
      .sort({ dateFin: -1 })
      .populate('machineId', 'nom type tarifParHeure')
      .populate('prestataireId', 'nom prenom telephone');

    const statistiques = await Reservation.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalHeures: { $sum: '$nombreHeures' },
          totalReservations: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        reservations,
        statistiques: statistiques[0] || { totalHeures: 0, totalReservations: 0 }
      }
    });
  } catch (error) {
    logger.error('Erreur getHistoriqueReservations producteur:', error);
    next(error);
  }
}

module.exports = {
  getDashboardStats,
  getMesReservations,
  getMesPaiements,
  getMesAvis,
  getMachinesDisponibles,
  getHistoriqueReservations
};
