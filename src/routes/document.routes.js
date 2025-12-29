// BACKEND/src/routes/document.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const upload = require('../utils/upload');
const {
  getDocuments,
  uploadDocument,
  getDocument,
  updateDocument,
  deleteDocument
} = require('../controllers/document.controller');

// Protect all routes
router.use(protect);

// Define routes
router.route('/')
  .get(getDocuments)
  .post(upload.single('document'), uploadDocument);

router.route('/:id')
  .get(getDocument)
  .put(upload.single('document'), updateDocument)
  .delete(deleteDocument);

module.exports = router;