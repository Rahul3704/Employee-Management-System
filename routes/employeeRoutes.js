const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware");
const emp = require("../controllers/employeeController");

router.get("/", requireLogin, emp.getAll);
router.get("/:id", requireLogin, emp.getOne);
router.post("/", requireLogin, emp.create);
router.put("/:id", requireLogin, emp.update);
router.delete("/:id", requireLogin, emp.remove);

module.exports = router;
