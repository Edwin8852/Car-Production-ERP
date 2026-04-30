const SystemSetting = require("./system.model");
const User = require("../users/users.model");
const Role = require("../users/role.model");
const Order = require("../orders/orders.model");
const Production = require("../production/production.model");
const { sequelize } = require("../../config/sequelize");

const getSystemStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const orderCount = await Order.count();
    const productionCount = await Production.count();
    
    // Revenue calculation (example)
    const revenue = await Order.sum('total_amount', { where: { status: 'DELIVERED' } }) || 0;

    res.json({
      success: true,
      data: {
        users: userCount,
        orders: orderCount,
        production: productionCount,
        revenue: revenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.findAll();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await SystemSetting.findOne({ where: { key } });
    if (!setting) return res.status(404).json({ success: false, message: "Setting not found" });

    setting.value = value;
    await setting.save();

    res.json({ success: true, message: "Setting updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSystemStats,
  getAllSettings,
  updateSetting
};
