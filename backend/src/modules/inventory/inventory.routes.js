const router = require("express").Router();
const inventoryController = require("./inventory.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

// All inventory routes protected
router.use(authenticate);

router.get("/materials", authorize("SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"), inventoryController.getAllMaterials);
router.post("/materials", authorize("SUPER_ADMIN", "ADMIN", "MANAGER"), inventoryController.createMaterial);
router.get("/", authorize("SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"), inventoryController.getInventory);
router.post("/update-stock", authorize("SUPER_ADMIN", "ADMIN", "MANAGER"), inventoryController.updateStock);

module.exports = router;
