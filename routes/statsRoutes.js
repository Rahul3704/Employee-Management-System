const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware");
const stats = require("../controllers/statsController");

router.get("/stats", requireLogin, stats.getStats);

module.exports = router;
