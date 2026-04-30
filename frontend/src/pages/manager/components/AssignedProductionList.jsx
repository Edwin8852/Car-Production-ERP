import React from 'react';
import { Factory, Clock, AlertCircle } from 'lucide-react';

const AssignedProductionList = ({ orders, onSelect, selectedId }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2>Assigned Production Batches</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Factory size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No production batches assigned to you right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h2>Assigned Production Batches</h2>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className={selectedId === order.id ? 'active-row' : ''} style={{ cursor: 'pointer' }} onClick={() => onSelect(order)}>
                <td><strong>#{order.id}</strong></td>
                <td>{order.product_name}</td>
                <td>
                  <span className={`badge badge-${order.status === 'COMPLETED' ? 'success' : order.status === 'IN_PROGRESS' ? 'primary' : 'warning'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline-primary btn-sm">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedProductionList;
