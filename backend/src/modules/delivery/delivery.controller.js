const deliveryService = require("./delivery.service");

/**
 * GET /delivery/assigned
 */
const getAssignedDeliveries = async (req, res, next) => {
  try {
    const deliveryPersonId = req.user.id;
    const deliveries = await deliveryService.getAssignedDeliveries(deliveryPersonId);
    res.status(200).json({ success: true, data: deliveries });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /delivery/:id
 */
const getDeliveryById = async (req, res, next) => {
  try {
    const deliveryPersonId = req.user.id;
    const delivery = await deliveryService.getDeliveryById(req.params.id, deliveryPersonId);
    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /delivery/:id/status
 */
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const deliveryPersonId = req.user.id;
    const { status } = req.body;
    const delivery = await deliveryService.updateDeliveryStatus(req.params.id, deliveryPersonId, status);
    res.status(200).json({ success: true, message: "Status updated successfully", data: delivery });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /delivery/:id/confirm
 */
const confirmDelivery = async (req, res, next) => {
  try {
    const deliveryPersonId = req.user.id;
    const delivery = await deliveryService.confirmDelivery(req.params.id, deliveryPersonId, req.body);
    res.status(200).json({ success: true, message: "Delivery confirmed and order updated", data: delivery });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignedDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
  confirmDelivery,
};
