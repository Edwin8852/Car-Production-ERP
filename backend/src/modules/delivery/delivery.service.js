const db = require("../../config/db");

const createDelivery = async ({ order_id, delivery_date, delivery_person, status }) => {
  const finalStatus = status || 'READY';

  // Determine if delivery_person is a name or an ID
  const isId = !isNaN(delivery_person) && typeof delivery_person !== 'string' && delivery_person !== null;
  
  const query = `
    INSERT INTO deliveries (order_id, delivery_date, delivery_status, delivery_person_id, delivery_person_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await db.query(query, [
    order_id, 
    delivery_date || new Date(), 
    finalStatus, 
    isId ? delivery_person : null,
    isId ? null : (delivery_person || null)
  ]);
  return result.rows[0];
};

const getAllDeliveries = async () => {
  const query = `
    SELECT d.*, o.product_name, c.name as customer_name
    FROM deliveries d
    JOIN orders o ON d.order_id = o.id
    JOIN customers c ON o.customer_id = c.id
    ORDER BY d.created_at DESC
  `;
  const result = await db.query(query);
  return result.rows;
};

const updateDeliveryStatus = async (id, status) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      "UPDATE deliveries SET delivery_status = $1 WHERE id = $2 RETURNING *", 
      [status, id]
    );
    
    if (result.rows.length === 0) {
      throw new Error("Delivery record not found");
    }
    
    const updatedDelivery = result.rows[0];

    // If delivery is complete, mark the original order as DELIVERED
    if (status === "DELIVERED") {
      await client.query(
        "UPDATE orders SET status = 'DELIVERED' WHERE id = $1",
        [updatedDelivery.order_id]
      );
    }

    await client.query("COMMIT");
    return updatedDelivery;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createDelivery,
  getAllDeliveries,
  updateDeliveryStatus,
};
