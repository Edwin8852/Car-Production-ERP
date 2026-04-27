const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("./auth.model");

const register = async (userData) => {
  const { name, email, password, role } = userData;
  
  const existingUser = await authModel.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await authModel.createUser(name, email, hashedPassword, role);
  
  return user;
};

const login = async (email, password) => {
  const user = await authModel.findByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

module.exports = {
  register,
  login,
};
