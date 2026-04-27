const suppliersModel = require("./suppliers.model");

const getAllSuppliers = async () => {
  return await suppliersModel.getAllSuppliers();
};

const createSupplier = async (data) => {
  return await suppliersModel.createSupplier(data);
};

const getSupplierById = async (id) => {
  const supplier = await suppliersModel.getSupplierById(id);
  if (!supplier) throw new Error("Supplier not found");
  return supplier;
};

const updateSupplier = async (id, data) => {
  return await suppliersModel.updateSupplier(id, data);
};

const deleteSupplier = async (id) => {
  return await suppliersModel.deleteSupplier(id);
};

module.exports = {
  getAllSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
