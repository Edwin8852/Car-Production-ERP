const router = require("express").Router();
const ctrl = require("./suppliers.controller");
const { authenticate, requireActive, allowAdminAccess } = require("../../shared/middleware/auth.middleware");

// Global protection
router.use(authenticate);
router.use(requireActive);

/**
 * SUPPLIER MANAGEMENT ROUTES
 * Accessible only by Admin and Super Admin
 */

// POST /api/suppliers — Create supplier
router.post("/", allowAdminAccess, ctrl.createSupplier);

// GET /api/suppliers — Get all suppliers
router.get("/", allowAdminAccess, ctrl.getAllSuppliers);

// GET /api/suppliers/:id — Get single supplier
router.get("/:id", allowAdminAccess, ctrl.getSupplierById);

// PUT /api/suppliers/:id — Update supplier
router.put("/:id", allowAdminAccess, ctrl.updateSupplier);

// DELETE /api/suppliers/:id — Soft delete (deactivate)
router.delete("/:id", allowAdminAccess, ctrl.deleteSupplier);

module.exports = router;
