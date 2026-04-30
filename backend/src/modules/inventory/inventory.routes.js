const router = require("express").Router();
const inventoryController = require("./inventory.controller");
const { authenticate, requireActive, allowAdminAccess } = require("../../shared/middleware/auth.middleware");

router.use(authenticate);
router.use(requireActive);
router.use(allowAdminAccess);

router.get("/materials", inventoryController.getAllMaterials);
router.post("/materials", inventoryController.createMaterial);
router.get("/", inventoryController.getInventory);
router.post("/update-stock", inventoryController.updateStock);

module.exports = router;

