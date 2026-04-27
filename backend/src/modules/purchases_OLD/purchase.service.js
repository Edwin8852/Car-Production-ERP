const db = require("../../config/db");
const purchaseModel = require("./purchase.model");
const inventoryService = require("../inventory/inventory.service");

const createPurchaseOrder = async ({ supplier_id, items }) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Create Purchase
    const purchase = await purchaseModel.createPurchase(client, supplier_id);
    
    // 2. Add Items and calculate total
    let total = 0;
    for (const item of items) {
      await purchaseModel.addPurchaseItem(client, purchase.id, item);
      total += (item.quantity * item.price);
    }
    
    // 3. Update total
    await purchaseModel.updateTotal(client, purchase.id, total);
    
    await client.query('COMMIT');
    return { ...purchase, total_amount: total, items };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getAllPurchases = async () => {
  return await purchaseModel.getAll();
};

const updateStatus = async (id, status) => {
  const result = await purchaseModel.updateStatus(id, status);

  // If RECEIVED, update inventory
  if (status === 'RECEIVED') {
    const items = await purchaseModel.getItemsByPurchaseId(id);
    for (const item of items) {
      await inventoryService.increaseStock(item.material_id, item.quantity);
    }
  }

  return result;
};

module.exports = {
  createPurchaseOrder,
  getAllPurchases,
  updateStatus
};
