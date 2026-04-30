import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle, Navigation, PhoneCall, AlertCircle } from 'lucide-react';
import api from '../../../api/axios';

const DeliveryDetails = ({ delivery, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  if (!delivery) {
    return (
      <div className="card" style={{ marginTop: '2rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-secondary">Select a delivery to view details</p>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await api.patch(`/delivery/${delivery.id}/status`, { status: newStatus });
      onUpdate(); // refresh data
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h2>Delivery Job: #{delivery.order_id}</h2>
        <span className={`badge badge-${delivery.delivery_status === 'DELIVERED' ? 'success' : delivery.delivery_status === 'OUT_FOR_DELIVERY' ? 'warning' : 'info'}`}>
          {delivery.delivery_status}
        </span>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* Customer Info */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{delivery.customer_name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <PhoneCall size={14} /> {delivery.phone || 'Phone not provided'}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} /> {delivery.address || 'Address not provided'}
          </p>
        </div>

        {/* Product Info */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Payload</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <Truck size={24} color="var(--accent-primary)" />
            <div>
              <p style={{ fontWeight: '600' }}>{delivery.product_name}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Handle with care. Complete pre-delivery inspection before handover.</p>
            </div>
          </div>
        </div>

        {/* Status Actions */}
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Action Required</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {delivery.delivery_status === 'READY' && (
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                disabled={updating}
                onClick={() => handleStatusUpdate('OUT_FOR_DELIVERY')}
              >
                <Navigation size={18} style={{ marginRight: '0.5rem' }} /> Start Route
              </button>
            )}
            
            {delivery.delivery_status === 'OUT_FOR_DELIVERY' && (
              <>
                <button 
                  className="btn btn-success" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', background: '#10b981', color: 'white' }}
                  disabled={updating}
                  onClick={() => handleStatusUpdate('DELIVERED')}
                >
                  <CheckCircle size={18} style={{ marginRight: '0.5rem' }} /> Mark as Delivered
                </button>
                <button 
                  className="btn btn-outline-secondary" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}
                  disabled={updating}
                  onClick={() => alert("Report issue feature coming soon.")}
                >
                  <AlertCircle size={18} style={{ marginRight: '0.5rem' }} /> Report Issue
                </button>
              </>
            )}

            {delivery.delivery_status === 'DELIVERED' && (
              <div style={{ padding: '1rem', textAlign: 'center', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                <CheckCircle size={24} style={{ marginBottom: '0.5rem', margin: '0 auto' }} />
                <p>Delivery Completed Successfully</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeliveryDetails;
