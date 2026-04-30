/**
 * auth.model.js — Legacy shim (kept for any older code that may import it)
 * The auth.service.js now uses the Sequelize User model directly.
 * This file can be safely removed once all imports are updated.
 */
const User = require("../users/users.model");

const findByEmail = async (email) => {
  return await User.scope("withPassword").findOne({ where: { email } });
};

module.exports = { findByEmail };
