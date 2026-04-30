const usersService = require("./users.service");

// GET /api/users?role=MANAGER&status=ACTIVE
const getAllUsers = async (req, res, next) => {
  try {
    const filters = {
      role:   req.query.role,
      status: req.query.status,
    };
    const users = await usersService.getAllUsers(filters);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await usersService.updateUser(req.user.id, req.body, req.user.role);
    res.status(200).json({ success: true, message: "Profile updated successfully.", data: user });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// POST /api/users  — Admin creates Manager/Delivery/User; Super Admin creates Admin
const createUser = async (req, res, next) => {
  try {
    const user = await usersService.createUser(req.body, req.user.role);
    res.status(201).json({ success: true, message: "User created successfully.", data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const user = await usersService.updateUser(req.params.id, req.body, req.user.role);
    res.status(200).json({ success: true, message: "User updated successfully.", data: user });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/users/:id/status  — Toggle ACTIVE / INACTIVE
const toggleUserStatus = async (req, res, next) => {
  try {
    const result = await usersService.toggleUserStatus(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: `User is now ${result.status}.`, data: result });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id  — Super Admin only (enforced in routes)
const deleteUser = async (req, res, next) => {
  try {
    const result = await usersService.deleteUser(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/roles
const getRoles = async (req, res, next) => {
  try {
    const roles = await usersService.getRoles();
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getProfile,
  updateProfile,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getRoles,
};
