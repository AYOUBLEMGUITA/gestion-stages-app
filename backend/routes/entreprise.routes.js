const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const entrepriseController = require("../controllers/entreprise.controller");

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("entreprise"),
  entrepriseController.getProfile
);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("entreprise"),
  entrepriseController.updateProfile
);

module.exports = router;