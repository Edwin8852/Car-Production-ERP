const productionService = require("./production.service");

const createProductionOrder = async (req, res, next) => {
  try {
    const { productName, items } = req.body;

    // 1. Validation
    if (!productName || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        message: "productName and items array are required" 
      });
    }

    // 2. Call service to handle transaction
    const order = await productionService.createProductionOrder({
      product_name: productName,
      items: items
    });

    res.status(201).json({
      message: "Production order created and stock updated successfully",
      data: order,
    });
  } catch (error) {
    // Handle the "Insufficient stock" error specifically if needed
    if (error.message.includes("Insufficient stock")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const getAllProductionOrders = async (req, res, next) => {
  try {
    const orders = await productionService.getAllProductionOrders();
    res.status(200).json({
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProductionOrder,
  getAllProductionOrders,
};
