const router = require("express").Router();
const ctrl = require("./super-admin.controller");
const { authenticate, allowSuperAdmin } = require("../../shared/middleware/auth.middleware");

// All routes strictly require authentication + SUPER_ADMIN role
router.use(authenticate);
router.use(allowSuperAdmin);

// ─────────────────────────────────────────
// DASHBOARD STATS
// GET /api/super-admin/stats
// ─────────────────────────────────────────
router.get("/stats", ctrl.getDashboardStats);

// ─────────────────────────────────────────
// USER MANAGEMENT
// GET    /api/super-admin/users
// GET    /api/super-admin/users/:id
// POST   /api/super-admin/users
// PUT    /api/super-admin/users/:id
// DELETE /api/super-admin/users/:id
// ─────────────────────────────────────────
router.get("/users", ctrl.getAllUsers);
router.get("/users/:id", ctrl.getUserById);
router.post("/users", ctrl.createUser);
router.put("/users/:id", ctrl.updateUser);
router.delete("/users/:id", ctrl.deleteUser);

// ─────────────────────────────────────────
// ROLE MANAGEMENT
// GET    /api/super-admin/roles
// POST   /api/super-admin/roles
// DELETE /api/super-admin/roles/:id
// ─────────────────────────────────────────
router.get("/roles", ctrl.getAllRoles);
router.post("/roles", ctrl.createRole);
router.delete("/roles/:id", ctrl.deleteRole);

// ─────────────────────────────────────────
// SYSTEM SETTINGS
// GET    /api/super-admin/settings
// PUT    /api/super-admin/settings        (upsert by key)
// DELETE /api/super-admin/settings/:key
// ─────────────────────────────────────────
router.get("/settings", ctrl.getAllSettings);
router.put("/settings", ctrl.upsertSetting);
router.delete("/settings/:key", ctrl.deleteSetting);

// ─────────────────────────────────────────
// REPORTS
// GET /api/super-admin/reports/revenue
// GET /api/super-admin/reports/top-customers
// GET /api/super-admin/reports/low-stock
// GET /api/super-admin/reports/production
// ─────────────────────────────────────────
router.get("/reports/revenue", ctrl.getRevenueReport);
router.get("/reports/top-customers", ctrl.getTopCustomers);
router.get("/reports/low-stock", ctrl.getLowStockMaterials);
router.get("/reports/production", ctrl.getProductionSummary);

module.exports = router;
