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
}, {
  tableName: "materials",
  underscored: true,
});

Material.associate = (models) => {
  Material.hasMany(models.Purchase, { foreignKey: "material_id" });
};

module.exports = Material;
