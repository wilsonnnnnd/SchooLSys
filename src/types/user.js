/**
 * User role type and helpers
 * @module types/user
 */

/**
 * @typedef {'student'|'parent'|'teacher'|'director'|'admin'} UserRole
 */

/** Role constants */
const ROLES = Object.freeze({
  student: 'student',
  parent: 'parent',
  teacher: 'teacher',
  director: 'director',
  admin: 'admin',
});

/**
 * Check whether a value is a valid UserRole
 * @param {any} v
 * @returns {v is UserRole}
 */
function isValidRole(v) {
  return Object.values(ROLES).includes(v);
}

module.exports = { ROLES, isValidRole };
