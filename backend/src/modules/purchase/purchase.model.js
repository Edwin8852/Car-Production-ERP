const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Purchase = sequelize.define("Purchase", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  material_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: "ORDERED",
  },
}, {

  tableName: "purchases",
  underscored: true,
});

Purchase.associate = (models) => {
  Purchase.belongsTo(models.Supplier, { foreignKey: "supplier_id" });
  Purchase.belongsTo(models.Material, { foreignKey: "material_id" });
};

module.exports = Purchase;
