const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false, // Set to console.log to see SQL queries
    define: {
      timestamps: false, // Disable automatic createdAt/updatedAt
      underscored: true,
    },
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database with Sequelize:", error);
  }
};

module.exports = { sequelize, testConnection };
