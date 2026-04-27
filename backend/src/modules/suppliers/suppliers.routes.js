const router = require("express").Router();
const suppliersController = require("./suppliers.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

// All supplier routes protected
router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN", "MANAGER"));

router.get("/", suppliersController.getAllSuppliers);
router.post("/", suppliersController.createSupplier);
router.get("/:id", suppliersController.getSupplierById);
router.put("/:id", suppliersController.updateSupplier);
router.delete("/:id", suppliersController.deleteSupplier);

module.exports = router;
