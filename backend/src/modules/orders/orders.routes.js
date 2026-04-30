const express = require("express");
const router = express.Router();
const orderController = require("./orders.controller");
const {
  authenticate,
  requireActive,
  allowAdminAccess,
  allowManager,
  allowUser,
} = require("../../shared/middleware/auth.middleware");

// Global protection
router.use(authenticate);
router.use(requireActive);

// ─────────────────────────────────────────────────────────────
// USER (CUSTOMER) ROUTES
// ─────────────────────────────────────────────────────────────

// GET /api/orders/my — Get own orders
router.get("/my", allowUser, orderController.getMyOrders);

// GET /api/orders/:id — Track specific order (ownership validated in service)
router.get("/:id", allowUser, orderController.getTrackingInfo);

// POST /api/orders — Place a new order
router.post("/", allowUser, orderController.createOrder);

// ─────────────────────────────────────────────────────────────
// ADMIN / MANAGER ROUTES
// ─────────────────────────────────────────────────────────────

// GET /api/orders — Admin view all orders
router.get("/", allowAdminAccess, orderController.getAllOrders);

// PATCH /api/orders/:id — Update order status (Production Trigger)
router.patch("/:id", allowAdminAccess, orderController.updateStatus);

module.exports = router;
