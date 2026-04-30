import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { Users, Plus, Phone } from 'lucide-react';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact_person: '', phone: '', email: '' });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/suppliers', formData);
      setShowAddForm(false);
      setFormData({ name: '', contact_person: '', phone: '', email: '' });
      fetchSuppliers();
    } catch (error) {
      console.error("Failed to add supplier", error);
      alert("Failed to add supplier");
    }
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Active Suppliers</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> Add
        </button>
      </div>

      {showAddForm && (
        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input type="text" className="form-control" placeholder="Company Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="text" className="form-control" placeholder="Contact Person" value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} />
            <input type="text" className="form-control" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>Save Supplier</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id}>
                <td>
                  <strong>{supplier.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{supplier.contact_person}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <Phone size={12} /> {supplier.phone}
                  </div>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && !loading && (
              <tr><td colSpan="2" style={{ textAlign: 'center' }}>No suppliers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierManagement;
