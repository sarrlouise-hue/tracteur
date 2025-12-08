const userRepo = require('../data-access/depot.utilisateurs');
const machineRepo = require('../data-access/depot.machines');
const reservationRepo = require('../data-access/depot.reservations');
const paymentRepo = require('../data-access/depot.paiements');
const imageService = require('../services/service.images');
const logger = require('../utils/utilitaire.logs');

async function getProfile(req, res, next) {
  try {
    const user = await userRepo.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.notFound')
      });
    }

    let additionalData = {};

    if (user.role === 'prestataire') {
      const machines = await machineRepo.findByProprietaire(user._id);
      const Reservation = require('../models/modele.reservation');
      const totalReservations = await Reservation.countDocuments({
        'machineId.proprietaireId': user._id
      });

      additionalData = {
        totalMachines: machines.length,
        totalReservations
      };
    } else if (user.role === 'producteur') {
      const reservations = await reservationRepo.findByUser(user._id);
      const Payment = require('../models/modele.paiement');
      const totalPaiements = await Payment.countDocuments({
        utilisateurId: user._id,
        statut: 'valide'
      });

      additionalData = {
        totalReservations: reservations.length,
        totalPaiements
      };
    }

    res.json({
      success: true,
      data: {
        user,
        ...additionalData
      }
    });
  } catch (error) {
    logger.error('Erreur getProfile:', error);
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updates = req.body;
    const allowedFields = [
      'nom',
      'prenom',
      'telephone',
      'email',
      'entreprise',
      'localisation',
      'bio',
      'siteWeb',
      'reseauxSociaux'
    ];

    const filteredUpdates = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    const user = await userRepo.update(req.user.id, filteredUpdates);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.notFound')
      });
    }

    res.json({
      success: true,
      message: req.t('users.profileUpdated'),
      data: { user }
    });
  } catch (error) {
    logger.error('Erreur updateProfile:', error);
    next(error);
  }
}

async function uploadProfilePicture(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    const user = await userRepo.findById(req.user.id);

    if (user.profilePicture?.publicId) {
      await imageService.deleteImage(user.profilePicture.publicId);
    }

    const imageData = await imageService.uploadImage(req.file, 'profiles', {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face'
    });

    const updatedUser = await userRepo.update(req.user.id, {
      profilePicture: {
        url: imageData.url,
        publicId: imageData.publicId
      }
    });

    res.json({
      success: true,
      message: 'Photo de profil mise à jour',
      data: { user: updatedUser }
    });
  } catch (error) {
    logger.error('Erreur uploadProfilePicture:', error);
    next(error);
  }
}

async function deleteProfilePicture(req, res, next) {
  try {
    const user = await userRepo.findById(req.user.id);

    if (user.profilePicture?.publicId) {
      await imageService.deleteImage(user.profilePicture.publicId);
    }

    const updatedUser = await userRepo.update(req.user.id, {
      profilePicture: null
    });

    res.json({
      success: true,
      message: 'Photo de profil supprimée',
      data: { user: updatedUser }
    });
  } catch (error) {
    logger.error('Erreur deleteProfilePicture:', error);
    next(error);
  }
}

async function getDashboard(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await userRepo.findById(userId);

    let dashboardData = {
      user: {
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        email: user.email
      }
    };

    if (user.role === 'prestataire') {
      const machines = await machineRepo.findByProprietaire(userId);
      const Reservation = require('../models/modele.reservation');

      const reservations = await Reservation.find({
        'machineId': { $in: machines.map(m => m._id) }
      }).sort({ createdAt: -1 }).limit(10);

      const Payment = require('../models/modele.paiement');
      const revenus = await Payment.aggregate([
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
          $lookup: {
            from: 'machines',
            localField: 'reservation.machineId',
            foreignField: '_id',
            as: 'machine'
          }
        },
        { $unwind: '$machine' },
        {
          $match: {
            'machine.proprietaireId': user._id,
            statut: 'valide'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$montant' }
          }
        }
      ]);

      dashboardData.prestataire = {
        totalMachines: machines.length,
        machinesDisponibles: machines.filter(m => m.disponible).length,
        totalReservations: reservations.length,
        revenuTotal: revenus[0]?.total || 0,
        dernieresReservations: reservations.slice(0, 5)
      };

    } else if (user.role === 'producteur') {
      const reservations = await reservationRepo.findByUser(userId);
      const Payment = require('../models/modele.paiement');

      const paiements = await Payment.find({ utilisateurId: userId })
        .sort({ createdAt: -1 })
        .limit(10);

      const depensesTotal = paiements
        .filter(p => p.statut === 'valide')
        .reduce((sum, p) => sum + p.montant, 0);

      dashboardData.producteur = {
        totalReservations: reservations.length,
        reservationsActives: reservations.filter(r => r.statut === 'confirmee').length,
        totalDepenses: depensesTotal,
        dernieresReservations: reservations.slice(0, 5),
        derniersPaiements: paiements.slice(0, 5)
      };
    }

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    logger.error('Erreur getDashboard:', error);
    next(error);
  }
}

async function getPublicProfile(req, res, next) {
  try {
    const user = await userRepo.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.notFound')
      });
    }

    const publicData = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      entreprise: user.entreprise,
      bio: user.bio,
      profilePicture: user.profilePicture,
      localisation: user.localisation,
      siteWeb: user.siteWeb,
      reseauxSociaux: user.reseauxSociaux,
      createdAt: user.createdAt
    };

    if (user.role === 'prestataire') {
      const machines = await machineRepo.findByProprietaire(user._id);
      publicData.machines = machines;
      publicData.totalMachines = machines.length;
    }

    res.json({
      success: true,
      data: { user: publicData }
    });
  } catch (error) {
    logger.error('Erreur getPublicProfile:', error);
    next(error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const User = require('../models/modele.utilisateur');

    const users = await User.find().select('-motDePasse -password -__v');

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    logger.error('Erreur getAllUsers:', error);
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getDashboard,
  getPublicProfile,
  getAllUsers
};
