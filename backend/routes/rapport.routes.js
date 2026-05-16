const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const rapportController = require("../controllers/rapport.controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("stagiaire"),
  upload.single("fichier"),
  rapportController.uploadRapport
);

router.get(
  "/mes-rapports",
  authMiddleware,
  roleMiddleware("stagiaire"),
  rapportController.getMesRapports
);

router.get(
  "/all",
  authMiddleware,
  roleMiddleware("formateur", "admin"),
  rapportController.getAllRapports
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("formateur", "admin"),
  rapportController.updateRapportStatus
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("stagiaire"),
  rapportController.deleteRapport
);

module.exports = router;