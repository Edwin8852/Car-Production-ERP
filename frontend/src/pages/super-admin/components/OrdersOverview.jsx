import React from 'react';
import { Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';

const OrdersOverview = () => {
  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Global Orders Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Pending</span>
            <AlertCircle size={20} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>42</h3>
        </div>
        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>In Production</span>
            <Package size={20} color="#6366f1" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>18</h3>
        </div>
        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivered</span>
            <CheckCircle size={20} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>156</h3>
        </div>
      </div>
    </div>
  );
};

export default OrdersOverview;
