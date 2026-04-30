const express = require("express");
const router = express.Router();
const manufacturingController = require("./manufacturing.controller");
const {
  authenticate,
  requireActive,
  allowAdminAccess,
  allowManager,
} = require("../../shared/middleware/auth.middleware");

router.use(authenticate);
router.use(requireActive);

// Managers+ can view and update manufacturing stages
router.get("/order/:orderId", allowManager, manufacturingController.getStagesByOrder);
router.patch("/:id/status", allowManager, manufacturingController.updateStageStatus);

// Admin+ can create stages
router.post("/", allowAdminAccess, manufacturingController.createStage);

module.exports = router;
