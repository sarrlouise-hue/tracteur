const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/controleur.historique');
const { authenticate, isAdmin } = require('../middleware/middleware.authentification');

router.use(authenticate);

router.get('/', isAdmin, historiqueController.getAllHistory);
router.get('/me', historiqueController.getMyHistory);
router.get('/me/stats', historiqueController.getStatsByUser);
router.get('/:id', historiqueController.getHistoryById);

router.post('/', historiqueController.createHistory);
router.put('/:id', historiqueController.updateHistory);
router.delete('/:id', historiqueController.deleteHistory);

module.exports = router;
