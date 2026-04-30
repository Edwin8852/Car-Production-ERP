const router = require("express").Router();
const systemController = require("./system.controller");
const { authenticate, requireActive, allowSuperAdmin } = require("../../shared/middleware/auth.middleware");

// System config is SUPER_ADMIN only — no exceptions
router.use(authenticate);
router.use(requireActive);
router.use(allowSuperAdmin);

router.get("/stats",     systemController.getSystemStats);
router.get("/settings",  systemController.getAllSettings);
router.put("/settings",  systemController.updateSetting);

module.exports = router;
