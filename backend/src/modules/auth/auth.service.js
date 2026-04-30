const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../users/users.model");
const { ROLES, STATUS } = require("../../shared/constants/roles");

const register = async (userData) => {
  const { name, email, password, phone, address } = userData;

  if (!name || !email || !password || !phone || !address) {
    throw new Error("All fields (name, email, password, phone, address) are required.");
  }

  // Check for duplicate email
  const existing = await User.scope("withPassword").findOne({ where: { email } });
  if (existing) throw new Error("Email is already registered.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    role: ROLES.USER, // Default for public registration
    status: STATUS.ACTIVE,
  });

  // Return without password
  const { password: _, ...safeUser } = user.toJSON();
  return safeUser;
};

const login = async (email, password) => {
  const user = await User.scope("withPassword").findOne({ where: { email } });
  if (!user) throw new Error("Invalid email or password.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password.");

  if (user.status === STATUS.INACTIVE) {
    throw new Error("Your account has been deactivated. Contact your administrator.");
  }

  const token = jwt.sign(
    {
      id:     user.id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    token,
    user: {
      id:         user.id,
      name:       user.name,
      email:      user.email,
      role:       user.role,
      status:     user.status,
      address:    user.address,
    },
  };
};

module.exports = { register, login };
