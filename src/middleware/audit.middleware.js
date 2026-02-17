/**
 * Audit middleware helpers
 * - setCreateAudit: for POST routes, sets `created_at`, `updated_at`, `enabled` if absent
 * - setUpdateAudit: for PUT/PATCH routes, sets `updated_at`
 * - setSoftDeleteAudit: for DELETE routes (soft-delete), sets `deleted_at` and `enabled=false`
 *
 * Usage:
 * const audit = require('../middleware/audit.middleware');
 * router.post('/', audit.setCreateAudit, controller.create);
 * router.put('/:id', audit.setUpdateAudit, controller.update);
 * router.delete('/:id', audit.setSoftDeleteAudit, controller.softDeleteOrUpdate);
 */

function now() {
  return new Date();
}

function setCreateAudit(req, res, next) {
  try {
    const ts = now();
    if (!req.body) req.body = {};
    if (req.body.created_at === undefined) req.body.created_at = ts;
    req.body.updated_at = ts;
    if (req.body.enabled === undefined) req.body.enabled = true;
    next();
  } catch (err) {
    next(err);
  }
}

function setUpdateAudit(req, res, next) {
  try {
    if (!req.body) req.body = {};
    req.body.updated_at = now();
    next();
  } catch (err) {
    next(err);
  }
}

function setSoftDeleteAudit(req, res, next) {
  try {
    if (!req.body) req.body = {};
    req.body.deleted_at = now();
    req.body.enabled = false;
    // Also update updated_at for record
    req.body.updated_at = now();
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { setCreateAudit, setUpdateAudit, setSoftDeleteAudit };
