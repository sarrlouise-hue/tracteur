const prestataireRepo = require('../data-access/depot.prestataires');
const machineRepo = require('../data-access/depot.machines');
const reservationRepo = require('../data-access/depot.reservations');
const paymentRepo = require('../data-access/depot.paiements');
const searchService = require('../services/service.recherche');
const logger = require('../utils/utilitaire.logs');
const Machine = require('../models/modele.machine');
const Reservation = require('../models/modele.reservation');
const Payment = require('../models/modele.paiement');
const Avis = require('../models/modele.avis');

async function createPrestataire(req, res, next) {
  try {
    const { description, longitude, latitude, adresse, servicesProposes } = req.body;
    const userId = req.user.id;

    const prestataire = await prestataireRepo.createPrestataire({
      userId,
      description,
      localisation: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      adresse,
      servicesProposes: servicesProposes || []
    });

    logger.info(`Prestataire créé: ${prestataire._id}`);

    res.status(201).json({
      success: true,
      message: 'Profil prestataire créé avec succès',
      data: prestataire
    });
  } catch (error) {
    logger.error('Erreur createPrestataire:', error);
    next(error);
  }
}

async function getPrestataires(req, res, next) {
  try {
    const { limit = 20, skip = 0, disponibilite } = req.query;

    const filter = {};
    if (disponibilite !== undefined) {
      filter.disponibilite = disponibilite === 'true';
    }

    const prestataires = await prestataireRepo.findByFilter(filter, {
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

    const total = await prestataireRepo.count(filter);

    res.json({
      success: true,
      data: prestataires,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Erreur getPrestataires:', error);
    next(error);
  }
}

async function searchNearby(req, res, next) {
  try {
    const { longitude, latitude, rayon, serviceId, limit } = req.query;

    const prestataires = await searchService.searchPrestataires({
      longitude,
      latitude,
      rayon: rayon ? parseInt(rayon) : 50,
      serviceId,
      limit: limit ? parseInt(limit) : 20
    });

    res.json({
      success: true,
      data: prestataires,
      count: prestataires.length
    });
  } catch (error) {
    logger.error('Erreur searchNearby:', error);
    next(error);
  }
}

async function getPrestataireById(req, res, next) {
  try {
    const { id } = req.params;

    const prestataire = await prestataireRepo.findById(id);

    if (!prestataire) {
      return res.status(404).json({
        success: false,
        message: 'Prestataire non trouvé'
      });
    }

    res.json({
      success: true,
      data: prestataire
    });
  } catch (error) {
    logger.error('Erreur getPrestataireById:', error);
    next(error);
  }
}

async function updatePrestataire(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.longitude && updateData.latitude) {
      updateData.localisation = {
        type: 'Point',
        coordinates: [parseFloat(updateData.longitude), parseFloat(updateData.latitude)]
      };
      delete updateData.longitude;
      delete updateData.latitude;
    }

    const prestataire = await prestataireRepo.updatePrestataire(id, updateData);

    if (!prestataire) {
      return res.status(404).json({
        success: false,
        message: 'Prestataire non trouvé'
      });
    }

    logger.info(`Prestataire mis à jour: ${id}`);

    res.json({
      success: true,
      message: 'Prestataire mis à jour avec succès',
      data: prestataire
    });
  } catch (error) {
    logger.error('Erreur updatePrestataire:', error);
    next(error);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const prestataireId = req.user.id;

    const totalMachines = await Machine.countDocuments({ prestataireId });
    const machinesDisponibles = await Machine.countDocuments({
      prestataireId,
      disponible: true
    });
    const machinesIndisponibles = totalMachines - machinesDisponibles;

    const totalReservations = await Reservation.countDocuments({ prestataireId });
    const reservationsEnAttente = await Reservation.countDocuments({
      prestataireId,
      statut: 'en_attente'
    });
    const reservationsConfirmees = await Reservation.countDocuments({
      prestataireId,
      statut: 'confirmee'
    });
    const reservationsEnCours = await Reservation.countDocuments({
      prestataireId,
      statut: 'en_cours'
    });
    const reservationsTerminees = await Reservation.countDocuments({
      prestataireId,
      statut: 'terminee'
    });
    const reservationsAnnulees = await Reservation.countDocuments({
      prestataireId,
      statut: 'annulee'
    });

    const machines = await Machine.find({ prestataireId }).distinct('_id');
    const reservationsMachines = await Reservation.find({
      machineId: { $in: machines },
      statut: { $in: ['confirmee', 'en_cours', 'terminee'] }
    });

    const revenuTotal = await Payment.aggregate([
      {
        $match: {
          reservationId: { $in: reservationsMachines.map(r => r._id) },
          statut: 'valide'
        }
      },
      { $group: { _id: null, total: { $sum: '$montant' } } }
    ]);

    const revenuParMois = await Payment.aggregate([
      {
        $match: {
          reservationId: { $in: reservationsMachines.map(r => r._id) },
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

    const tauxOccupation = totalReservations > 0
      ? ((reservationsTerminees + reservationsEnCours) / totalReservations) * 100
      : 0;

    const machinesParType = await Machine.aggregate([
      { $match: { prestataireId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          disponibles: { $sum: { $cond: ['$disponible', 1, 0] } }
        }
      }
    ]);

    const dernieresReservations = await Reservation.find({ prestataireId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('machineId', 'nom type tarifParHeure')
      .populate('producteurId', 'nom prenom telephone');

    const avisRecents = await Avis.find({
      reservationId: { $in: reservationsMachines.map(r => r._id) }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('utilisateurId', 'nom prenom')
      .populate('reservationId');

    const performancesMachines = await Reservation.aggregate([
      {
        $match: {
          prestataireId,
          statut: 'terminee'
        }
      },
      {
        $group: {
          _id: '$machineId',
          nombreReservations: { $sum: 1 },
          heuresTotal: { $sum: '$nombreHeures' }
        }
      },
      { $sort: { nombreReservations: -1 } },
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
        machines: {
          total: totalMachines,
          disponibles: machinesDisponibles,
          indisponibles: machinesIndisponibles,
          parType: machinesParType
        },
        reservations: {
          total: totalReservations,
          enAttente: reservationsEnAttente,
          confirmees: reservationsConfirmees,
          enCours: reservationsEnCours,
          terminees: reservationsTerminees,
          annulees: reservationsAnnulees,
          tauxOccupation: tauxOccupation.toFixed(2)
        },
        finances: {
          revenuTotal: revenuTotal[0]?.total || 0,
          revenuParMois
        },
        performances: {
          performancesMachines
        },
        activiteRecente: {
          dernieresReservations,
          avisRecents
        }
      }
    });
  } catch (error) {
    logger.error('Erreur getDashboardStats prestataire:', error);
    next(error);
  }
}

async function getMesMachines(req, res, next) {
  try {
    const prestataireId = req.user.id;
    const { disponible, type, page = 1, limit = 20 } = req.query;

    const query = { prestataireId };
    if (disponible !== undefined) query.disponible = disponible === 'true';
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const machines = await Machine.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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
    logger.error('Erreur getMesMachines prestataire:', error);
    next(error);
  }
}

async function getMesReservations(req, res, next) {
  try {
    const prestataireId = req.user.id;
    const { statut, page = 1, limit = 20 } = req.query;

    const query = { prestataireId };
    if (statut) query.statut = statut;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reservations = await Reservation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('machineId', 'nom type tarifParHeure images')
      .populate('producteurId', 'nom prenom telephone email');

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
    logger.error('Erreur getMesReservations prestataire:', error);
    next(error);
  }
}

async function getMesPaiements(req, res, next) {
  try {
    const prestataireId = req.user.id;
    const { statut, page = 1, limit = 20 } = req.query;

    const machines = await Machine.find({ prestataireId }).distinct('_id');
    const reservations = await Reservation.find({
      machineId: { $in: machines }
    }).distinct('_id');

    const query = { reservationId: { $in: reservations } };
    if (statut) query.statut = statut;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const paiements = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reservationId')
      .populate('utilisateurId', 'nom prenom');

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
    logger.error('Erreur getMesPaiements prestataire:', error);
    next(error);
  }
}

async function getMesAvis(req, res, next) {
  try {
    const prestataireId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const machines = await Machine.find({ prestataireId }).distinct('_id');
    const reservations = await Reservation.find({
      machineId: { $in: machines }
    }).distinct('_id');

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

    const avisParMachine = await Avis.aggregate([
      { $match: { reservationId: { $in: reservations } } },
      {
        $lookup: {
          from: 'reservations',
          localField: 'reservationId',
          foreignField: '_id',
          as: 'reservation'
        }
      },
      { $unwind: '$reservation' },
      {
        $group: {
          _id: '$reservation.machineId',
          moyenne: { $avg: '$note' },
          count: { $sum: 1 }
        }
      },
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
        avis,
        total,
        moyenneGlobale: moyenneGlobale[0]?.moyenne || 0,
        avisParMachine,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Erreur getMesAvis prestataire:', error);
    next(error);
  }
}

async function getStatistiquesMachine(req, res, next) {
  try {
    const prestataireId = req.user.id;
    const { machineId } = req.params;

    const machine = await Machine.findOne({ _id: machineId, prestataireId });
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Machine non trouvée'
      });
    }

    const totalReservations = await Reservation.countDocuments({ machineId });
    const reservationsTerminees = await Reservation.countDocuments({
      machineId,
      statut: 'terminee'
    });

    const heuresUtilisation = await Reservation.aggregate([
      {
        $match: {
          machineId: machine._id,
          statut: { $in: ['terminee', 'en_cours'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$nombreHeures' } } }
    ]);

    const revenu = await Payment.aggregate([
      {
        $lookup: {
          from: 'reservations',
          localField: 'reservationId',
          foreignField: '_id',
          as: 'reservation'
        }
      },
      { $unwind: '$reservation' },
      {
        $match: {
          'reservation.machineId': machine._id,
          statut: 'valide'
        }
      },
      { $group: { _id: null, total: { $sum: '$montant' } } }
    ]);

    const avis = await Avis.find({
      reservationId: {
        $in: await Reservation.find({ machineId }).distinct('_id')
      }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('utilisateurId', 'nom prenom');

    const moyenneAvis = await Avis.aggregate([
      {
        $match: {
          reservationId: {
            $in: await Reservation.find({ machineId }).distinct('_id')
          }
        }
      },
      { $group: { _id: null, moyenne: { $avg: '$note' }, total: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        machine,
        statistiques: {
          totalReservations,
          reservationsTerminees,
          heuresUtilisation: heuresUtilisation[0]?.total || 0,
          revenuTotal: revenu[0]?.total || 0,
          moyenneAvis: moyenneAvis[0]?.moyenne || 0,
          nombreAvis: moyenneAvis[0]?.total || 0
        },
        avisRecents: avis
      }
    });
  } catch (error) {
    logger.error('Erreur getStatistiquesMachine prestataire:', error);
    next(error);
  }
}

async function getCalendrierReservations(req, res, next) {
  try {
    const prestataireId = req.user.id;
    const { machineId, annee, mois } = req.query;

    const query = { prestataireId };

    if (machineId) {
      const machine = await Machine.findOne({ _id: machineId, prestataireId });
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine non trouvée'
        });
      }
      query.machineId = machineId;
    }

    if (annee && mois) {
      const dateDebut = new Date(annee, mois - 1, 1);
      const dateFin = new Date(annee, mois, 0, 23, 59, 59);
      query.dateDebut = { $lte: dateFin };
      query.dateFin = { $gte: dateDebut };
    }

    const reservations = await Reservation.find(query)
      .populate('machineId', 'nom type')
      .populate('producteurId', 'nom prenom telephone')
      .sort({ dateDebut: 1 });

    res.json({
      success: true,
      data: {
        reservations
      }
    });
  } catch (error) {
    logger.error('Erreur getCalendrierReservations prestataire:', error);
    next(error);
  }
}

async function deletePrestataire(req, res, next) {
  try {
    const { id } = req.params;

    const prestataire = await prestataireRepo.findById(id);
    if (!prestataire) {
      return res.status(404).json({
        success: false,
        message: 'Prestataire non trouvé'
      });
    }

    await prestataireRepo.delete(id);

    logger.info(`Prestataire supprimé: ${id}`);

    res.json({
      success: true,
      message: 'Prestataire supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur deletePrestataire:', error);
    next(error);
  }
}

module.exports = {
  createPrestataire,
  getPrestataires,
  searchNearby,
  getPrestataireById,
  updatePrestataire,
  deletePrestataire,
  getDashboardStats,
  getMesMachines,
  getMesReservations,
  getMesPaiements,
  getMesAvis,
  getStatistiquesMachine,
  getCalendrierReservations
};
