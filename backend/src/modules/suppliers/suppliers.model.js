const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Supplier = sequelize.define("Supplier", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  contact_person: {
    type: DataTypes.STRING(100),
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  email: {
    type: DataTypes.STRING(100),
  },
  address: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: "suppliers",
  underscored: true,
});

Supplier.associate = (models) => {
  Supplier.hasMany(models.Purchase, { foreignKey: "supplier_id" });
};

module.exports = Supplier;
