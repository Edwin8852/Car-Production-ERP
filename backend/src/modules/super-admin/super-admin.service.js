const { sequelize } = require("../../config/sequelize");
const User = require("../users/users.model");
const Role = require("../users/role.model");
const Order = require("../orders/orders.model");
const ProductionOrder = require("../production/production.model");
const Material = require("../materials/materials.model");
const Supplier = require("../suppliers/suppliers.model");
const Purchase = require("../purchase/purchase.model");
const SystemSetting = require("../system/system.model");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

// ─────────────────────────────────────────
// SYSTEM ANALYTICS
// ─────────────────────────────────────────
const getFullDashboardStats = async () => {
  const [
    totalUsers,
    totalOrders,
    totalRevenue,
    activeProduction,
    lowStockCount,
    totalSuppliers,
    totalPurchases,
    pendingOrders,
    deliveredOrders,
  ] = await Promise.all([
    User.count(),
    Order.count(),
    Order.sum("total_amount", { where: { status: "DELIVERED" } }),
    ProductionOrder.count({ where: { status: "in_progress" } }),
    Material.count({ where: { stock: { [Op.lt]: 10 } } }),
    Supplier.count(),
    Purchase.sum("total_amount"),
    Order.count({ where: { status: "PENDING" } }),
    Order.count({ where: { status: "DELIVERED" } }),
  ]);

  return {
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue || 0,
    activeProduction,
    lowStockCount,
    totalSuppliers,
    totalPurchases: totalPurchases || 0,
    pendingOrders,
    deliveredOrders,
  };
};

// ─────────────────────────────────────────
// USER MANAGEMENT (Full CRUD for Super Admin)
// ─────────────────────────────────────────
const getAllUsers = async () => {
  return await User.findAll({
    include: [{ model: Role, attributes: ["id", "name"] }],
    attributes: { exclude: ["password"] },
    order: [["created_at", "DESC"]],
  });
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: [{ model: Role, attributes: ["id", "name"] }],
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new Error("User not found");
  return user;
};

const createUser = async (data) => {
  if (!data.password) throw new Error("Password is required");
  data.password = await bcrypt.hash(data.password, 10);
  return await User.create(data);
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  // Prevent changing password through this route without hashing
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await user.update(data);
};

const deleteUser = async (id, requestingUserId) => {
  if (parseInt(id) === parseInt(requestingUserId)) {
    throw new Error("You cannot delete your own account");
  }
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  await user.destroy();
};

// ─────────────────────────────────────────
// ROLE MANAGEMENT
// ─────────────────────────────────────────
const getAllRoles = async () => {
  return await Role.findAll({ order: [["id", "ASC"]] });
};

const createRole = async (data) => {
  const existing = await Role.findOne({ where: { name: data.name.toUpperCase() } });
  if (existing) throw new Error(`Role "${data.name}" already exists`);
  return await Role.create({ name: data.name.toUpperCase() });
};

const deleteRole = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) throw new Error("Role not found");

  const usersWithRole = await User.count({ where: { role_id: id } });
  if (usersWithRole > 0) {
    throw new Error(`Cannot delete role: ${usersWithRole} user(s) are assigned to it`);
  }
  await role.destroy();
};

// ─────────────────────────────────────────
// SYSTEM SETTINGS
// ─────────────────────────────────────────
const getAllSettings = async () => {
  return await SystemSetting.findAll({ order: [["key", "ASC"]] });
};

const upsertSetting = async (key, value) => {
  const [setting, created] = await SystemSetting.findOrCreate({
    where: { key },
    defaults: { key, value },
  });
  if (!created) {
    setting.value = value;
    await setting.save();
  }
  return setting;
};

const deleteSetting = async (key) => {
  const setting = await SystemSetting.findOne({ where: { key } });
  if (!setting) throw new Error("Setting not found");
  await setting.destroy();
};

// ─────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────
const getRevenueReport = async () => {
  const [rows] = await sequelize.query(`
    SELECT
      DATE_TRUNC('month', created_at) AS month,
      COUNT(*)::int AS total_orders,
      COALESCE(SUM(total_amount), 0)::float AS revenue
    FROM orders
    WHERE status = 'DELIVERED'
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `);
  return rows;
};

const getTopCustomers = async () => {
  const [rows] = await sequelize.query(`
    SELECT
      u.id,
      u.name,
      u.email,
      COUNT(o.id)::int AS total_orders,
      COALESCE(SUM(o.total_amount), 0)::float AS total_spent
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'DELIVERED'
    WHERE u.role = 'user'
    GROUP BY u.id, u.name, u.email
    ORDER BY total_spent DESC
    LIMIT 10
  `);
  return rows;
};

const getLowStockMaterials = async () => {
  return await Material.findAll({
    where: { stock: { [Op.lt]: 10 } },
    order: [["stock", "ASC"]],
  });
};

const getProductionSummary = async () => {
  const [rows] = await sequelize.query(`
    SELECT
      status,
      COUNT(*)::int AS count
    FROM production
    GROUP BY status
    ORDER BY count DESC
  `);
  return rows;
};

module.exports = {
  getFullDashboardStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllRoles,
  createRole,
  deleteRole,
  getAllSettings,
  upsertSetting,
  deleteSetting,
  getRevenueReport,
  getTopCustomers,
  getLowStockMaterials,
  getProductionSummary,
};
