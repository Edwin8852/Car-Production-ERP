const db = require("../../config/db");

const createPurchase = async (client, supplier_id) => {
  const query = "INSERT INTO purchases (supplier_id) VALUES ($1) RETURNING *";
  const result = await client.query(query, [supplier_id]);
  return result.rows[0];
};

const addPurchaseItem = async (client, purchase_id, { material_id, quantity, price }) => {
  const query = `
    INSERT INTO purchase_items (purchase_id, material_id, quantity, price) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  const result = await client.query(query, [purchase_id, material_id, quantity, price]);
  return result.rows[0];
};

const updateTotal = async (client, id, total) => {
  const query = "UPDATE purchases SET total_amount = $1 WHERE id = $2";
  await client.query(query, [total, id]);
};

const getById = async (id) => {
  const query = "SELECT * FROM purchases WHERE id = $1";
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const getAll = async () => {
  const query = `
    SELECT p.*, s.name as supplier_name 
    FROM purchases p 
    JOIN suppliers s ON p.supplier_id = s.id 
    ORDER BY p.created_at DESC
  `;
  const result = await db.query(query);
  return result.rows;
};

const getItemsByPurchaseId = async (purchase_id) => {
  const query = "SELECT * FROM purchase_items WHERE purchase_id = $1";
  const result = await db.query(query, [purchase_id]);
  return result.rows;
};

const updateStatus = async (id, status) => {
  const query = "UPDATE purchases SET status = $1 WHERE id = $2 RETURNING *";
  const result = await db.query(query, [status, id]);
  return result.rows[0];
};

module.exports = {
  createPurchase,
  addPurchaseItem,
  updateTotal,
  getById,
  getAll,
  getItemsByPurchaseId,
  updateStatus
};
