const manufacturingModel = require("./manufacturing.model");
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

  return await manufacturingModel.create(data);
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
    const allStages = await manufacturingModel.getByOrderId(orderId);
    
    const allCompleted = allStages.length > 0 && allStages.every(stage => stage.status === "COMPLETED");

    if (allCompleted) {
      // 3. Update production_orders status
      await client.query(
        "UPDATE production_orders SET status = 'COMPLETED' WHERE id = $1",
        [orderId]
      );

      // 4. Update related production table (if linked - here we assume car_model match or just update general production status)
      // Since there's no direct FK between production and production_orders in the schema provided, 
      // we'll search for a production record with a similar car_model if possible, 
      // but for now let's focus on the order status as requested.
      // If the user meant the 'production' table as well:
      const orderInfo = await client.query("SELECT product_name FROM production_orders WHERE id = $1", [orderId]);
      if (orderInfo.rows.length > 0) {
          const productName = orderInfo.rows[0].product_name;
          await client.query(
              "UPDATE production SET status = 'COMPLETED' WHERE car_model = $1 AND status = 'IN_PROGRESS'",
              [productName]
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
  return await manufacturingModel.getByOrderId(orderId);
};

module.exports = {
  createStage,
  updateStageStatus,
  getStagesByOrder,
};
