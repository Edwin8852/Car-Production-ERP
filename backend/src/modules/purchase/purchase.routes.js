const router = require("express").Router();
const purchaseController = require("./purchase.controller");
const { authenticate, requireActive, allowAdminAccess } = require("../../shared/middleware/auth.middleware");

router.use(authenticate);
router.use(requireActive);
router.use(allowAdminAccess);

router.get("/", purchaseController.getAllPurchases);
router.get("/:id", purchaseController.getPurchaseById);
router.post("/", purchaseController.createPurchase);
router.patch("/:id/status", purchaseController.updatePurchaseStatus);

module.exports = router;

