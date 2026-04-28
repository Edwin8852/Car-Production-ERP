const User = require("./users.model");
const Role = require("./role.model");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  return await User.findAll({
    include: [{ model: Role }]
  });
};

const getRoles = async () => {
  return await Role.findAll();
};

const createUser = async (data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await User.create(data);
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: [{ model: Role }]
  });
  if (!user) throw new Error("User not found");
  return user;
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return await user.update(data);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  await user.destroy();
  return { message: "User deleted successfully" };
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getRoles,
};
