const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { DELIVERY_STATUS } = require("../../shared/constants/delivery");

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
  assigned_delivery_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(Object.values(DELIVERY_STATUS)),
    defaultValue: DELIVERY_STATUS.ASSIGNED,
    allowNull: false,
  },
  delivery_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  delivery_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  proof_image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  customer_signature: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Base64 or SVG signature string",
  },
}, {
  tableName: "deliveries",
  underscored: true,
});

Delivery.associate = (models) => {
  Delivery.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
  Delivery.belongsTo(models.User, { foreignKey: "assigned_delivery_id", as: "delivery_person" });
};

module.exports = Delivery;
