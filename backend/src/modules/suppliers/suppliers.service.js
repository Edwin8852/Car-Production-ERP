const Supplier = require("./suppliers.model");

const getAllSuppliers = async () => {
  return await Supplier.findAll();
};

const createSupplier = async (data) => {
  return await Supplier.create(data);
};

const getSupplierById = async (id) => {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) throw new Error("Supplier not found");
  return supplier;
};

const updateSupplier = async (id, data) => {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) throw new Error("Supplier not found");
  return await supplier.update(data);
};

const deleteSupplier = async (id) => {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) throw new Error("Supplier not found");
  await supplier.destroy();
  return { message: "Supplier deleted successfully" };
};

module.exports = {
  getAllSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
