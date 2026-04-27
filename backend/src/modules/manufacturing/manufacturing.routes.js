const express = require("express");
const router = express.Router();
const manufacturingController = require("./manufacturing.controller");

// Route to create a new manufacturing stage
router.post("/", manufacturingController.createStage);

// Route to update a manufacturing stage status
router.patch("/:id/status", manufacturingController.updateStageStatus);

// Route to get all stages for a specific production order
router.get("/order/:orderId", manufacturingController.getStagesByOrder);

module.exports = router;
