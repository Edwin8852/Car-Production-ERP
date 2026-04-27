const { DataTypes } = require("sequelize");

const customerSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.TEXT,
  },
};

module.exports = customerSchema;
