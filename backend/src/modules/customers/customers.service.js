const db = require("../../config/db");

const createCustomer = async ({ name, phone, email, address }) => {
  const query = `
    INSERT INTO customers (name, phone, email, address)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await db.query(query, [name, phone, email, address]);
  return result.rows[0];
};

const getAllCustomers = async () => {
  const query = "SELECT * FROM customers ORDER BY name ASC";
  const result = await db.query(query);
  return result.rows;
};

const getCustomerById = async (id) => {
  const query = "SELECT * FROM customers WHERE id = $1";
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
};
