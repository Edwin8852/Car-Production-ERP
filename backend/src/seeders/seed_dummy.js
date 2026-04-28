const { sequelize } = require("../config/sequelize");
const User = require("../modules/users/users.model");
const Role = require("../modules/users/role.model");
const Customer = require("../modules/customers/customers.model");
const Material = require("../modules/materials/materials.model");
const Supplier = require("../modules/suppliers/suppliers.model");
const Order = require("../modules/orders/orders.model");
const ProductionOrder = require("../modules/production/production.model");
const Manufacturing = require("../modules/manufacturing/manufacturing.model");
const Delivery = require("../modules/delivery/delivery.model");
const bcrypt = require("bcrypt");

const seedFullData = async () => {
  try {
    console.log("⏳ Syncing database and seeding COMPLETE dummy data...");
    await sequelize.sync();

    // 1. Roles
    const roles = ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"];
    for (const roleName of roles) {
      await Role.findOrCreate({ where: { name: roleName } });
    }

    // 2. Admin User
    const adminRole = await Role.findOne({ where: { name: "SUPER_ADMIN" } });
    const hashedPassword = await bcrypt.hash("admin@321", 10);
    const [admin] = await User.findOrCreate({
      where: { email: "admin@gmail.com" },
      defaults: { name: "Admin User", password: hashedPassword, role_id: adminRole.id }
    });

    // 3. Customers
    const [cust1] = await Customer.findOrCreate({
      where: { email: "rahul@gmail.com" },
      defaults: { name: "Rahul Sharma", phone: "9876543210", address: "Mumbai, Maharashtra" }
    });
    const [cust2] = await Customer.findOrCreate({
      where: { email: "priya@gmail.com" },
      defaults: { name: "Priya Singh", phone: "9123456789", address: "Delhi, NCR" }
    });

    // 4. Suppliers & Materials
    const [sup] = await Supplier.findOrCreate({
      where: { email: "info@tatasteel.com" },
      defaults: { name: "Tata Steel", contact_person: "Mr. Ratan", phone: "022-123456", address: "Jamshedpur" }
    });

    const mat1 = await Material.findOrCreate({
      where: { name: "Steel Body Frame" },
      defaults: { unit: "unit", stock: 50, description: "SUV Chassis" }
    });

    // 5. Orders
    const [order1] = await Order.findOrCreate({
      where: { customer_id: cust1.id, product_name: "Safari SUV" },
      defaults: { status: "IN_PROGRESS" }
    });

    const [order2] = await Order.findOrCreate({
      where: { customer_id: cust2.id, product_name: "Nexon EV" },
      defaults: { status: "PENDING" }
    });

    // 6. Production & Manufacturing
    const [prod1] = await ProductionOrder.findOrCreate({
      where: { order_id: order1.id },
      defaults: { product_name: "Safari SUV", status: "IN_PROGRESS" }
    });

    const stages = ["Assembly", "Painting", "Testing"];
    for (const stage of stages) {
      await Manufacturing.findOrCreate({
        where: { production_order_id: prod1.id, stage: stage },
        defaults: { status: stage === "Assembly" ? "COMPLETED" : "IN_PROGRESS" }
      });
    }

    // 7. Delivery
    await Delivery.findOrCreate({
      where: { order_id: order1.id },
      defaults: { delivery_status: "READY", delivery_person_name: "Amit Kumar", delivery_date: new Date() }
    });

    console.log("✅ COMPLETE dummy data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedFullData();
