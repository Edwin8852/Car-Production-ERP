const db = require("../../config/db");

const findByEmail = async (email) => {
  const query = `
    SELECT u.*, r.name as role 
    FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.email = $1
  `;
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const createUser = async (name, email, hashedPassword, roleName = "CUSTOMER") => {
  const roleQuery = "SELECT id FROM roles WHERE name = $1";
  const roleResult = await db.query(roleQuery, [roleName]);
  const roleId = roleResult.rows[0]?.id;

  if (!roleId) throw new Error("Invalid role");

  const query = `
    INSERT INTO users (name, email, password, role_id) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, name, email, role_id
  `;
  const result = await db.query(query, [name, email, hashedPassword, roleId]);
  return result.rows[0];
};

module.exports = {
  findByEmail,
  createUser,
};
