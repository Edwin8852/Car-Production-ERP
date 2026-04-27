const express = require("express");
const router = express.Router();
const deliveryController = require("./delivery.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

router.use(authenticate);

router.post("/", authorize("SUPER_ADMIN", "ADMIN", "MANAGER", "DELIVERY"), deliveryController.createDelivery);
router.get("/", deliveryController.getAllDeliveries);
router.patch("/:id/status", authorize("SUPER_ADMIN", "ADMIN", "DELIVERY"), deliveryController.updateStatus);

module.exports = router;
