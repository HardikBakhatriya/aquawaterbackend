const express = require('express');
const router = express.Router();
const {
  getBanners,
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
} = require('../controllers/bannerController.js');
const { uploadBannerImage } = require('../config/cloudinary');
const authenticateToken = require('../middlewares/authenticateToken.js');

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

// Public routes
router.get('/', getBanners);
router.get('/:id', getBannerById);

// Admin routes (protected)
router.get('/admin/all', authenticateToken, getAllBanners);
router.post('/', authenticateToken, uploadBannerImage, handleMulterError, createBanner);
router.put('/reorder', authenticateToken, reorderBanners);
router.put('/:id', authenticateToken, uploadBannerImage, handleMulterError, updateBanner);
router.delete('/:id', authenticateToken, deleteBanner);

module.exports = router;
