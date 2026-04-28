import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getRoles } from '../modules/auth/users.service';
import { Plus, Search, Shield, Trash2, Edit, X, User } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uData, rData] = await Promise.all([
        getUsers(),
        getRoles()
      ]);
      setUsers(uData.data || uData || []);
      setRoles(rData.data || rData || []);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, email: item.email, password: '', role_id: item.role_id });
    } else {
      setEditingItem(null);
      setFormData({ name: '', email: '', password: '', role_id: '' });
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
        await updateUser(editingItem.id, formData);
      } else {
        await createUser(formData);
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      alert("Failed to save user: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchData();
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">User Management (Admin)</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Create User
        </button>
      </div>

      <div className="card table-card">
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search users..." className="search-input" />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.id}</strong></td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${
                        ['SUPER_ADMIN', 'ADMIN'].includes(user.Role?.name) ? 'success' : 'info'
                      }`}>
                        {user.Role?.name || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(user)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(user.id)} style={{ color: 'var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={24} color="var(--accent-primary)" /> {editingItem ? 'Edit User' : 'Create New User'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" className="form-control" required
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" className="form-control" required
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password {editingItem && '(Leave blank to keep current)'}</label>
                <input 
                  type="password" className="form-control" required={!editingItem}
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assign Role</label>
                <select 
                  className="form-control" required
                  value={formData.role_id} 
                  onChange={(e) => setFormData({...formData, role_id: e.target.value})}
                >
                  <option value="">-- Select Role --</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
