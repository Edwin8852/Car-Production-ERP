const db = require("../../config/db");
const { ROLES } = require("../../shared/constants/roles");

const createOrder = async ({ user_id, product_name }) => {
  const query = `
    INSERT INTO orders (user_id, product_name, status)
    VALUES ($1, $2, 'ordered')
    RETURNING *
  `;
  const result = await db.query(query, [user_id, product_name]);
  return result.rows[0];
};

const getAllOrders = async () => {
  const query = `
    SELECT o.*, u.name as user_name, u.phone as user_phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
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

    // If order is in_production, create a production record
    if (status === "in_production" && updatedOrder) {
      const prodResult = await client.query(
        "INSERT INTO production (order_id, status) VALUES ($1, 'in_progress') RETURNING id",
        [updatedOrder.id]
      );
      const productionOrderId = prodResult.rows[0].id;

      // Initialize Manufacturing Stages
      const stages = ["Assembly", "Painting", "Testing"];
      for (const stageName of stages) {
        await client.query(
          "INSERT INTO manufacturing (production_order_id, stage, status) VALUES ($1, $2, 'PENDING')",
          [productionOrderId, stageName]
        );
      }
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

const getTrackingInfo = async (orderId, requestingUser) => {
  const orderQuery = `
    SELECT o.*, u.name as user_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
  `;
  const orderResult = await db.query(orderQuery, [orderId]);
  if (orderResult.rows.length === 0) throw new Error("Order not found");

  const order = orderResult.rows[0];

  // Ownership Check: Normal users can only track their own orders
  if (requestingUser.role === ROLES.USER && parseInt(order.user_id) !== parseInt(requestingUser.id)) {
    throw new Error("Access denied. You can only track your own orders.");
  }

  // Get Production Info
  const prodQuery = "SELECT * FROM production WHERE order_id = $1";
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

const getOrdersByUser = async (userId) => {
  const query = `
    SELECT o.*, u.name as user_name, u.phone as user_phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getTrackingInfo,
  getOrdersByUser,
};
