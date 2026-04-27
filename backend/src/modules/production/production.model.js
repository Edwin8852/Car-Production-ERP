const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const ProductionOrder = sequelize.define("ProductionOrder", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
  },
  product_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: "IN_PROGRESS",
  },
}, {
  tableName: "production_orders",
  underscored: true,
});

ProductionOrder.associate = (models) => {
  ProductionOrder.belongsTo(models.Order, { foreignKey: "order_id" });
  ProductionOrder.hasMany(models.Manufacturing, { foreignKey: "production_order_id", onDelete: "CASCADE" });
};

module.exports = ProductionOrder;
