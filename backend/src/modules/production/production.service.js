const db = require("../../config/db");
const Manufacturing = require("../manufacturing/manufacturing.model");

const createProductionOrder = async (orderData) => {
  const { product_name, order_id, items = [] } = orderData;
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Create Production Order
    const orderQuery = `
      INSERT INTO production_orders (order_id, product_name, status)
      VALUES ($1, $2, 'IN_PROGRESS')
      RETURNING *
    `;
    const orderResult = await client.query(orderQuery, [order_id, product_name]);
    const productionOrderId = orderResult.rows[0].id;

    // 2. Process each material item (if any)
    for (const item of items) {
      const material_id = item.material_id || item.materialId;
      const { quantity } = item;

      // a. Check current stock
      const stockCheckQuery = "SELECT name, stock FROM materials WHERE id = $1 FOR UPDATE";
      const stockResult = await client.query(stockCheckQuery, [material_id]);
      
      if (stockResult.rows.length > 0) {
        const material = stockResult.rows[0];
        if (Number(material.stock) >= Number(quantity)) {
          // b. Deduct stock
          await client.query("UPDATE materials SET stock = stock - $1 WHERE id = $2", [quantity, material_id]);
          // c. Record production item
          await client.query(
            "INSERT INTO production_items (production_id, material_id, quantity) VALUES ($1, $2, $3)",
            [productionOrderId, material_id, quantity]
          );
        }
      }
    }

    // 3. TRIGGER: Initialize Manufacturing Stages
    const stages = ["Assembly", "Painting", "Testing"];
    for (const stageName of stages) {
      // We use Sequelize model here, but since we are in a raw client transaction, 
      // it's better to use raw SQL to stay in the same transaction or use the Sequelize transaction.
      // For simplicity and transaction safety, I'll use raw SQL.
      await client.query(
        "INSERT INTO manufacturing (production_order_id, stage, status) VALUES ($1, $2, 'PENDING')",
        [productionOrderId, stageName]
      );
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
