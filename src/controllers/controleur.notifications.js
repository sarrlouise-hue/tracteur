const Notification = require('../models/modele.notification');
const logger = require('../utils/utilitaire.logs');

async function getMyNotifications(req, res, next) {
  try {
    const { limit = 20, skip = 0, lue } = req.query;
    const userId = req.user.id;

    const query = { destinataireId: userId };
    if (lue !== undefined) query.lue = lue === 'true';

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Notification.countDocuments(query);
    const nonLues = await Notification.countDocuments({
      destinataireId: userId,
      lue: false
    });

    res.json({
      success: true,
      data: {
        notifications,
        total,
        nonLues,
        page: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Erreur getMyNotifications:', error);
    next(error);
  }
}

async function markAsRead(req, res, next) {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.notFound')
      });
    }

    if (notification.destinataireId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: req.t('errors.forbidden')
      });
    }

    notification.lue = true;
    notification.dateLecture = new Date();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marquée comme lue',
      data: { notification }
    });
  } catch (error) {
    logger.error('Erreur markAsRead:', error);
    next(error);
  }
}

async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { destinataireId: userId, lue: false },
      { lue: true, dateLecture: new Date() }
    );

    res.json({
      success: true,
      message: 'Toutes les notifications marquées comme lues'
    });
  } catch (error) {
    logger.error('Erreur markAllAsRead:', error);
    next(error);
  }
}

async function deleteNotification(req, res, next) {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.notFound')
      });
    }

    if (notification.destinataireId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: req.t('errors.forbidden')
      });
    }

    await notification.remove();

    res.json({
      success: true,
      message: 'Notification supprimée'
    });
  } catch (error) {
    logger.error('Erreur deleteNotification:', error);
    next(error);
  }
}

async function deleteAllRead(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await Notification.deleteMany({
      destinataireId: userId,
      lue: true
    });

    res.json({
      success: true,
      message: `${result.deletedCount} notifications supprimées`
    });
  } catch (error) {
    logger.error('Erreur deleteAllRead:', error);
    next(error);
  }
}

async function createNotification(req, res, next) {
  try {
    const { destinataireId, titre, message, type, lien } = req.body;

    const notification = await Notification.create({
      destinataireId,
      titre,
      message,
      type,
      lien
    });

    res.status(201).json({
      success: true,
      message: 'Notification créée',
      data: { notification }
    });
  } catch (error) {
    logger.error('Erreur createNotification:', error);
    next(error);
  }
}

async function getNotificationStats(req, res, next) {
  try {
    const userId = req.user.id;

    const total = await Notification.countDocuments({ destinataireId: userId });
    const nonLues = await Notification.countDocuments({
      destinataireId: userId,
      lue: false
    });
    const lues = total - nonLues;

    const parType = await Notification.aggregate([
      { $match: { destinataireId: userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total,
        lues,
        nonLues,
        parType
      }
    });
  } catch (error) {
    logger.error('Erreur getNotificationStats:', error);
    next(error);
  }
}

async function getAllNotifications(req, res, next) {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('destinataireId', 'nom prenom email');

    const total = await Notification.countDocuments();

    res.json({
      success: true,
      data: {
        notifications,
        total,
        page: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Erreur getAllNotifications:', error);
    next(error);
  }
}

async function getNotificationById(req, res, next) {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('destinataireId', 'nom prenom email');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error('Erreur getNotificationById:', error);
    next(error);
  }
}

async function updateNotification(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const notification = await Notification.findByIdAndUpdate(id, updateData, { new: true });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    logger.info(`Notification mise à jour: ${id}`);

    res.json({
      success: true,
      message: 'Notification mise à jour',
      data: notification
    });
  } catch (error) {
    logger.error('Erreur updateNotification:', error);
    next(error);
  }
}

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  createNotification,
  getNotificationStats,
  getAllNotifications,
  getNotificationById,
  updateNotification
};
