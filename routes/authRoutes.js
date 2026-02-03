const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/me", auth.me);

module.exports = router;
