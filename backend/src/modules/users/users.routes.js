const router = require("express").Router();
const usersController = require("./users.controller");
const { authenticate, authorize } = require("../../shared/authMiddleware");

// All user routes are protected and restricted to SUPER_ADMIN/ADMIN
router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN"));

router.get("/", usersController.getAllUsers);
router.get("/roles", authorize("SUPER_ADMIN", "ADMIN"), usersController.getRoles);
router.post("/", authorize("SUPER_ADMIN", "ADMIN"), usersController.createUser);
router.get("/:id", authorize("SUPER_ADMIN", "ADMIN"), usersController.getUserById);
router.put("/:id", authorize("SUPER_ADMIN", "ADMIN"), usersController.updateUser);
router.delete("/:id", authorize("SUPER_ADMIN", "ADMIN"), usersController.deleteUser);


module.exports = router;
