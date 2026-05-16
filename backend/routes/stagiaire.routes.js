const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const stagiaireController = require("../controllers/stagiaire.controller");

router.get("/profile", authMiddleware, stagiaireController.getProfile);
router.put("/profile", authMiddleware, stagiaireController.updateProfile);

module.exports = router;