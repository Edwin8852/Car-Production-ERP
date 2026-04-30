import React from 'react';
import { BarChart, TrendingUp, PieChart } from 'lucide-react';

const LimitedReports = () => {
  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h2>Operational Reports</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1rem' }}>
        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
          <BarChart size={32} color="var(--accent-primary)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
          <h3>Order Fulfillment</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>85% on-time delivery</p>
        </div>
        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
          <PieChart size={32} color="#10b981" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
          <h3>Production Mix</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SUV (60%), EV (40%)</p>
        </div>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem', padding: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
        Full financial reports are restricted to Super Admin only.
      </p>
    </div>
  );
};

export default LimitedReports;
