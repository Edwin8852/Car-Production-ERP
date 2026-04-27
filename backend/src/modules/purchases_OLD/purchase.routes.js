const router = require("express").Router();
const purchaseController = require("./purchase.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

// All purchase routes protected
router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN"));

router.post("/", purchaseController.createPurchase);
router.get("/", purchaseController.getAllPurchases);
router.put("/:id/status", purchaseController.updateStatus);

module.exports = router;
