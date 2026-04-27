const { sequelize } = require("../../config/sequelize");
const customerSchema = require("./customers.schema");

const Customer = sequelize.define("Customer", customerSchema, {
  tableName: "customers",
  underscored: true,
});

module.exports = Customer;
