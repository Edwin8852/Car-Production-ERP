const db = require("../../config/db");

const create = async ({ material_id, quantity, min_stock_level }) => {
  const query = `
    INSERT INTO inventory (material_id, quantity, min_stock_level) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
  const result = await db.query(query, [material_id, quantity, min_stock_level]);
  return result.rows[0];
};

const getAll = async () => {
  const query = `
    SELECT i.*, m.name as material_name, m.unit 
    FROM inventory i 
    JOIN materials m ON i.material_id = m.id
    ORDER BY m.name ASC
  `;
  const result = await db.query(query);
  return result.rows;
};

const getById = async (id) => {
  const query = `
    SELECT i.*, m.name as material_name, m.unit 
    FROM inventory i 
    JOIN materials m ON i.material_id = m.id 
    WHERE i.id = $1
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const update = async (id, { quantity, min_stock_level }) => {
  const query = `
    UPDATE inventory 
    SET quantity = COALESCE($1, quantity), 
        min_stock_level = COALESCE($2, min_stock_level),
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = $3 
    RETURNING *
  `;
  const result = await db.query(query, [quantity, min_stock_level, id]);
  return result.rows[0];
};

const remove = async (id) => {
  const query = "DELETE FROM inventory WHERE id = $1";
  await db.query(query, [id]);
  return { success: true };
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: remove,
};
