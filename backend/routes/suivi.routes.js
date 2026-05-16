const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const suiviController = require("../controllers/suivi.controller");

router.get(
  "/stagiaires",
  authMiddleware,
  roleMiddleware("formateur", "admin"),
  suiviController.getStagiaires
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("formateur"),
  suiviController.addSuivi
);

router.get(
  "/stagiaire/:stagiaire_id",
  authMiddleware,
  roleMiddleware("formateur", "admin"),
  suiviController.getSuivisByStagiaire
);

module.exports = router;