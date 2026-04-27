const { sequelize } = require("../config/sequelize");
const User = require("../modules/users/users.model");
const Role = require("../modules/users/role.model");
const Customer = require("../modules/customers/customers.model");
const Order = require("../modules/orders/orders.model");
const ProductionOrder = require("../modules/production/production.model");
const Manufacturing = require("../modules/manufacturing/manufacturing.model");
const Delivery = require("../modules/delivery/delivery.model");
const Material = require("../modules/materials/materials.model");
const Supplier = require("../modules/suppliers/suppliers.model");
const Purchase = require("../modules/purchase/purchase.model");

const models = {
  User,
  Role,
  Customer,
  Order,
  ProductionOrder,
  Manufacturing,
  Delivery,
  Material,
  Supplier,
  Purchase
};

const initializeDatabase = async () => {
  try {
    console.log("⏳ Connecting to database and linking associations...");

    // 1. Link Associations
    Object.keys(models).forEach((modelName) => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });

    // 2. Sync Database (This creates tables and foreign keys based on models)
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully.");

    // 3. Seed Default Roles
    const roles = ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF", "DELIVERY", "CUSTOMER"];
    for (const roleName of roles) {
      await Role.findOrCreate({ where: { name: roleName } });
    }
    console.log("✅ Roles seeded.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
};

initializeDatabase();
