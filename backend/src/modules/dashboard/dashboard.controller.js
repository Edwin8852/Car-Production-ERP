const db = require("../../config/db");

const getStats = async (req, res, next) => {
  try {
    const queries = {
      totalOrders: "SELECT COUNT(*) FROM orders",
      productionVolume: "SELECT COUNT(*) FROM production WHERE status = 'in_progress'",
      lowStock: "SELECT COUNT(*) FROM materials WHERE stock < 10",
      revenue: "SELECT SUM(total_amount) FROM orders WHERE status = 'DELIVERED'",
      recentOrders: `
        SELECT o.*, u.name as user_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC 
        LIMIT 5
      `
    };

    const results = {};
    for (const [key, sql] of Object.entries(queries)) {
      const result = await db.query(sql);
      results[key] = key === 'recentOrders' ? result.rows : result.rows[0].count || result.rows[0].sum || 0;
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
