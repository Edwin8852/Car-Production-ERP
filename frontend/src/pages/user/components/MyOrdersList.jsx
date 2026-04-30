import React from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';

const MyOrdersList = ({ orders, onSelect, selectedId }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2>My Bookings</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>You haven't booked any cars yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h2>My Bookings</h2>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Model</th>
              <th>Booking Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr 
                key={order.id} 
                className={selectedId === order.id ? 'active-row' : ''}
              >
                <td><strong>#{order.id}</strong></td>
                <td>{order.product_name}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${order.status === 'DELIVERED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'primary'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onSelect(order.id)}
                  >
                    Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersList;
