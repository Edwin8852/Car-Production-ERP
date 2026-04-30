const router = require("express").Router();
const ctrl = require("./delivery.controller");
const { authenticate, requireActive, allowDelivery } = require("../../shared/middleware/auth.middleware");

// Global protection
router.use(authenticate);
router.use(requireActive);

/**
 * DELIVERY PERSON SPECIFIC ROUTES
 * Accessible by Delivery Person, Admin, and Super Admin
 */

// GET /api/delivery/assigned — Get assigned deliveries
router.get("/assigned", allowDelivery, ctrl.getAssignedDeliveries);

// GET /api/delivery/:id — Get details of a specific delivery
router.get("/:id", allowDelivery, ctrl.getDeliveryById);

// PUT /api/delivery/:id/status — Update status (flow validated)
router.put("/:id/status", allowDelivery, ctrl.updateDeliveryStatus);

// PUT /api/delivery/:id/confirm — Confirm delivery with proof/signature
router.put("/:id/confirm", allowDelivery, ctrl.confirmDelivery);

module.exports = router;
