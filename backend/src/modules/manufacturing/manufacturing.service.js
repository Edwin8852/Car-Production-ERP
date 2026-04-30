const Manufacturing = require("./manufacturing.model");
const db = require("../../config/db");

const createStage = async (data) => {
  const { production_order_id, stage, status } = data;

  // Basic validation
  if (!production_order_id || !stage) {
    const error = new Error("production_order_id and stage are required");
    error.statusCode = 400;
    throw error;
  }

  // Validate stage name (optional but recommended)
  const validStages = ["Assembly", "Painting", "Testing"];
  if (!validStages.includes(stage)) {
    const error = new Error(`Invalid stage name. Must be one of: ${validStages.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  return await Manufacturing.create(data);
};

const updateStageStatus = async (id, status) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Update the stage status
    const result = await client.query(
      "UPDATE manufacturing SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, id]
    );
    
    if (result.rows.length === 0) {
      const error = new Error("Manufacturing stage not found");
      error.statusCode = 404;
      throw error;
    }

    const updatedStage = result.rows[0];

    // 2. Check if all stages for this production order are COMPLETED
    const orderId = updatedStage.production_order_id;
    const allStages = await Manufacturing.findAll({
      where: { production_order_id: orderId }
    });
    
    const allCompleted = allStages.length > 0 && allStages.every(stage => stage.status === "COMPLETED");

    if (allCompleted) {
        // 3. Get the customer order ID from production
        const prodOrderInfo = await client.query("SELECT order_id FROM production WHERE id = $1", [orderId]);
        
        if (prodOrderInfo.rows.length > 0) {
          const customerOrderId = prodOrderInfo.rows[0].order_id;

          // 4. Update production status
          await client.query("UPDATE production SET status = 'completed', end_date = CURRENT_TIMESTAMP WHERE id = $1", [orderId]);

        // 5. Create a Delivery record automatically
        await client.query(
          "INSERT INTO deliveries (order_id, delivery_status, delivery_date) VALUES ($1, 'READY', CURRENT_TIMESTAMP)",
          [customerOrderId]
        );

        // 6. Update the original customer order status to READY_FOR_DELIVERY
        await client.query(
          "UPDATE orders SET status = 'READY_FOR_DELIVERY' WHERE id = $1",
          [customerOrderId]
        );
      }
    }

    await client.query("COMMIT");
    return updatedStage;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getStagesByOrder = async (orderId) => {
  return await Manufacturing.findAll({
    where: { production_order_id: orderId }
  });
};

module.exports = {
  createStage,
  updateStageStatus,
  getStagesByOrder,
};
