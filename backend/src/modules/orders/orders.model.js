const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: "PENDING",
  },
}, {
  tableName: "orders",
  underscored: true,
});

Order.associate = (models) => {
  Order.belongsTo(models.Customer, { foreignKey: "customer_id" });
  Order.hasOne(models.ProductionOrder, { foreignKey: "order_id", onDelete: "CASCADE" });
  Order.hasOne(models.Delivery, { foreignKey: "order_id", onDelete: "CASCADE" });
};

module.exports = Order;
