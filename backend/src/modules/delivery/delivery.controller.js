const deliveryService = require("./delivery.service");

const createDelivery = async (req, res, next) => {
  try {
    const { orderId, order_id, deliveryDate, delivery_date, delivery_partner, status } = req.body || {};
    
    // Accept either camelCase or snake_case
    const finalOrderId = orderId || order_id;
    const finalDate = deliveryDate || delivery_date;

    if (!finalOrderId) {
      return res.status(400).json({ message: "orderId or order_id is required" });
    }

    const delivery = await deliveryService.createDelivery({ 
      order_id: finalOrderId, 
      delivery_date: finalDate,
      delivery_person: delivery_partner, // Rename to match service
      status: status
    });

    res.status(201).json({
      message: "Delivery record created successfully",
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDeliveries = async (req, res, next) => {
  try {
    const deliveries = await deliveryService.getAllDeliveries();
    res.status(200).json({ data: deliveries });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contentType = req.get("Content-Type");
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        message: "Request body is empty.",
        received_content_type: contentType || "none",
        instruction: "Ensure Postman Body is set to 'raw' and format is 'JSON'."
      });
    }

    const { status, delivery_status } = req.body;
    const finalStatus = status || delivery_status;

    if (!finalStatus) {
      return res.status(400).json({ message: "status or delivery_status field is required in the JSON body." });
    }

    const delivery = await deliveryService.updateDeliveryStatus(id, finalStatus);
    res.status(200).json({ data: delivery });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDelivery,
  getAllDeliveries,
  updateStatus,
};
