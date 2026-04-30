const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Manufacturing = sequelize.define("Manufacturing", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  production_order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stage: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: "IN_PROGRESS",
  },
}, {
  tableName: "manufacturing",
  underscored: true,
});

Manufacturing.associate = (models) => {
  Manufacturing.belongsTo(models.Production, { foreignKey: "production_order_id" });
};

module.exports = Manufacturing;
