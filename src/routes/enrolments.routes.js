const express = require('express');
const router = express.Router();

const EnrolmentsController = require('../controllers/enrolments.controller');
const { requireRole } = require('../middleware/authorize.middleware');
const { decodeIdParam } = require('../middleware/id.middleware');
const { body, param } = require('express-validator');
const handleValidation = require('../middleware/validation.middleware');

router.get('/', EnrolmentsController.list);

router.get(
  '/:id',
  decodeIdParam,
  param('id').isInt().toInt(),
  handleValidation,
  EnrolmentsController.getById
);

router.post(
  '/',
  requireRole('admin'),
  body('student_id').exists().withMessage('student_id required'),
  body('course_id').exists().withMessage('course_id required'),
  handleValidation,
  EnrolmentsController.create
);

router.put(
  '/:id',
  decodeIdParam,
  param('id').isInt().toInt(),
  requireRole('admin'),
  body('student_id').optional(),
  body('course_id').optional(),
  handleValidation,
  EnrolmentsController.update
);

router.delete(
  '/:id',
  decodeIdParam,
  param('id').isInt().toInt(),
  requireRole('admin'),
  handleValidation,
  EnrolmentsController.delete
);

module.exports = router;
