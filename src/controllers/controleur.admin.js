const userRepo = require('../data-access/depot.utilisateurs');
const machineRepo = require('../data-access/depot.machines');
const reservationRepo = require('../data-access/depot.reservations');
const paymentRepo = require('../data-access/depot.paiements');
const logger = require('../utils/utilitaire.logs');

async function getAllUsers(req, res, next) {
  try {
    const { role, isActive, page = 1, limit = 50 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await userRepo.findByFilter(query, {
      limit: parseInt(limit),
      skip
    });

    const total = await userRepo.count(query);

    res.json({
      success: true,
      data: {
        users,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Erreur getAllUsers:', error);
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userRepo.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    logger.error('Erreur getUserById:', error);
    next(error);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['producteur', 'prestataire', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide. Valeurs possibles: producteur, prestataire, admin'
      });
    }

    const user = await userRepo.update(userId, { role });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    logger.info(`Admin ${req.user.id} a changé le rôle de l'utilisateur ${userId} en ${role}`);

    res.json({
      success: true,
      message: 'Rôle utilisateur mis à jour',
      data: { user }
    });
  } catch (error) {
    logger.error('Erreur updateUserRole:', error);
    next(error);
  }
}

async function activateDeactivateUser(req, res, next) {
  try {
    const { isActive } = req.body;
    const userId = req.params.id;

    const user = await userRepo.update(userId, { isActive });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    logger.info(`Admin ${req.user.id} a ${isActive ? 'activé' : 'désactivé'} l'utilisateur ${userId}`);

    res.json({
      success: true,
      message: `Utilisateur ${isActive ? 'activé' : 'désactivé'}`,
      data: { user }
    });
  } catch (error) {
    logger.error('Erreur activateDeactivateUser:', error);
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const user = await userRepo.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    await userRepo.delete(userId);

    logger.info(`Admin ${req.user.id} a supprimé l'utilisateur ${userId}`);

    res.json({
      success: true,
      message: 'Utilisateur supprimé'
    });
  } catch (error) {
    logger.error('Erreur deleteUser:', error);
    next(error);
  }
}

async function getStatistics(req, res, next) {
  try {
    const totalUsers = await userRepo.count({});
    const totalProducteurs = await userRepo.count({ role: 'producteur' });
    const totalPrestataires = await userRepo.count({ role: 'prestataire' });
    const totalAdmins = await userRepo.count({ role: 'admin' });
    const activeUsers = await userRepo.count({ isActive: true });

    const User = require('../models/modele.utilisateur');
    const Machine = require('../models/modele.machine');
    const Reservation = require('../models/modele.reservation');
    const Payment = require('../models/modele.paiement');
    const Avis = require('../models/modele.avis');
    const Notification = require('../models/modele.notification');

    const totalMachines = await Machine.countDocuments();
    const machinesDisponibles = await Machine.countDocuments({ disponible: true });

    const totalReservations = await Reservation.countDocuments();
    const reservationsConfirmees = await Reservation.countDocuments({ statut: 'confirmee' });
    const reservationsEnAttente = await Reservation.countDocuments({ statut: 'en_attente' });
    const reservationsEnCours = await Reservation.countDocuments({ statut: 'en_cours' });
    const reservationsTerminees = await Reservation.countDocuments({ statut: 'terminee' });
    const reservationsAnnulees = await Reservation.countDocuments({ statut: 'annulee' });

    const totalPaiements = await Payment.countDocuments();
    const paiementsValides = await Payment.countDocuments({ statut: 'valide' });
    const paiementsPending = await Payment.countDocuments({ statut: 'pending' });
    const paiementsEchoues = await Payment.countDocuments({ statut: 'failed' });

    const revenuTotal = await Payment.aggregate([
      { $match: { statut: 'valide' } },
      { $group: { _id: null, total: { $sum: '$montant' } } }
    ]);

    const revenuParMois = await Payment.aggregate([
      {
        $match: {
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

    const machinesParType = await Machine.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          disponibles: {
            $sum: { $cond: ['$disponible', 1, 0] }
          }
        }
      }
    ]);

    const totalAvis = await Avis.countDocuments();
    const moyenneAvis = await Avis.aggregate([
      { $group: { _id: null, moyenne: { $avg: '$note' } } }
    ]);

    const totalNotifications = await Notification.countDocuments();
    const notificationsNonLues = await Notification.countDocuments({ lue: false });

    const dernieresReservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('producteurId', 'nom prenom telephone')
      .populate('machineId', 'nom type');

    const derniersPaiements = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('utilisateurId', 'nom prenom');

    const derniersUtilisateurs = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('nom prenom email role isActive createdAt');

    res.json({
      success: true,
      data: {
        utilisateurs: {
          total: totalUsers,
          producteurs: totalProducteurs,
          prestataires: totalPrestataires,
          admins: totalAdmins,
          actifs: activeUsers,
          inactifs: totalUsers - activeUsers
        },
        machines: {
          total: totalMachines,
          disponibles: machinesDisponibles,
          indisponibles: totalMachines - machinesDisponibles,
          parType: machinesParType
        },
        reservations: {
          total: totalReservations,
          confirmees: reservationsConfirmees,
          enAttente: reservationsEnAttente,
          enCours: reservationsEnCours,
          terminees: reservationsTerminees,
          annulees: reservationsAnnulees
        },
        paiements: {
          total: totalPaiements,
          valides: paiementsValides,
          pending: paiementsPending,
          echoues: paiementsEchoues,
          revenuTotal: revenuTotal[0]?.total || 0,
          revenuParMois
        },
        avis: {
          total: totalAvis,
          moyenneGlobale: moyenneAvis[0]?.moyenne || 0
        },
        notifications: {
          total: totalNotifications,
          nonLues: notificationsNonLues
        },
        activiteRecente: {
          dernieresReservations,
          derniersPaiements,
          derniersUtilisateurs
        }
      }
    });
  } catch (error) {
    logger.error('Erreur getStatistics:', error);
    next(error);
  }
}

async function getAllMachines(req, res, next) {
  try {
    const { disponible, type, page = 1, limit = 50 } = req.query;

    const query = {};
    if (disponible !== undefined) query.disponible = disponible === 'true';
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const machines = await machineRepo.findByFilter(query, {
      limit: parseInt(limit),
      skip,
      populate: true
    });

    const Machine = require('../models/modele.machine');
    const total = await Machine.countDocuments(query);

    res.json({
      success: true,
      data: {
        machines,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Erreur getAllMachines:', error);
    next(error);
  }
}

async function getAllReservations(req, res, next) {
  try {
    const { statut, page = 1, limit = 50 } = req.query;

    const query = {};
    if (statut) query.statut = statut;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reservations = await reservationRepo.findByFilter(query, {
      limit: parseInt(limit),
      skip,
      populate: true
    });

    const Reservation = require('../models/modele.reservation');
    const total = await Reservation.countDocuments(query);

    res.json({
      success: true,
      data: {
        reservations,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Erreur getAllReservations:', error);
    next(error);
  }
}

async function getAllPayments(req, res, next) {
  try {
    const { statut, page = 1, limit = 50 } = req.query;

    const query = {};
    if (statut) query.statut = statut;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payments = await paymentRepo.findByFilter(query, {
      limit: parseInt(limit),
      skip,
      populate: true
    });

    const Payment = require('../models/modele.paiement');
    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Erreur getAllPayments:', error);
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  activateDeactivateUser,
  deleteUser,
  getStatistics,
  getAllMachines,
  getAllReservations,
  getAllPayments
};
