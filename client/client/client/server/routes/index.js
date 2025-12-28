const express = require("express");
const router = express.Router();

const authRoutes = require("./authroutes");
const userRoutes = require("./user.routes");
const profileRoutes = require("./profileroute");
const matchRoutes = require("./match.routes");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/profile", profileRoutes);
router.use("/match", matchRoutes);

module.exports = router;