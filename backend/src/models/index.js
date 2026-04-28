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

// Initialize associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
