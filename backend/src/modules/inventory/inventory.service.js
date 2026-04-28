const inventoryModel = require("./inventory.model");

const getAllMaterials = async () => {
  return await inventoryModel.getAll();
};

const createMaterial = async (data) => {
  return await inventoryModel.create(data);
};

const getInventory = async () => {
  return await inventoryModel.getAll();
};

const updateStock = async (material_id, quantity) => {
  // Assuming updateStock was meant to update quantity
  // We'll use the update method from model
  return await inventoryModel.update(material_id, { quantity });
};

module.exports = {
  getAllMaterials,
  createMaterial,
  getInventory,
  updateStock,
};
