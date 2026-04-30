const Supplier = require("./suppliers.model");
const { Op } = require("sequelize");

const createSupplier = async (data) => {
  const { name, phone } = data;

  // Check for duplicates
  const existing = await Supplier.findOne({
    where: {
      [Op.or]: [{ name }, { phone }]
    }
  });

  if (existing) {
    throw new Error("Supplier with this name or phone already exists.");
  }

  return await Supplier.create(data);
};

const getAllSuppliers = async (filters = {}) => {
  const where = {};
  if (filters.status) where.status = filters.status;
  
  return await Supplier.findAll({
    where,
    order: [["name", "ASC"]]
  });
};

const getSupplierById = async (id) => {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) throw new Error("Supplier not found.");
  return supplier;
};

const updateSupplier = async (id, data) => {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) throw new Error("Supplier not found.");

  // If name or phone is changing, check for duplicates
  if (data.name || data.phone) {
    const existing = await Supplier.findOne({
      where: {
        id: { [Op.ne]: id },
        [Op.or]: [
          data.name ? { name: data.name } : null,
          data.phone ? { phone: data.phone } : null
        ].filter(Boolean)
      }
    });
    if (existing) throw new Error("Another supplier with this name or phone already exists.");
  }

  return await supplier.update(data);
};

const deleteSupplier = async (id) => {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) throw new Error("Supplier not found.");

  // Soft delete logic
  return await supplier.update({ status: "inactive" });
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
};
