const router = require("express").Router();
const materialsController = require("./materials.controller");
const { authenticate, requireActive, allowAdminAccess, allowManager } = require("../../shared/middleware/auth.middleware");

router.use(authenticate);
router.use(requireActive);

// Read access for Manager+, write access for Admin+
router.get("/", allowManager, materialsController.getAllMaterials);
router.post("/", allowAdminAccess, materialsController.createMaterial);
router.get("/:id", allowManager, materialsController.getMaterialById);
router.put("/:id", allowAdminAccess, materialsController.updateMaterial);
router.delete("/:id", allowAdminAccess, materialsController.deleteMaterial);

module.exports = router;

