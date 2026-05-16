const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const adminController = require("../controllers/admin.controller");

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllUsers
);

router.put(
  "/users/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.updateUserStatus
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.deleteUser
);

module.exports = router;