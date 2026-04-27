const manufacturingService = require("./manufacturing.service");

const createStage = async (req, res) => {
  try {
    const stage = await manufacturingService.createStage(req.body);
    res.status(201).json({
      success: true,
      message: "Manufacturing stage created successfully",
      data: stage,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error creating manufacturing stage",
    });
  }
};

const updateStageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const stage = await manufacturingService.updateStageStatus(id, status);
    res.status(200).json({
      success: true,
      message: "Manufacturing stage updated successfully",
      data: stage,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error updating manufacturing stage",
    });
  }
};

const getStagesByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const stages = await manufacturingService.getStagesByOrder(orderId);
    res.status(200).json({
      success: true,
      data: stages,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching manufacturing stages",
    });
  }
};

module.exports = {
  createStage,
  updateStageStatus,
  getStagesByOrder,
};
