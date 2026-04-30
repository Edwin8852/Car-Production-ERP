import React from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

const ReportsChart = () => {
  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Revenue & Production Growth</h2>
        <div className="date-picker">
          <Calendar size={16} />
          <span>Last 12 Months</span>
        </div>
      </div>
      
      <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '2rem 1rem' }}>
        {[40, 65, 45, 90, 55, 80, 95, 70, 85, 60, 75, 100].map((height, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '6%', gap: '0.5rem' }}>
            <div style={{ 
              height: `${height}%`, 
              width: '100%', 
              background: 'linear-gradient(to top, var(--accent-primary), #818cf8)', 
              borderRadius: '6px 6px 0 0',
              transition: 'all 0.3s ease'
            }}></div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>M{i+1}</span>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '3px' }}></div>
          <span style={{ fontSize: '0.85rem' }}>Production</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={16} color="#10b981" />
          <span style={{ fontSize: '0.85rem', color: '#10b981' }}>+12.4% vs last year</span>
        </div>
      </div>
    </div>
  );
};

export default ReportsChart;
