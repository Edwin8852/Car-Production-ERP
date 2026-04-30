const productionService = require("./production.service");

/**
 * GET /production/assigned
 */
const getAssignedProductions = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const productions = await productionService.getAssignedProductions(managerId);
    res.status(200).json({ success: true, data: productions });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /production/:id
 */
const getProductionById = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const production = await productionService.getProductionById(req.params.id, managerId);
    res.status(200).json({ success: true, data: production });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /production/:id/status
 */
const updateProductionStatus = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const { status } = req.body;
    const production = await productionService.updateProductionStatus(req.params.id, managerId, status);
    res.status(200).json({ success: true, message: "Status updated successfully", data: production });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /production/:id/materials
 */
const updateMaterialUsage = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const { materials } = req.body;
    const production = await productionService.updateMaterialUsage(req.params.id, managerId, materials);
    res.status(200).json({ success: true, message: "Material usage updated", data: production });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignedProductions,
  getProductionById,
  updateProductionStatus,
  updateMaterialUsage,
};
