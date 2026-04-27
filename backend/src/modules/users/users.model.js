const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    // Foreign key is defined here but linked in init.js
  },
}, {
  tableName: "users",
  underscored: true,
});

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: "role_id" });
  User.hasMany(models.Order, { foreignKey: "customer_id" });
  User.hasMany(models.Delivery, { foreignKey: "delivery_person_id" });
};

module.exports = User;
