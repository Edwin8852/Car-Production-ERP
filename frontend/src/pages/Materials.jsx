import React, { useState, useEffect } from 'react';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../modules/materials/materials.service';
import { Plus, Search, Filter, Package, Edit, Trash2, X } from 'lucide-react';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', unit: 'unit', stock: 0, description: '' });

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await getMaterials();
      setMaterials(data.data || data || []);
    } catch (error) {
      console.error("Failed to fetch materials:", error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, unit: item.unit, stock: item.stock, description: item.description || '' });
    } else {
      setEditingItem(null);
      setFormData({ name: '', unit: 'unit', stock: 0, description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMaterial(editingItem.id, formData);
      } else {
        await createMaterial(formData);
      }
      handleCloseModal();
      fetchMaterials();
    } catch (error) {
      alert("Failed to save material: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await deleteMaterial(id);
        fetchMaterials();
      } catch (error) {
        alert("Failed to delete material");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Materials Inventory</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Material
        </button>
      </div>

      <div className="card table-card">
        <div className="card-header" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search inventory..." className="search-input" />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading inventory...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Material Name</th>
                  <th>Stock Level</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.length > 0 ? materials.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.description}</div>
                    </td>
                    <td>{Number(item.stock).toLocaleString()}</td>
                    <td>{item.unit}</td>
                    <td>
                      <span className={`badge badge-${Number(item.stock) > 10 ? 'success' : 'danger'}`}>
                        {Number(item.stock) > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(item)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(item.id)} style={{ color: 'var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No materials found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingItem ? 'Edit Material' : 'Add New Material'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Material Name</label>
                <input 
                  type="text" className="form-control" required
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input 
                    type="number" className="form-control" required
                    value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit (kg, pcs, etc.)</label>
                  <input 
                    type="text" className="form-control" required
                    value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" rows="3"
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Material' : 'Save Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
