const express = require("express");
const router = express.Router();
const customerController = require("./customers.controller");
const { authenticate, authorize } = require("../../shared/middleware/auth.middleware");

// All customer routes protected
router.use(authenticate);

router.post("/", authorize("SUPER_ADMIN", "ADMIN", "MANAGER"), customerController.createCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);

module.exports = router;
