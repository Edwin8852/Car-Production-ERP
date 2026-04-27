const router = require("express").Router();
const materialsController = require("./materials.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

// All materials routes protected
router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN", "MANAGER"));

router.get("/", materialsController.getAllMaterials);
router.post("/", materialsController.createMaterial);
router.get("/:id", materialsController.getMaterialById);
router.put("/:id", materialsController.updateMaterial);
router.delete("/:id", materialsController.deleteMaterial);

module.exports = router;
