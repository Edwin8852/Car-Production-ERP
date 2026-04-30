import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { Package, Plus, Search } from 'lucide-react';

const MaterialsManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', unit: '', stock: 0 });

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await api.get('/materials');
      setMaterials(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch materials", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/materials', formData);
      setShowAddForm(false);
      setFormData({ name: '', description: '', unit: '', stock: 0 });
      fetchMaterials();
    } catch (error) {
      console.error("Failed to add material", error);
      alert("Failed to add material");
    }
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Material Inventory</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add Material
        </button>
      </div>

      {showAddForm && (
        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Name</label>
              <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Unit</label>
              <input type="text" className="form-control" placeholder="pcs, kg, etc." value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Initial Stock</label>
              <input type="number" className="form-control" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Material Name</th>
              <th>Unit</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {materials.map(material => (
              <tr key={material.id}>
                <td>#{material.id}</td>
                <td><strong>{material.name}</strong></td>
                <td>{material.unit}</td>
                <td>{material.stock}</td>
                <td>
                  <span className={`badge badge-${material.stock < 10 ? 'warning' : 'success'}`}>
                    {material.stock < 10 ? 'Low Stock' : 'Optimal'}
                  </span>
                </td>
              </tr>
            ))}
            {materials.length === 0 && !loading && (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No materials found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialsManagement;
