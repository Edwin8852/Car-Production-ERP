const db = require("../../config/db");

const createPurchase = async (purchaseData) => {
  const { supplier_id, material_id, quantity, price, status } = purchaseData;
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Validate supplier exists
    const supplierCheck = await client.query("SELECT id FROM suppliers WHERE id = $1", [supplier_id]);
    if (supplierCheck.rows.length === 0) {
      throw new Error("Supplier not found");
    }

    // 2. Validate material exists
    const materialCheck = await client.query("SELECT id FROM materials WHERE id = $1", [material_id]);
    if (materialCheck.rows.length === 0) {
      throw new Error("Material not found");
    }

    // 3. Insert Purchase
    const totalAmount = quantity * price;
    const finalStatus = status || 'ORDERED';
    
    const insertQuery = `
      INSERT INTO purchases (supplier_id, material_id, quantity, price, total_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const purchaseResult = await client.query(insertQuery, [supplier_id, material_id, quantity, price, totalAmount, finalStatus]);

    // 4. Update Stock only if received
    if (finalStatus === 'RECEIVED') {
      const updateStockQuery = `
        UPDATE materials 
        SET stock = stock + $1 
        WHERE id = $2
      `;
      await client.query(updateStockQuery, [quantity, material_id]);
    }

    await client.query("COMMIT");
    return purchaseResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getAllPurchases = async () => {
  const query = `
    SELECT p.*, s.name as supplier_name, m.name as material_name
    FROM purchases p
    JOIN suppliers s ON p.supplier_id = s.id
    JOIN materials m ON p.material_id = m.id
    ORDER BY p.created_at DESC
  `;
  const result = await db.query(query);
  return result.rows;
};

const getPurchaseById = async (id) => {
  const query = `
    SELECT p.*, s.name as supplier_name, m.name as material_name
    FROM purchases p
    JOIN suppliers s ON p.supplier_id = s.id
    JOIN materials m ON p.material_id = m.id
    WHERE p.id = $1
  `;
  const result = await db.query(query, [id]);
  if (result.rows.length === 0) {
    throw new Error("Purchase not found");
  }
  return result.rows[0];
};

const updatePurchaseStatus = async (id, status) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // Get current purchase
    const getQuery = "SELECT * FROM purchases WHERE id = $1 FOR UPDATE";
    const getResult = await client.query(getQuery, [id]);
    if (getResult.rows.length === 0) {
      throw new Error("Purchase not found");
    }
    const purchase = getResult.rows[0];

    // If it's already received, don't double count
    if (purchase.status === 'RECEIVED') {
      throw new Error("Purchase is already received");
    }

    // Update status
    const updateQuery = `
      UPDATE purchases 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await client.query(updateQuery, [status, id]);
    const updatedPurchase = result.rows[0];

    // Update stock if received
    if (status === 'RECEIVED') {
      const updateStockQuery = `
        UPDATE materials 
        SET stock = stock + $1 
        WHERE id = $2
      `;
      await client.query(updateStockQuery, [purchase.quantity, purchase.material_id]);
    }

    await client.query("COMMIT");
    return updatedPurchase;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const createBulkPurchases = async (supplierId, items) => {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Validate supplier exists once
    const supplierCheck = await client.query("SELECT id FROM suppliers WHERE id = $1", [supplierId]);
    if (supplierCheck.rows.length === 0) {
      throw new Error("Supplier not found");
    }

    const createdPurchases = [];

    // 2. Loop through items and insert
    for (const item of items) {
      const { materialId, quantity, price, status } = item;

      // Validate material exists
      const materialCheck = await client.query("SELECT id FROM materials WHERE id = $1", [materialId]);
      if (materialCheck.rows.length === 0) {
        throw new Error(`Material with ID ${materialId} not found`);
      }

      const totalAmount = quantity * price;
      const finalStatus = status || 'ORDERED';

      // Insert Purchase record
      const query = `
        INSERT INTO purchases (supplier_id, material_id, quantity, price, total_amount, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const result = await client.query(query, [supplierId, materialId, quantity, price, totalAmount, finalStatus]);
      createdPurchases.push(result.rows[0]);

      // Update Stock only if received
      if (finalStatus === 'RECEIVED') {
        const updateStockQuery = `
          UPDATE materials 
          SET stock = stock + $1 
          WHERE id = $2
        `;
        await client.query(updateStockQuery, [quantity, materialId]);
      }
    }

    await client.query("COMMIT");
    return createdPurchases;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createPurchase,
  createBulkPurchases,
  getAllPurchases,
  getPurchaseById,
  updatePurchaseStatus,
};

