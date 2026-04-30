const service = require("./super-admin.service");

// ─────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const data = await service.getFullDashboardStats();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const data = await service.getAllUsers();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const data = await service.getUserById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const data = await service.createUser(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const data = await service.updateUser(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await service.deleteUser(req.params.id, req.user.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// ROLE MANAGEMENT
// ─────────────────────────────────────────
const getAllRoles = async (req, res) => {
  try {
    const data = await service.getAllRoles();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const data = await service.createRole(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    await service.deleteRole(req.params.id);
    res.json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// SYSTEM SETTINGS
// ─────────────────────────────────────────
const getAllSettings = async (req, res) => {
  try {
    const data = await service.getAllSettings();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const upsertSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, message: "key and value are required" });
    }
    const data = await service.upsertSetting(key, value);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteSetting = async (req, res) => {
  try {
    await service.deleteSetting(req.params.key);
    res.json({ success: true, message: "Setting deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────
const getRevenueReport = async (req, res) => {
  try {
    const data = await service.getRevenueReport();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTopCustomers = async (req, res) => {
  try {
    const data = await service.getTopCustomers();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLowStockMaterials = async (req, res) => {
  try {
    const data = await service.getLowStockMaterials();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductionSummary = async (req, res) => {
  try {
    const data = await service.getProductionSummary();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
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
