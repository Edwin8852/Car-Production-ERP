const db = require("../../config/db");

const createOrder = async ({ customer_id, product_name }) => {
  const query = `
    INSERT INTO orders (customer_id, product_name, status)
    VALUES ($1, $2, 'PENDING')
    RETURNING *
  `;
  const result = await db.query(query, [customer_id, product_name]);
  return result.rows[0];
};

const getAllOrders = async () => {
  const query = `
    SELECT o.*, c.name as customer_name, c.phone as customer_phone
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
  `;
  const result = await db.query(query);
  return result.rows;
};

const updateOrderStatus = async (id, status) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    const updatedOrder = result.rows[0];

    // If order is approved (IN_PROGRESS), create a production order
    if (status === "IN_PROGRESS" && updatedOrder) {
      await client.query(
        "INSERT INTO production_orders (order_id, product_name, status) VALUES ($1, $2, 'IN_PROGRESS')",
        [updatedOrder.id, updatedOrder.product_name]
      );
    }

    await client.query("COMMIT");
    return updatedOrder;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getTrackingInfo = async (orderId) => {
  const orderQuery = `
    SELECT o.*, c.name as customer_name
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.id = $1
  `;
  const orderResult = await db.query(orderQuery, [orderId]);
  if (orderResult.rows.length === 0) throw new Error("Order not found");

  const order = orderResult.rows[0];

  // Get Production Info
  const prodQuery = "SELECT * FROM production_orders WHERE order_id = $1";
  const prodResult = await db.query(prodQuery, [orderId]);
  const production = prodResult.rows[0];

  // Get Manufacturing Stages
  let stages = [];
  if (production) {
    const stageQuery = "SELECT * FROM manufacturing WHERE production_order_id = $1 ORDER BY created_at ASC";
    const stageResult = await db.query(stageQuery, [production.id]);
    stages = stageResult.rows;
  }

  // Get Delivery Info
  const delQuery = "SELECT * FROM deliveries WHERE order_id = $1";
  const delResult = await db.query(delQuery, [orderId]);
  const delivery = delResult.rows[0];

  return {
    order,
    production: production || null,
    manufacturing_stages: stages,
    delivery: delivery || null
  };
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getTrackingInfo,
};
