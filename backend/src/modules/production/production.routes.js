const router = require("express").Router();
const ctrl = require("./production.controller");
const { authenticate, requireActive, allowManager, allowAdminAccess } = require("../../shared/middleware/auth.middleware");

// Global protection
router.use(authenticate);
router.use(requireActive);

/**
 * MANAGER SPECIFIC ROUTES
 * These routes are optimized for the Manager role but accessible by Admin/Super Admin
 */

// GET /api/production/assigned — Get only productions assigned to the logged-in manager
router.get("/assigned", allowManager, ctrl.getAssignedProductions);

// GET /api/production/:id — Get details of a specific production (assigned only for managers)
router.get("/:id", allowManager, ctrl.getProductionById);

// PUT /api/production/:id/status — Update production status (flow validated)
router.put("/:id/status", allowManager, ctrl.updateProductionStatus);

// PUT /api/production/:id/materials — Update material usage
router.put("/:id/materials", allowManager, ctrl.updateMaterialUsage);

/**
 * ADMIN SPECIFIC ROUTES (Future Expansion)
 * e.g., router.post("/", allowAdminAccess, ctrl.createProduction);
 */

module.exports = router;
