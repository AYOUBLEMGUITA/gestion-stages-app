const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const calendrierController = require("../controllers/calendrier.controller");

router.get("/", authMiddleware, calendrierController.getMyEvents);
router.post("/", authMiddleware, calendrierController.addEvent);
router.delete("/:id", authMiddleware, calendrierController.deleteEvent);

module.exports = router;