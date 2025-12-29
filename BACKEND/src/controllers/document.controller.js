// BACKEND/src/controllers/document.controller.js
const { Op } = require('sequelize');
const asyncHandler = require('../middleware/async');
const Document = require('../models/Document.model');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all documents
exports.getDocuments = asyncHandler(async (req, res, next) => {
  const documents = await Document.findAll();
  res.status(200).json({ success: true, count: documents.length, data: documents });
});

// @desc    Upload a document
exports.uploadDocument = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const document = await Document.create({
    name: req.file.originalname,
    path: req.file.path,
    userId: req.user.id
  });

  res.status(201).json({ success: true, data: document });
});

// @desc    Get single document
exports.getDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findByPk(req.params.id);
  
  if (!document) {
    return next(new ErrorResponse(`Document not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: document });
});

// @desc    Update document
exports.updateDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findByPk(req.params.id);

  if (!document) {
    return next(new ErrorResponse(`Document not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is document owner
  if (document.userId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this document`, 401));
  }

  await document.update(req.body);

  res.status(200).json({ success: true, data: document });
});

// @desc    Delete document
exports.deleteDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findByPk(req.params.id);

  if (!document) {
    return next(new ErrorResponse(`Document not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is document owner or admin
  if (document.userId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this document`, 401));
  }

  await document.destroy();

  res.status(200).json({ success: true, data: {} });
});