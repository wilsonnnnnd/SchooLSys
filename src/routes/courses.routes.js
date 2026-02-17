const express = require('express');
const router = express.Router();

const CoursesController = require('../controllers/courses.controller');
const { requireRole } = require('../middleware/authorize.middleware');
const { decodeIdParam } = require('../middleware/id.middleware');
const { body, param } = require('express-validator');
const handleValidation = require('../middleware/validation.middleware');

router.get('/', CoursesController.list);

router.get(
  '/:id',
  decodeIdParam,
  param('id').isInt().toInt(),
  handleValidation,
  CoursesController.getById
);

router.post(
  '/',
  requireRole('admin'),
  body('name').isString().notEmpty().withMessage('name required'),
  body('code').optional().isString(),
  body('description').optional().isString(),
  body('teacher_id').optional().isString(),
  handleValidation,
  CoursesController.create
);

router.put(
  '/:id',
  decodeIdParam,
  param('id').isInt().toInt(),
  requireRole('admin'),
  body('name').optional().isString(),
  body('code').optional().isString(),
  body('description').optional().isString(),
  body('teacher_id').optional().isString(),
  handleValidation,
  CoursesController.update
);

router.delete(
  '/:id',
  decodeIdParam,
  param('id').isInt().toInt(),
  requireRole('admin'),
  handleValidation,
  CoursesController.delete
);

module.exports = router;
