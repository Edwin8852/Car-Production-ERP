const jwt = require("jsonwebtoken");
const { ROLES, STATUS } = require("../constants/roles");

/**
 * AUTHENTICATE — Validates JWT and attaches req.user
 */
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided. Authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Normalize role to lowercase to match our constants
    if (decoded.role) decoded.role = decoded.role.toLowerCase();
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

/**
 * AUTHORIZE — Reusable role gate
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: "Access denied. No role found." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This action requires one of the following roles: [${allowedRoles.join(", ")}]. Your role: ${req.user.role}`,
      });
    }
    next();
  };
};

/**
 * STATUS GUARD — Blocks inactive users
 */
const requireActive = (req, res, next) => {
  if (req.user?.status === STATUS.INACTIVE) {
    return res.status(403).json({
      success: false,
      message: "Your account is inactive. Please contact support.",
    });
  }
  next();
};

// Specialized Guards
const allowSuperAdmin = authorize(ROLES.SUPER_ADMIN);
const allowAdminAccess = authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN);
const allowManager = authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER);
const allowDelivery = authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DELIVERY);
const allowUser = authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER);

module.exports = {
  authenticate,
  authorize,
  requireActive,
  allowSuperAdmin,
  allowAdminAccess,
  allowManager,
  allowDelivery,
  allowUser,
};
