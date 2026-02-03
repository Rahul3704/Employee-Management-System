const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware");
const exporter = require("../controllers/exportController");

router.get("/export/csv", requireLogin, exporter.exportCSV);

module.exports = router;
