const express = require("express");
const router = express.Router();

const usersRoutes = require("./users.routes");
const authRoutes = require("./auth.routes");
const emailRoutes = require("./email.routes");
const coursesRoutes = require("./courses.routes");

router.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use('/emails', emailRoutes);
router.use('/courses', coursesRoutes);

module.exports = router;
