import React, { useState, useEffect } from 'react';
import { getPurchases, createPurchase } from '../modules/purchase/purchase.service';
import { getSuppliers } from '../modules/suppliers/suppliers.service';
import { getMaterials } from '../modules/materials/materials.service';
import { Plus, Search, CreditCard, X } from 'lucide-react';

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ supplier_id: '', material_id: '', quantity: 1, price: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pData, sData, mData] = await Promise.all([
        getPurchases(),
        getSuppliers(),
        getMaterials()
      ]);
      setPurchases(pData.data || pData || []);
      setSuppliers(sData.data || sData || []);
      setMaterials(mData.data || mData || []);
    } catch (error) {
      console.error("Failed to fetch purchase data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPurchase(formData);
      setIsModalOpen(false);
      setFormData({ supplier_id: '', material_id: '', quantity: 1, price: 0 });
      fetchData();
    } catch (error) {
      alert("Failed to create purchase order");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Purchase Orders</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Purchase
        </button>
      </div>

      <div className="card table-card">
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search purchases..." className="search-input" />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading purchases...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>PO ID</th>
                  <th>Supplier</th>
                  <th>Material</th>
                  <th>Quantity</th>
                  <th>Total Cost</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length > 0 ? purchases.map((po) => (
                  <tr key={po.id}>
                    <td><strong>{po.id}</strong></td>
                    <td>{po.supplier_name}</td>
                    <td>{po.material_name}</td>
                    <td>{po.quantity}</td>
                    <td style={{ fontWeight: '600', color: 'var(--success)' }}>
                      ₹{(po.price * po.quantity).toLocaleString('en-IN')}
                    </td>
                    <td>{new Date(po.created_at).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No purchase history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Purchase Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={24} color="var(--accent-primary)" /> New Purchase Order
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Supplier</label>
                <select 
                  className="form-control" required
                  value={formData.supplier_id} 
                  onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Material</label>
                <select 
                  className="form-control" required
                  value={formData.material_id} 
                  onChange={(e) => setFormData({...formData, material_id: e.target.value})}
                >
                  <option value="">-- Choose Material --</option>
                  {materials.map(m => <option key={m.id} value={m.id}>{m.name} (Stock: {m.stock})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input 
                    type="number" className="form-control" required min="1"
                    value={formData.quantity} 
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price per Unit (₹)</label>
                  <input 
                    type="number" className="form-control" required min="0"
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchase;
