const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  product_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ordered', 'in_production', 'ready_for_delivery', 'delivered'),
    defaultValue: 'ordered',
  },
  production_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  delivery_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "orders",
  underscored: true,
});

Order.associate = (models) => {
  Order.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  Order.hasOne(models.Production, { foreignKey: "order_id", as: "production", onDelete: "CASCADE" });
  Order.hasOne(models.Delivery, { foreignKey: "order_id", as: "delivery", onDelete: "CASCADE" });
};

module.exports = Order;
