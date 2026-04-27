const router = require("express").Router();
const purchaseController = require("./purchase.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

// All routes are protected by authentication
router.use(authenticate);

router.get("/", purchaseController.getAllPurchases);
router.get("/:id", purchaseController.getPurchaseById);

// Only authorized roles can create a purchase
router.post("/", authorize("SUPER_ADMIN", "ADMIN", "MANAGER"), purchaseController.createPurchase);

module.exports = router;
