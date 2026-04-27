const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Delivery = sequelize.define("Delivery", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  delivery_person_id: {
    type: DataTypes.INTEGER,
  },
  delivery_person_name: {
    type: DataTypes.STRING(100),
  },
  delivery_status: {
    type: DataTypes.STRING(50),
    defaultValue: "READY",
  },
  delivery_date: {
    type: DataTypes.DATE,
  },
}, {
  tableName: "deliveries",
  underscored: true,
});

Delivery.associate = (models) => {
  Delivery.belongsTo(models.Order, { foreignKey: "order_id" });
  Delivery.belongsTo(models.User, { foreignKey: "delivery_person_id", as: "delivery_staff" });
};

module.exports = Delivery;
