const purchaseService = require("./purchase.service");

const createPurchase = async (req, res, next) => {
  try {
    const { supplierId, items } = req.body;

    // Support for bulk purchase (items array structure)
    if (Array.isArray(items) && items.length > 0) {
      // 1. Check supplierId for bulk
      if (supplierId == null) {
        return res.status(400).json({ message: "supplierId is required" });
      }

      // 2. Validate each item fields properly using safe checks (== null)
      for (const item of items) {
        if (item.materialId == null || item.quantity == null || item.price == null) {
          return res.status(400).json({ 
            message: "All fields (materialId, quantity, price) are required for each item" 
          });
        }
        if (item.quantity <= 0 || item.price <= 0) {
          return res.status(400).json({ 
            message: "Quantity and price must be greater than 0 for all items" 
          });
        }
      }

      const purchases = await purchaseService.createBulkPurchases(supplierId, items);
      return res.status(201).json({
        message: "Purchases created successfully from items array",
        count: purchases.length,
        data: purchases,
      });
    }

    // Support for single purchase (flat structure)
    const supplier_id = req.body.supplier_id || req.body.supplierId;
    const material_id = req.body.material_id || req.body.materialId;
    const { quantity, price } = req.body;

    // 1. Check for missing fields (strict null/undefined check)
    if (
      supplier_id == null || 
      material_id == null || 
      quantity == null || 
      price == null
    ) {
      return res.status(400).json({ 
        message: "All fields (supplierId, materialId, quantity, price) or an 'items' array are required" 
      });
    }

    // 2. Check for values > 0
    if (quantity <= 0 || price <= 0) {
      return res.status(400).json({ 
        message: "Quantity and price must be greater than 0" 
      });
    }

    const purchase = await purchaseService.createPurchase({ supplier_id, material_id, quantity, price });
    res.status(201).json({
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPurchases = async (req, res, next) => {
  try {
    const purchases = await purchaseService.getAllPurchases();
    res.status(200).json({
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};

const getPurchaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const purchase = await purchaseService.getPurchaseById(id);
    res.status(200).json({
      data: purchase,
    });
  } catch (error) {
    next(error);
  }
};

const updatePurchaseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }
    const purchase = await purchaseService.updatePurchaseStatus(id, status);
    res.status(200).json({
      message: "Purchase status updated",
      data: purchase,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchaseStatus,
};

