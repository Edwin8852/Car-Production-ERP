const router = require("express").Router();

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/users.routes");
const supplierRoutes = require("../modules/suppliers/suppliers.routes");
const materialRoutes = require("../modules/materials/materials.routes");
const purchaseRoutes = require("../modules/purchase/purchase.routes");
const inventoryRoutes = require("../modules/inventory/inventory.routes");
const productionRoutes = require("../modules/production/production.routes");
const orderRoutes = require("../modules/orders/orders.routes");
const customerRoutes = require("../modules/customers/customers.routes");
const manufacturingRoutes = require("../modules/manufacturing/manufacturing.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/materials", materialRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/production-orders", productionRoutes);
router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);
router.use("/manufacturing", manufacturingRoutes);

module.exports = router;
