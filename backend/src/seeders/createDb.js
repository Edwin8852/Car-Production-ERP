const { Client } = require("pg");
require("dotenv").config();

const createDatabase = async () => {
  // Connect to the default 'postgres' database to create the new database
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: "postgres", // Connect to default database
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL as", process.env.DB_USER);

    // Check if database exists
    const checkDbRes = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME]
    );

    if (checkDbRes.rowCount === 0) {
      console.log(`⏳ Creating database: ${process.env.DB_NAME}...`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Database ${process.env.DB_NAME} created successfully.`);
    } else {
      console.log(`ℹ️ Database ${process.env.DB_NAME} already exists.`);
    }
  } catch (error) {
    if (error.code === "42P04") {
      console.log(`ℹ️ Database ${process.env.DB_NAME} already exists.`);
    } else {
      console.error("❌ Error creating database:", error.message);
      console.log("\nTIP: Make sure the password in your .env file is correct for the 'postgres' user.");
    }
  } finally {
    await client.end();
  }
};

createDatabase();
