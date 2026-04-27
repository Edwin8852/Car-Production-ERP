const materialsModel = require("./materials.model");

const getAllMaterials = async () => {
  return await materialsModel.getAllMaterials();
};

const createMaterial = async (data) => {
  // Business logic: check if material with same name exists if needed
  return await materialsModel.createMaterial(data);
};

const getMaterialById = async (id) => {
  const material = await materialsModel.getMaterialById(id);
  if (!material) throw new Error("Material not found");
  return material;
};

const updateMaterial = async (id, data) => {
  return await materialsModel.updateMaterial(id, data);
};

const deleteMaterial = async (id) => {
  return await materialsModel.deleteMaterial(id);
};

module.exports = {
  getAllMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};
