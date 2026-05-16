const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../middleware/auth.middleware");
const documentController = require("../controllers/document.controller");
const uploadsDir = path.join(__dirname, "..", "uploads");
const roleMiddleware = require("../middleware/role.middleware");

// Configuration multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Filter files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("stagiaire"),
  upload.single("fichier"),
  documentController.uploadDocument
);

router.get(
  "/mes-documents",
  authMiddleware,
  roleMiddleware("stagiaire"),
  documentController.getMesDocuments
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("stagiaire"),
  documentController.deleteDocument
);

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin"),
  documentController.getAllDocuments
);

router.put(
  "/admin/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  documentController.updateDocumentStatus
);

module.exports = router;
