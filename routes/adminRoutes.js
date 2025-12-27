const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Register only with the setup key (for initial admin creation)
router.post("/register", adminController.registerAdmin);

// Login
router.post("/login", adminController.loginAdmin);

module.exports = router;
