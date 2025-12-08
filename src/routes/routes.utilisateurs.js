const express = require('express');
const router = express.Router();
const multer = require('multer');
const utilisateursController = require('../controllers/controleur.utilisateurs');
const { authenticate, isAdmin } = require('../middleware/middleware.authentification');

const upload = multer({
  dest: '/tmp/uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

router.get('/', authenticate, isAdmin, utilisateursController.getAllUsers);
router.get('/profile', authenticate, utilisateursController.getProfile);
router.put('/profile', authenticate, utilisateursController.updateProfile);
router.get('/dashboard', authenticate, utilisateursController.getDashboard);

router.post(
  '/profile/picture',
  authenticate,
  upload.single('image'),
  utilisateursController.uploadProfilePicture
);

router.delete(
  '/profile/picture',
  authenticate,
  utilisateursController.deleteProfilePicture
);

router.get('/public/:id', utilisateursController.getPublicProfile);

module.exports = router;
