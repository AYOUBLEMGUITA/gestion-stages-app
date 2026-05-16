const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const conventionController = require("../controllers/convention.controller");

router.get(
  "/entreprises",
  authMiddleware,
  roleMiddleware("stagiaire", "admin"),
  conventionController.getEntreprisesList
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("stagiaire"),
  conventionController.createConvention
);

router.get(
  "/mes-conventions",
  authMiddleware,
  roleMiddleware("stagiaire"),
  conventionController.getMesConventions
);

router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin"),
  conventionController.getAllConventions
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  conventionController.updateConventionStatus
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("stagiaire", "admin"),
  conventionController.deleteConvention
);

module.exports = router;