const Historique = require('../models/modele.historique');
const logger = require('../utils/utilitaire.logs');

async function getMyHistory(req, res, next) {
  try {
    const { limit = 50, skip = 0, type } = req.query;
    const userId = req.user.id;

    const query = { utilisateurId: userId };
    if (type) query.type = type;

    const historique = await Historique.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('reservationId', 'dateDebut dateFin statut prixTotal')
      .populate('machineId', 'nom type marque')
      .populate('paiementId', 'montant statut referencePaiement');

    const total = await Historique.countDocuments(query);

    res.json({
      success: true,
      data: {
        historique,
        total,
        page: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Erreur getMyHistory:', error);
    next(error);
  }
}

async function getHistoryById(req, res, next) {
  try {
    const historyEntry = await Historique.findById(req.params.id)
      .populate('utilisateurId', 'nom prenom email telephone')
      .populate('reservationId')
      .populate('machineId')
      .populate('paiementId');

    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.notFound')
      });
    }

    if (historyEntry.utilisateurId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: req.t('errors.forbidden')
      });
    }

    res.json({
      success: true,
      data: { historique: historyEntry }
    });
  } catch (error) {
    logger.error('Erreur getHistoryById:', error);
    next(error);
  }
}

async function getStatsByUser(req, res, next) {
  try {
    const userId = req.user.id;

    const stats = await Historique.aggregate([
      { $match: { utilisateurId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalReservations = await Historique.countDocuments({
      utilisateurId: userId,
      type: 'reservation_created'
    });

    const totalPayments = await Historique.countDocuments({
      utilisateurId: userId,
      type: 'payment_completed'
    });

    res.json({
      success: true,
      data: {
        stats,
        totalReservations,
        totalPayments
      }
    });
  } catch (error) {
    logger.error('Erreur getStatsByUser:', error);
    next(error);
  }
}

async function deleteHistory(req, res, next) {
  try {
    const historyEntry = await Historique.findById(req.params.id);

    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.notFound')
      });
    }

    if (historyEntry.utilisateurId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: req.t('errors.forbidden')
      });
    }

    await historyEntry.remove();

    res.json({
      success: true,
      message: 'Entrée historique supprimée'
    });
  } catch (error) {
    logger.error('Erreur deleteHistory:', error);
    next(error);
  }
}

async function getAllHistory(req, res, next) {
  try {
    const { limit = 100, skip = 0, type, userId } = req.query;

    const query = {};
    if (type) query.type = type;
    if (userId) query.utilisateurId = userId;

    const historique = await Historique.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('utilisateurId', 'nom prenom email role')
      .populate('reservationId', 'dateDebut dateFin statut')
      .populate('machineId', 'nom type')
      .populate('paiementId', 'montant statut');

    const total = await Historique.countDocuments(query);

    res.json({
      success: true,
      data: {
        historique,
        total,
        page: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Erreur getAllHistory:', error);
    next(error);
  }
}

async function createHistory(req, res, next) {
  try {
    const { type, description, reservationId, machineId, paiementId } = req.body;
    const utilisateurId = req.user.id;

    const historyEntry = await Historique.create({
      utilisateurId,
      type,
      description,
      reservationId,
      machineId,
      paiementId
    });

    logger.info(`Historique créé: ${historyEntry._id}`);

    res.status(201).json({
      success: true,
      message: 'Entrée historique créée',
      data: historyEntry
    });
  } catch (error) {
    logger.error('Erreur createHistory:', error);
    next(error);
  }
}

async function updateHistory(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const historyEntry = await Historique.findByIdAndUpdate(id, updateData, { new: true });

    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: 'Entrée historique non trouvée'
      });
    }

    logger.info(`Historique mis à jour: ${id}`);

    res.json({
      success: true,
      message: 'Entrée historique mise à jour',
      data: historyEntry
    });
  } catch (error) {
    logger.error('Erreur updateHistory:', error);
    next(error);
  }
}

module.exports = {
  getMyHistory,
  getHistoryById,
  getStatsByUser,
  deleteHistory,
  getAllHistory,
  createHistory,
  updateHistory
};
