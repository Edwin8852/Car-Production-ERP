/**
 * init.js — One-time database initializer
 * Run with: node src/seeders/init.js
 */

require("dotenv").config();
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/sequelize");
const { ROLES, STATUS } = require("../shared/constants/roles");

// ── Load all models to register associations ──────────────────
const User           = require("../modules/users/users.model");
const Role           = require("../modules/users/role.model");
const Order          = require("../modules/orders/orders.model");
const Production     = require("../modules/production/production.model");
const Manufacturing  = require("../modules/manufacturing/manufacturing.model");
const Delivery       = require("../modules/delivery/delivery.model");
const Material       = require("../modules/materials/materials.model");
const Supplier       = require("../modules/suppliers/suppliers.model");
const Purchase       = require("../modules/purchase/purchase.model");
const SystemSetting  = require("../modules/system/system.model");

const models = {
  User, Role, Order, Production,
  Manufacturing, Delivery, Material, Supplier, Purchase,
};

const initializeDatabase = async () => {
  try {
    console.log("⏳ Connecting to database...");

    // 1. Link associations
    Object.keys(models).forEach((name) => {
      if (models[name].associate) models[name].associate(models);
    });
    console.log("✅ Model associations linked.");

    // 2. Sync schema (alter: true is safe for dev)
    await sequelize.sync({ alter: true });
    console.log("✅ Database schema synced.");

    // 3. Seed roles (lookup table)
    const roleNames = Object.values(ROLES).map(r => r.toUpperCase());
    for (const name of roleNames) {
      await Role.findOrCreate({ where: { name } });
    }
    console.log("✅ Roles seeded:", roleNames.join(", "));

    // 4. Seed default Super Admin user
    const existingSuperAdmin = await User.findOne({ where: { role: ROLES.SUPER_ADMIN } });
    if (!existingSuperAdmin) {
      const superAdminRole = await Role.findOne({ where: { name: "SUPER_ADMIN" } });
      const hashedPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123",
        10
      );
      await User.create({
        name:    "Super Admin",
        email:   process.env.SUPER_ADMIN_EMAIL || "superadmin@carerp.com",
        password: hashedPassword,
        phone:   "0000000000",
        role:    ROLES.SUPER_ADMIN,
        status:  STATUS.ACTIVE,
        department: "Management",
        role_id: superAdminRole?.id || null,
        address: "HQ Office, New Delhi",
      });
      console.log("✅ Default Super Admin created → superadmin@carerp.com / SuperAdmin@123");
    } else {
      console.log("ℹ️  Super Admin already exists — skipping seed.");
    }

    // 5. Seed system settings
    if (SystemSetting) {
      const defaults = [
        { key: "app_name",           value: "Car ERP" },
        { key: "low_stock_threshold", value: "10" },
        { key: "currency",           value: "INR" },
        { key: "timezone",           value: "Asia/Kolkata" },
      ];
      for (const setting of defaults) {
        await SystemSetting.findOrCreate({ where: { key: setting.key }, defaults: setting });
      }
      console.log("✅ System settings seeded.");
    }

    console.log("\n🎉 Database initialization complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
};

initializeDatabase();
