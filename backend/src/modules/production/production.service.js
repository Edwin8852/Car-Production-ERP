const db = require("../../config/db");

const createProductionOrder = async (orderData) => {
  const { product_name, items } = orderData;
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Create Production Order
    const orderQuery = `
      INSERT INTO production_orders (product_name, status)
      VALUES ($1, 'IN_PROGRESS')
      RETURNING *
    `;
    const orderResult = await client.query(orderQuery, [product_name]);
    const orderId = orderResult.rows[0].id;

    // 2. Process each material item
    for (const item of items) {
      const material_id = item.material_id || item.materialId;
      const { quantity } = item;

      // a. Check current stock (using FOR UPDATE to lock the row during transaction)
      const stockCheckQuery = "SELECT name, stock FROM materials WHERE id = $1 FOR UPDATE";
      const stockResult = await client.query(stockCheckQuery, [material_id]);
      
      if (stockResult.rows.length === 0 || material_id == null) {
        throw new Error(`Material with ID ${material_id} not found`);
      }

      const material = stockResult.rows[0];
      
      // b. Prevent stock from going negative
      if (Number(material.stock) < Number(quantity)) {
        throw new Error(`Insufficient stock for material: ${material.name}. Required: ${quantity}, Available: ${material.stock}`);
      }

      // c. Deduct stock
      const deductStockQuery = "UPDATE materials SET stock = stock - $1 WHERE id = $2";
      await client.query(deductStockQuery, [quantity, material_id]);

      // d. Record production item
      const itemQuery = `
        INSERT INTO production_items (production_id, material_id, quantity)
        VALUES ($1, $2, $3)
      `;
      await client.query(itemQuery, [orderId, material_id, quantity]);
    }

    await client.query("COMMIT");
    return orderResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getAllProductionOrders = async () => {
  const query = `
    SELECT po.*, 
    (SELECT json_agg(pi) FROM (
      SELECT pi.*, m.name as material_name 
      FROM production_items pi 
      JOIN materials m ON pi.material_id = m.id 
      WHERE pi.production_id = po.id
    ) pi) as items
    FROM production_orders po 
    ORDER BY po.created_at DESC
  `;
  const result = await db.query(query);
  return result.rows;
};

module.exports = {
  createProductionOrder,
  getAllProductionOrders,
};
