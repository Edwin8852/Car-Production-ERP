const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Material = sequelize.define("Material", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  unit: {
    type: DataTypes.STRING(20),
  },
  stock: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "materials",
  underscored: true,
});

Material.associate = (models) => {
  Material.belongsTo(models.Supplier, { foreignKey: "supplier_id", as: "supplier" });
  Material.hasMany(models.Purchase, { foreignKey: "material_id" });
};

module.exports = Material;
