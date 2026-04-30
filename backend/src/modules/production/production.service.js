const Production = require("./production.model");
const User = require("../users/users.model");
const Order = require("../orders/orders.model");
const { PRODUCTION_STATUS } = require("../../shared/constants/production");
const { Op } = require("sequelize");

/**
 * GET assigned productions for a specific manager
 */
const getAssignedProductions = async (managerId) => {
  return await Production.findAll({
    where: { assigned_manager_id: managerId },
    include: [
      { model: Order, as: "order", attributes: ["id", "order_number", "customer_name"] }
    ],
    order: [["created_at", "DESC"]]
  });
};

/**
 * GET production details by ID
 */
const getProductionById = async (id, managerId = null) => {
  const where = { id };
  if (managerId) where.assigned_manager_id = managerId;

  const production = await Production.findOne({
    where,
    include: [
      { model: Order, as: "order" },
      { model: User, as: "manager", attributes: ["id", "name", "email"] }
    ]
  });

  if (!production) throw new Error("Production order not found or access denied.");
  return production;
};

/**
 * UPDATE production status with flow validation
 */
const updateProductionStatus = async (id, managerId, newStatus) => {
  const production = await Production.findOne({ where: { id, assigned_manager_id: managerId } });
  if (!production) throw new Error("Production order not found or access denied.");

  const currentStatus = production.status;

  // Status Flow Validation
  const validTransitions = {
    [PRODUCTION_STATUS.PENDING]: [PRODUCTION_STATUS.IN_PROGRESS],
    [PRODUCTION_STATUS.IN_PROGRESS]: [PRODUCTION_STATUS.COMPLETED],
    [PRODUCTION_STATUS.COMPLETED]: [], // No transitions from completed
  };

  if (!validTransitions[currentStatus].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}.`);
  }

  // Update timestamps based on status
  const updates = { status: newStatus };
  if (newStatus === PRODUCTION_STATUS.IN_PROGRESS) updates.start_date = new Date();
  if (newStatus === PRODUCTION_STATUS.COMPLETED) updates.end_date = new Date();

  await production.update(updates);

  // Business Logic: Notify admin on completion
  if (newStatus === PRODUCTION_STATUS.COMPLETED) {
    console.log(`[NOTIFICATION] Production Order #${id} completed. Notifying Admins...`);
    // Placeholder for actual notification logic (email/socket/db)
  }

  return production;
};

/**
 * UPDATE material usage
 */
const updateMaterialUsage = async (id, managerId, materials) => {
  const production = await Production.findOne({ where: { id, assigned_manager_id: managerId } });
  if (!production) throw new Error("Production order not found or access denied.");

  if (production.status === PRODUCTION_STATUS.COMPLETED) {
    throw new Error("Cannot update material usage for a completed production.");
  }

  // Expecting materials to be an array of objects: [{ material_id, quantity }]
  await production.update({ materials_used: materials });

  return production;
};

module.exports = {
  getAssignedProductions,
  getProductionById,
  updateProductionStatus,
  updateMaterialUsage,
};
