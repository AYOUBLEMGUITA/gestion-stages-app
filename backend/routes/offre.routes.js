const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const offreController = require("../controllers/offre.controller");

router.get(
  "/mes-offres",
  authMiddleware,
  roleMiddleware("entreprise"),
  offreController.getMesOffres
);

router.get("/", authMiddleware, offreController.getAllOffres);
router.get("/:id", authMiddleware, offreController.getOffreById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("entreprise", "admin"),
  offreController.createOffre
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("entreprise", "admin"),
  offreController.updateOffre
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("entreprise", "admin"),
  offreController.deleteOffre
);

module.exports = router;
