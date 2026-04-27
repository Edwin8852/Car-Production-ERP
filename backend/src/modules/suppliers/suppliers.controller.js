const suppliersService = require("./suppliers.service");

const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await suppliersService.getAllSuppliers();
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const supplier = await suppliersService.createSupplier(req.body);
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await suppliersService.getSupplierById(req.params.id);
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await suppliersService.updateSupplier(req.params.id, req.body);
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    await suppliersService.deleteSupplier(req.params.id);
    res.status(200).json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
