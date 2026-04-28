const Material = require("./materials.model");

const getAllMaterials = async () => {
  return await Material.findAll();
};

const createMaterial = async (data) => {
  return await Material.create(data);
};

const getMaterialById = async (id) => {
  const material = await Material.findByPk(id);
  if (!material) throw new Error("Material not found");
  return material;
};

const updateMaterial = async (id, data) => {
  const material = await Material.findByPk(id);
  if (!material) throw new Error("Material not found");
  return await material.update(data);
};

const deleteMaterial = async (id) => {
  const material = await Material.findByPk(id);
  if (!material) throw new Error("Material not found");
  await material.destroy();
  return { message: "Material deleted successfully" };
};

module.exports = {
  getAllMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};
