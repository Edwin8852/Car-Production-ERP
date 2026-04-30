const Delivery = require("./delivery.model");
const Order = require("../orders/orders.model");
const User = require("../users/users.model");
const { DELIVERY_STATUS } = require("../../shared/constants/delivery");

/**
 * GET assigned deliveries for a specific delivery person
 */
const getAssignedDeliveries = async (deliveryPersonId) => {
  return await Delivery.findAll({
    where: { assigned_delivery_id: deliveryPersonId },
    include: [
      { 
        model: Order, 
        as: "order", 
        attributes: ["id", "order_number", "customer_name", "shipping_address", "total_amount"] 
      }
    ],
    order: [["created_at", "DESC"]]
  });
};

/**
 * GET delivery details by ID
 */
const getDeliveryById = async (id, deliveryPersonId = null) => {
  const where = { id };
  if (deliveryPersonId) where.assigned_delivery_id = deliveryPersonId;

  const delivery = await Delivery.findOne({
    where,
    include: [
      { model: Order, as: "order" },
      { model: User, as: "delivery_person", attributes: ["id", "name", "phone", "vehicle_number"] }
    ]
  });

  if (!delivery) throw new Error("Delivery not found or access denied.");
  return delivery;
};

/**
 * UPDATE delivery status with flow validation
 */
const updateDeliveryStatus = async (id, deliveryPersonId, newStatus) => {
  const delivery = await Delivery.findOne({ where: { id, assigned_delivery_id: deliveryPersonId } });
  if (!delivery) throw new Error("Delivery not found or access denied.");

  const currentStatus = delivery.status;

  // Finality check: Once delivered, cannot change status
  if (currentStatus === DELIVERY_STATUS.DELIVERED) {
    throw new Error("Cannot update status for a completed delivery.");
  }

  // Status Flow Validation
  const validTransitions = {
    [DELIVERY_STATUS.ASSIGNED]: [DELIVERY_STATUS.OUT_FOR_DELIVERY],
    [DELIVERY_STATUS.OUT_FOR_DELIVERY]: [DELIVERY_STATUS.DELIVERED],
    [DELIVERY_STATUS.DELIVERED]: [],
  };

  if (!validTransitions[currentStatus].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}.`);
  }

  await delivery.update({ status: newStatus });

  // Business Logic: If status is 'delivered', we need confirmation (usually handled in separate API)
  // But we allow manual status update for flow progress.
  
  return delivery;
};

/**
 * CONFIRM delivery with proof and signature
 */
const confirmDelivery = async (id, deliveryPersonId, data) => {
  const { proof_image, customer_signature } = data;
  
  const delivery = await Delivery.findOne({ where: { id, assigned_delivery_id: deliveryPersonId } });
  if (!delivery) throw new Error("Delivery not found or access denied.");

  if (delivery.status === DELIVERY_STATUS.DELIVERED) {
    throw new Error("Delivery is already confirmed.");
  }

  const now = new Date();

  await delivery.update({
    status: DELIVERY_STATUS.DELIVERED,
    delivery_date: now.toISOString().split('T')[0],
    delivery_time: now.toTimeString().split(' ')[0],
    proof_image: proof_image || null,
    customer_signature: customer_signature || null,
  });

  // Business Logic: Update the main Order status
  await Order.update(
    { status: "DELIVERED" },
    { where: { id: delivery.order_id } }
  );

  return delivery;
};

module.exports = {
  getAssignedDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
  confirmDelivery,
};
