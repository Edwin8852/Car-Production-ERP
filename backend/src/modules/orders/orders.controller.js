const orderService = require("./orders.service");

const createOrder = async (req, res, next) => {
  try {
    // 1. Input Normalization (Accept both camelCase and snake_case)
    const customerId = req.body.customerId || req.body.customer_id;
    const productName = req.body.productName || req.body.product_name;

    // 2. Strict Validation
    if (!customerId || !productName) {
      return res.status(400).json({ 
        message: "All fields (customerId and productName) are required" 
      });
    }

    // 3. Map to Service (Database uses snake_case)
    const order = await orderService.createOrder({ 
      customer_id: customerId, 
      product_name: productName 
    });

    res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(id, status);
    res.status(200).json({ data: order });
  } catch (error) {
    next(error);
  }
};

const getTrackingInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trackingData = await orderService.getTrackingInfo(id);
    res.status(200).json({
      success: true,
      data: trackingData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateStatus,
  getTrackingInfo,
};
