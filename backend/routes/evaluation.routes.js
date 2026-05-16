const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const evaluationController = require("../controllers/evaluation.controller");

router.get(
  "/stagiaires-acceptes",
  authMiddleware,
  roleMiddleware("entreprise"),
  evaluationController.getStagiairesAcceptes
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("entreprise"),
  evaluationController.addEvaluation
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("entreprise", "formateur", "admin"),
  evaluationController.getEvaluations
);

router.put(
  "/:id/valider",
  authMiddleware,
  roleMiddleware("formateur", "admin"),
  evaluationController.validerEvaluation
);

module.exports = router;