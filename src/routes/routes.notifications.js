const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/controleur.notifications');
const { authenticate, isAdmin } = require('../middleware/middleware.authentification');

router.use(authenticate);

router.get('/', notificationsController.getMyNotifications);
router.get('/all', isAdmin, notificationsController.getAllNotifications);
router.get('/me', notificationsController.getMyNotifications);
router.get('/me/stats', notificationsController.getNotificationStats);
router.get('/:id', notificationsController.getNotificationById);

router.post('/', isAdmin, notificationsController.createNotification);

router.put('/:id/read', notificationsController.markAsRead);
router.put('/:id', isAdmin, notificationsController.updateNotification);
router.put('/read-all', notificationsController.markAllAsRead);

router.delete('/:id', notificationsController.deleteNotification);
router.delete('/read/all', notificationsController.deleteAllRead);

module.exports = router;
