const router = require("express").Router();
const ctrl = require("./users.controller");
const {
  authenticate,
  requireActive,
  allowSuperAdmin,
  allowAdminAccess,
  allowUser,
} = require("../../shared/middleware/auth.middleware");

// All routes require a valid, active session
router.use(authenticate);
router.use(requireActive);

// ─────────────────────────────────────────────────────────────
// PROFILE MANAGEMENT (User can access own)
// ─────────────────────────────────────────────────────────────

// GET /api/users/profile
router.get("/profile", allowUser, ctrl.getProfile);

// PUT /api/users/profile
router.put("/profile", allowUser, ctrl.updateProfile);

// ─────────────────────────────────────────────────────────────
// USER CRUD (Admin Only)
// ─────────────────────────────────────────────────────────────

// GET /api/users?role=MANAGER&status=ACTIVE  — Admin + Super Admin
router.get("/", allowAdminAccess, ctrl.getAllUsers);

// GET /api/users/roles  — Super Admin only (Admin uses fixed ENUM list on FE)
router.get("/roles", allowSuperAdmin, ctrl.getRoles);

// POST /api/users  — Admin creates MANAGER/DELIVERY/USER; Super Admin creates ADMIN
//   Service layer enforces the role restriction at business logic level
router.post("/", allowAdminAccess, ctrl.createUser);

// GET /api/users/:id  — Admin + Super Admin
router.get("/:id", allowAdminAccess, ctrl.getUserById);

// PUT /api/users/:id  — Admin + Super Admin (service guards role escalation)
router.put("/:id", allowAdminAccess, ctrl.updateUser);

// PATCH /api/users/:id/status  — Toggle ACTIVE / INACTIVE (Admin + Super Admin)
router.patch("/:id/status", allowAdminAccess, ctrl.toggleUserStatus);

// DELETE /api/users/:id  — Super Admin ONLY (irreversible)
router.delete("/:id", allowSuperAdmin, ctrl.deleteUser);

module.exports = router;
