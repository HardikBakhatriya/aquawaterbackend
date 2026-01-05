const express = require('express');
const router = express.Router();
const { uploadArticleImage } = require('../config/cloudinary.js');
const {
  getArticles,
  getAllArticlesAdmin,
  getArticleById,
  getArticleCategories,
  getArticleTags,
  createArticle,
  updateArticle,
  deleteArticle,
  getRelatedArticles,
} = require('../controllers/articleController.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

/* =========================
   ADMIN ROUTES (FIRST - protected)
========================= */
router.get('/admin/all', authenticateToken, getAllArticlesAdmin);

/* =========================
   STATIC ROUTES (public)
========================= */
router.get('/categories', getArticleCategories);
router.get('/tags', getArticleTags);

/* =========================
   CRUD ROUTES (protected)
========================= */
router.post('/', authenticateToken, uploadArticleImage, createArticle);
router.put('/:id', authenticateToken, uploadArticleImage, updateArticle);
router.delete('/:id', authenticateToken, deleteArticle);

/* =========================
   RELATED (public)
========================= */
router.get('/:id/related', getRelatedArticles);

/* =========================
   GENERIC (public)
========================= */
router.get('/:idOrSlug', getArticleById);
router.get('/', getArticles);

module.exports = router;
