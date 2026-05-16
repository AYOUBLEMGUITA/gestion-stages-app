const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const candidatureController = require("../controllers/candidature.controller");

router.post(
  "/postuler",
  authMiddleware,
  roleMiddleware("stagiaire"),
  candidatureController.postuler
);

router.get(
  "/mes-candidatures",
  authMiddleware,
  roleMiddleware("stagiaire"),
  candidatureController.mesCandidatures
);

router.get(
  "/entreprise",
  authMiddleware,
  roleMiddleware("entreprise"),
  candidatureController.candidaturesEntreprise
);

router.put(
  "/:id/statut",
  authMiddleware,
  roleMiddleware("entreprise"),
  candidatureController.updateStatut
);

module.exports = router;
