const usersModel = require("./users.model");

const getAllUsers = async () => {
  return await usersModel.getAllUsers();
};

const createUser = async (data) => {
  const { name, email, password, role_id } = data;
  return await usersModel.createUser(name, email, password, role_id);
};


const getUserById = async (id) => {
  const user = await usersModel.getUserById(id);
  if (!user) throw new Error("User not found");
  return user;
};

const updateUser = async (id, data) => {
  return await usersModel.updateUser(id, data);
};

const deleteUser = async (id) => {
  return await usersModel.deleteUser(id);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
