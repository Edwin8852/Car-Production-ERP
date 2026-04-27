const inventoryService = require("./inventory.service");

const getAllMaterials = async (req, res, next) => {
  try {
    const materials = await inventoryService.getAllMaterials();
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    next(error);
  }
};

const createMaterial = async (req, res, next) => {
  try {
    const material = await inventoryService.createMaterial(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

const getInventory = async (req, res, next) => {
  try {
    const inventory = await inventoryService.getInventory();
    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { material_id, quantity } = req.body;
    const result = await inventoryService.updateStock(material_id, quantity);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMaterials,
  createMaterial,
  getInventory,
  updateStock,
};
