const purchaseService = require("./purchase.service");

const createPurchase = async (req, res, next) => {
  try {
    const purchase = await purchaseService.createPurchaseOrder(req.body);
    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    next(error);
  }
};

const getAllPurchases = async (req, res, next) => {
  try {
    const purchases = await purchaseService.getAllPurchases();
    res.status(200).json({ success: true, data: purchases });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const purchase = await purchaseService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPurchase,
  getAllPurchases,
  updateStatus
};
