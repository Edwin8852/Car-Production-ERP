const materialsService = require("./materials.service");

const getAllMaterials = async (req, res, next) => {
  try {
    const materials = await materialsService.getAllMaterials();
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    next(error);
  }
};

const createMaterial = async (req, res, next) => {
  try {
    const material = await materialsService.createMaterial(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

const getMaterialById = async (req, res, next) => {
  try {
    const material = await materialsService.getMaterialById(req.params.id);
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

const updateMaterial = async (req, res, next) => {
  try {
    const material = await materialsService.updateMaterial(req.params.id, req.body);
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

const deleteMaterial = async (req, res, next) => {
  try {
    await materialsService.deleteMaterial(req.params.id);
    res.status(200).json({ success: true, message: "Material deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};
