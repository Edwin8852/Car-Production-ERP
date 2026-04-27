const express = require("express");
const router = express.Router();
const orderController = require("./orders.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

router.use(authenticate);

router.post("/", authorize("SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF", "CUSTOMER"), orderController.createOrder);
router.get("/", authorize("SUPER_ADMIN", "ADMIN", "MANAGER"), orderController.getAllOrders);
router.patch("/:id/status", authorize("SUPER_ADMIN", "ADMIN", "MANAGER"), orderController.updateStatus);
router.get("/:id/track", orderController.getTrackingInfo);

module.exports = router;
