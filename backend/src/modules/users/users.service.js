const bcrypt = require("bcrypt");
const User = require("./users.model");
const { ROLES, STATUS } = require("../../shared/constants/roles");

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

// Roles an Admin is allowed to assign (cannot assign super_admin or admin)
const ADMIN_ALLOWED_ROLES = [ROLES.MANAGER, ROLES.DELIVERY, ROLES.USER];

const assertAdminCannotAssignSuperRole = (requestingRole, targetRole) => {
  // Normalize roles to lowercase
  const reqRole = requestingRole?.toLowerCase();
  const tarRole = targetRole?.toLowerCase();

  if (reqRole === ROLES.ADMIN && !ADMIN_ALLOWED_ROLES.includes(tarRole)) {
    throw new Error(`Admin cannot create or assign a user with role: ${targetRole}`);
  }
};

// ─────────────────────────────────────────────────────────────
// GET ALL USERS
// ─────────────────────────────────────────────────────────────
const getAllUsers = async (filters = {}) => {
  const where = {};
  if (filters.role)   where.role   = filters.role;
  if (filters.status) where.status = filters.status;

  return await User.findAll({
    where,
    include: [{ model: Role, as: "roleInfo", attributes: ["id", "name"] }],
    order: [["created_at", "DESC"]],
  });
};

// ─────────────────────────────────────────────────────────────
// GET USER BY ID
// ─────────────────────────────────────────────────────────────
const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: [{ model: Role, as: "roleInfo", attributes: ["id", "name"] }],
  });
  if (!user) throw new Error("User not found.");
  return user;
};

// ─────────────────────────────────────────────────────────────
// CREATE USER (Admin creates Manager/Delivery/User)
// ─────────────────────────────────────────────────────────────
const createUser = async (data, requestingRole) => {
  const { name, email, password, phone, role, department } = data;

  // Validate required fields
  if (!name)     throw new Error("Name is required.");
  if (!email)    throw new Error("Email is required.");
  if (!password) throw new Error("Password is required.");
  if (!phone)    throw new Error("Phone is required.");
  if (!role)     throw new Error("Role is required.");

  // RBAC guard: Admin cannot create Admin or Super Admin
  if (requestingRole) {
    assertAdminCannotAssignSuperRole(requestingRole, role);
  }

  // Duplicate check
  const existing = await User.scope("withPassword").findOne({ where: { email } });
  if (existing) throw new Error("A user with this email already exists.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role,
    department: department || null,
    status: STATUS.ACTIVE,
  });

  const { password: _, ...safeUser } = user.toJSON();
  return safeUser;
};

// ─────────────────────────────────────────────────────────────
// UPDATE USER
// ─────────────────────────────────────────────────────────────
const updateUser = async (id, data, requestingRole) => {
  const user = await User.scope("withPassword").findByPk(id);
  if (!user) throw new Error("User not found.");

  // RBAC guard: Admin cannot re-assign role to ADMIN or SUPER_ADMIN
  if (data.role && requestingRole) {
    assertAdminCannotAssignSuperRole(requestingRole, data.role);
  }

  // Hash password if being changed
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await user.update(data);
  const { password: _, ...safeUser } = user.toJSON();
  return safeUser;
};

// ─────────────────────────────────────────────────────────────
// ACTIVATE / DEACTIVATE USER
// ─────────────────────────────────────────────────────────────
const toggleUserStatus = async (id, requestingUserId) => {
  if (parseInt(id) === parseInt(requestingUserId)) {
    throw new Error("You cannot deactivate your own account.");
  }

  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found.");

  const newStatus = user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
  await user.update({ status: newStatus });

  return { id: user.id, name: user.name, status: newStatus };
};

// ─────────────────────────────────────────────────────────────
// DELETE USER (Super Admin only)
// ─────────────────────────────────────────────────────────────
const deleteUser = async (id, requestingUserId) => {
  if (parseInt(id) === parseInt(requestingUserId)) {
    throw new Error("You cannot delete your own account.");
  }

  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found.");

  await user.destroy();
  return { message: `User "${user.name}" deleted successfully.` };
};

// ─────────────────────────────────────────────────────────────
// GET ALL ROLES
// ─────────────────────────────────────────────────────────────
const getRoles = async () => {
  return await Role.findAll({ order: [["id", "ASC"]] });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getRoles,
};
