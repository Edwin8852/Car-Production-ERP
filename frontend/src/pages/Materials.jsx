import React, { useState, useEffect } from 'react';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../modules/materials/materials.service';
import { Plus, Search, Package, Edit, Trash2, X, RefreshCw, Layers } from 'lucide-react';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', unit: 'unit', stock: 0, description: '' });
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{
      animation: 'fadeIn 0.5s ease-out',
      padding: '2rem',
      fontFamily: '"Inter", "Roboto", sans-serif',
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      minHeight: '100vh',
      borderRadius: '24px'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem',
        background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)',
        padding: '1.5rem 2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '12px', borderRadius: '12px', color: '#fff' }}>
            <Layers size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#1a202c' }}>Materials Inventory</h1>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>Manage and track your raw materials efficiently</p>
          </div>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', border: 'none', padding: '0.75rem 1.5rem',
            borderRadius: '12px', fontWeight: '600', fontSize: '0.95rem',
            cursor: 'pointer', transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={18} /> Add Material
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', background: '#f7fafc',
            borderRadius: '12px', padding: '0.5rem 1rem', width: '350px',
            border: '1px solid #e2e8f0', transition: 'all 0.3s ease'
          }}>
            <Search size={18} color="#a0aec0" />
            <input 
              type="text" 
              placeholder="Search materials..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                padding: '0.5rem', width: '100%', fontSize: '0.95rem', color: '#4a5568'
              }} 
            />
          </div>
          
          <button 
            onClick={fetchMaterials}
            style={{
              background: '#edf2f7', border: 'none', padding: '0.75rem',
              borderRadius: '10px', color: '#4a5568', cursor: 'pointer',
              display: 'flex', alignItems: 'center', transition: 'all 0.2s ease'
            }}
            title="Refresh Data"
            onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#edf2f7'}
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#718096', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <RefreshCw size={32} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Loading inventory data...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#a0aec0', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#a0aec0', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Material Info</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#a0aec0', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Level</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#a0aec0', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unit</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#a0aec0', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right', color: '#a0aec0', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.length > 0 ? filteredMaterials.map((item) => (
                  <tr key={item.id} style={{ 
                    background: '#f8fafc', transition: 'all 0.2s ease', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                  }}>
                    <td style={{ padding: '1.2rem 1rem', borderRadius: '10px 0 0 10px' }}>
                      <span style={{ background: '#edf2f7', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>
                        #{item.id}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#e2e8f0', padding: '0.5rem', borderRadius: '8px', color: '#4a5568' }}>
                          <Package size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '1rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.2rem' }}>{item.description || 'No description provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem 1rem', fontWeight: '600', color: '#2d3748', fontSize: '1.05rem' }}>
                      {Number(item.stock).toLocaleString()}
                    </td>
                    <td style={{ padding: '1.2rem 1rem', color: '#718096' }}>
                      <span style={{ border: '1px solid #e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {item.unit}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <span style={{
                        padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                        background: Number(item.stock) > 10 ? '#c6f6d5' : '#fed7d7',
                        color: Number(item.stock) > 10 ? '#22543d' : '#822727',
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: Number(item.stock) > 10 ? '#38a169' : '#e53e3e' }}></div>
                        {Number(item.stock) > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1rem', borderRadius: '0 10px 10px 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleOpenModal(item)}
                          style={{
                            background: '#ebf4ff', color: '#3182ce', border: 'none',
                            padding: '0.5rem', borderRadius: '8px', cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#bee3f8'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#ebf4ff'}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: '#fff5f5', color: '#e53e3e', border: 'none',
                            padding: '0.5rem', borderRadius: '8px', cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#fed7d7'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#fff5f5'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#718096' }}>
                      <Package size={48} color="#cbd5e0" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>No materials found</div>
                      <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Try adjusting your search or add a new material.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern CRUD Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ 
            background: '#ffffff', width: '100%', maxWidth: '550px', 
            borderRadius: '24px', position: 'relative', overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '1.5rem 2rem', color: 'white', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>
                {editingItem ? 'Edit Material' : 'Add New Material'}
              </h2>
              <button 
                onClick={handleCloseModal} 
                style={{ 
                  background: 'rgba(255,255,255,0.2)', border: 'none', 
                  color: 'white', cursor: 'pointer', padding: '0.5rem', 
                  borderRadius: '50%', display: 'flex', transition: 'all 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Material Name</label>
                <input 
                  type="text" required placeholder="e.g. Steel Sheets"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                    border: '1px solid #e2e8f0', fontSize: '1rem', color: '#2d3748',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Stock Quantity</label>
                  <input 
                    type="number" required placeholder="0"
                    value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      border: '1px solid #e2e8f0', fontSize: '1rem', color: '#2d3748',
                      outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Measurement Unit</label>
                  <input 
                    type="text" required placeholder="kg, pcs, liters..."
                    value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      border: '1px solid #e2e8f0', fontSize: '1rem', color: '#2d3748',
                      outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Description</label>
                <textarea 
                  rows="3" placeholder="Optional details about this material..."
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                    border: '1px solid #e2e8f0', fontSize: '1rem', color: '#2d3748',
                    outline: 'none', transition: 'border-color 0.2s', resize: 'vertical', boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                ></textarea>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  style={{
                    background: '#f7fafc', color: '#4a5568', border: '1px solid #e2e8f0',
                    padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#edf2f7'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f7fafc'}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white', border: 'none', padding: '0.75rem 2rem',
                    borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)', transition: 'all 0.2s',
                    fontSize: '0.95rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {editingItem ? 'Update Material' : 'Save Material'}
                </button>
              </div>
            </form>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Materials;
