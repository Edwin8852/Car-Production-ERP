import React from 'react';
import { Users, ShoppingBag, Factory, TrendingUp, ShieldCheck } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    { title: 'Global Users', value: stats?.users || 0, icon: <Users />, color: '#6366f1' },
    { title: 'Total Orders', value: stats?.orders || 0, icon: <ShoppingBag />, color: '#ec4899' },
    { title: 'Production Batches', value: stats?.production || 0, icon: <Factory />, color: '#10b981' },
    { title: 'Annual Revenue', value: `₹${(stats?.revenue || 0).toLocaleString('en-IN')}`, icon: <TrendingUp />, color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-grid">
      {cards.map((card, index) => (
        <div className="card stat-card" key={index}>
          <div className="stat-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
            {card.icon}
          </div>
          <div className="stat-content">
            <p className="stat-label">{card.title}</p>
            <h3 className="stat-value">{card.value}</h3>
          </div>
          <div className="stat-badge">
             <ShieldCheck size={14} />
             <span>Super Admin View</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
