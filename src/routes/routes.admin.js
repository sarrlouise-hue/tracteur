const express = require('express');
const router = express.Router();
const adminController = require('../controllers/controleur.admin');
const { authenticate, isAdmin } = require('../middleware/middleware.authentification');

router.use(authenticate);
router.use(isAdmin);

router.get('/statistics', adminController.getStatistics);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/status', adminController.activateDeactivateUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/machines', adminController.getAllMachines);
router.get('/reservations', adminController.getAllReservations);
router.get('/payments', adminController.getAllPayments);

module.exports = router;
