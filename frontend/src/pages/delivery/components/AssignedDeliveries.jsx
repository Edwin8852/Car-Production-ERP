import React from 'react';
import { Truck, MapPin, CheckCircle, Navigation } from 'lucide-react';

const AssignedDeliveries = ({ deliveries, onSelect, selectedId }) => {
  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2>My Route Plan</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Truck size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>You have no pending deliveries assigned for today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>My Route Plan</h2>
        <span className="badge badge-primary">{deliveries.length} Stops</span>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Destination</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map(delivery => (
              <tr 
                key={delivery.id} 
                className={selectedId === delivery.id ? 'active-row' : ''} 
                style={{ cursor: 'pointer' }} 
                onClick={() => onSelect(delivery)}
              >
                <td><strong>#{delivery.order_id}</strong></td>
                <td>{delivery.customer_name}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <MapPin size={14} color="var(--accent-primary)" />
                    <span style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {delivery.address || 'Address not provided'}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${delivery.delivery_status === 'DELIVERED' ? 'success' : delivery.delivery_status === 'OUT_FOR_DELIVERY' ? 'warning' : 'info'}`}>
                    {delivery.delivery_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedDeliveries;
