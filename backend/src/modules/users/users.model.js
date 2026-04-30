const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { ROLES, STATUS } = require("../../shared/constants/roles");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name cannot be empty" },
      len: { args: [2, 100], msg: "Name must be between 2 and 100 characters" },
    },
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: { msg: "Must be a valid email address" },
      notEmpty: { msg: "Email cannot be empty" },
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "",
    validate: {
      is: { args: /^[0-9+\-\s()]{7,20}$/, msg: "Invalid phone number format" },
    },
  },
  role: {
    type: DataTypes.ENUM(Object.values(ROLES)),
    allowNull: false,
    defaultValue: ROLES.USER,
  },
  status: {
    type: DataTypes.ENUM(Object.values(STATUS)),
    allowNull: false,
    defaultValue: STATUS.ACTIVE,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: "production",
  },
  vehicle_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // Legacy FK kept for backward compatibility with old Roles table
  },
}, {
  tableName: "users",
  underscored: true,
  defaultScope: {
    attributes: { exclude: ["password"] },
  },
  scopes: {
    withPassword: { attributes: {} }, // use User.scope("withPassword") to include password
  },
});

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: "role_id", as: "roleInfo" });
  User.hasMany(models.Delivery, { foreignKey: "delivery_person_id" });
};

module.exports = User;
