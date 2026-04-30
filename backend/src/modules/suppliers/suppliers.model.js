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
    unique: true,
  },
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  gst_number: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },
}, {
  tableName: "suppliers",
  underscored: true,
});

Supplier.associate = (models) => {
  Supplier.hasMany(models.Purchase, { foreignKey: "supplier_id", as: "purchases" });
  Supplier.hasMany(models.Material, { foreignKey: "supplier_id", as: "materials" });
};

module.exports = Supplier;
