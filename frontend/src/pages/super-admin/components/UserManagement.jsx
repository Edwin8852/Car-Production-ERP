import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { UserPlus, Edit, Trash2, Shield } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>User & Role Management</h2>
        <button className="btn btn-primary btn-sm">
          <UserPlus size={16} style={{ marginRight: '0.5rem' }} />
          Create New User
        </button>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge badge-${user.role === 'SUPER_ADMIN' ? 'primary' : 'info'}`}>
                    {user.role}
                  </span>
                </td>
                <td><span className="badge badge-success">Active</span></td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-icon"><Edit size={16} /></button>
                  <button className="btn-icon delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
