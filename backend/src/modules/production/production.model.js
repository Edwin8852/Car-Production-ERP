const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { PRODUCTION_STATUS } = require("../../shared/constants/production");

const Production = sequelize.define("Production", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assigned_manager_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(Object.values(PRODUCTION_STATUS)),
    defaultValue: PRODUCTION_STATUS.PENDING,
    allowNull: false,
  },
  materials_used: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: "List of materials and quantities used in this production run",
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "production",
  underscored: true,
});

Production.associate = (models) => {
  Production.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
  Production.belongsTo(models.User, { foreignKey: "assigned_manager_id", as: "manager" });
};

module.exports = Production;
