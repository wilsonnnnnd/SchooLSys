const express = require("express");
const router = express.Router();

const usersRoutes = require("./users.routes");
const authRoutes = require("./auth.routes");
const emailRoutes = require("./email.routes");
const coursesRoutes = require("./courses.routes");
const enrolmentsRoutes = require("./enrolments.routes");

router.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use('/emails', emailRoutes);
router.use('/courses', coursesRoutes);
router.use('/enrolments', enrolmentsRoutes);

module.exports = router;
