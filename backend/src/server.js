require("dotenv").config();
const app = require("./app");
const { pool } = require("./config/db");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

// Test DB connection and start server
const startServer = async () => {
  try {
    // Test raw pool
    await pool.query("SELECT 1");
    console.log("✅ Database connection verified.");

    // Test Sequelize
    await sequelize.authenticate();
    console.log("✅ Sequelize connection verified.");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();