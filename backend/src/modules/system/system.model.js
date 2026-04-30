const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const SystemSetting = sequelize.define("SystemSetting", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  key: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
  },
  group: {
    type: DataTypes.STRING(50), // e.g., 'GENERAL', 'PRODUCTION', 'DELIVERY'
    defaultValue: 'GENERAL',
  },
}, {
  tableName: "system_settings",
  underscored: true,
});

module.exports = SystemSetting;
