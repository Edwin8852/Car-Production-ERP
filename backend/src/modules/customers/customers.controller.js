const customerService = require("./customers.service");

const createCustomer = async (req, res, next) => {
  try {
    const { name, phone, email, address } = req.body;
    if (!name) return res.status(400).json({ message: "Customer name is required" });

    const customer = await customerService.createCustomer({ name, phone, email, address });
    res.status(201).json({
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json({ data: customers });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ data: customer });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
};
