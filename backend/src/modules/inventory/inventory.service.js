const inventoryModel = require("./inventory.model");

const getAllMaterials = async () => {
  return await inventoryModel.getAllMaterials();
};

const createMaterial = async (data) => {
  return await inventoryModel.createMaterial(data);
};

const getInventory = async () => {
  return await inventoryModel.getInventory();
};

const updateStock = async (material_id, quantity) => {
  return await inventoryModel.updateStock(material_id, quantity);
};

module.exports = {
  getAllMaterials,
  createMaterial,
  getInventory,
  updateStock,
};
