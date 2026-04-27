const express = require("express");
const router = express.Router();
const productionController = require("./production.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

// All production routes protected
router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"));

router.post("/", productionController.createProductionOrder);
router.get("/", productionController.getAllProductionOrders);

module.exports = router;
