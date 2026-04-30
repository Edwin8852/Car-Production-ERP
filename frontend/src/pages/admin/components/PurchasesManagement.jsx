import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { ShoppingCart, Plus, CheckCircle, RefreshCcw } from 'lucide-react';

const PurchasesManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    supplier_id: '',
    material_id: '',
    quantity: '',
    price: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [purchasesRes, suppliersRes, materialsRes] = await Promise.all([
        api.get('/purchase'),
        api.get('/suppliers'),
        api.get('/materials')
      ]);
      setPurchases(purchasesRes.data.data || []);
      setSuppliers(suppliersRes.data.data || []);
      setMaterials(materialsRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch purchase data", error);
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
      await api.post('/purchase', formData);
      setShowForm(false);
      setFormData({ supplier_id: '', material_id: '', quantity: '', price: '' });
      fetchData();
    } catch (error) {
      console.error("Failed to create purchase", error);
      alert("Failed to create purchase order");
    }
  };

  const handleReceive = async (id) => {
    try {
      await api.patch(`/purchase/${id}/status`, { status: 'RECEIVED' });
      fetchData();
    } catch (error) {
      console.error("Failed to mark as received", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Purchase Orders</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchData}>
            <RefreshCcw size={16} />
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} style={{ marginRight: '0.5rem' }} /> New PO
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Supplier</label>
              <select className="form-control" value={formData.supplier_id} onChange={e => setFormData({...formData, supplier_id: e.target.value})} required>
                <option value="">Select Supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Material</label>
              <select className="form-control" value={formData.material_id} onChange={e => setFormData({...formData, material_id: e.target.value})} required>
                <option value="">Select Material</option>
                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input type="number" step="0.01" className="form-control" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price ($)</label>
              <input type="number" step="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" className="btn btn-text" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Purchase Order</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>PO #</th>
              <th>Supplier</th>
              <th>Material</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p.id}>
                <td><strong>#{p.id}</strong></td>
                <td>{p.supplier_name}</td>
                <td>{p.material_name}</td>
                <td>{p.quantity}</td>
                <td>${p.total_amount}</td>
                <td>
                  <span className={`badge badge-${p.status === 'RECEIVED' ? 'success' : 'warning'}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  {p.status !== 'RECEIVED' && (
                    <button 
                      className="btn btn-outline-success btn-sm" 
                      onClick={() => handleReceive(p.id)}
                      title="Mark as Received to update inventory"
                    >
                      <CheckCircle size={14} style={{ marginRight: '0.2rem' }} /> Receive
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {purchases.length === 0 && !loading && (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>No purchase orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasesManagement;
