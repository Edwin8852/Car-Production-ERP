const router = require("express").Router();
const usersController = require("./users.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

// All user routes are protected and restricted to SUPER_ADMIN/ADMIN
router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN"));

router.get("/", usersController.getAllUsers);
router.post("/", usersController.createUser);
router.get("/:id", usersController.getUserById);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);


module.exports = router;
