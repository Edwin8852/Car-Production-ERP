import React from 'react';
import { ShoppingCart, Factory, Package, ArrowUpRight } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingCart />, color: '#6366f1' },
    { title: 'Active Production', value: stats?.activeProduction || 0, icon: <Factory />, color: '#10b981' },
    { title: 'Materials Stock', value: stats?.materialStock || 0, icon: <Package />, color: '#f59e0b' },
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
            <div className="stat-change up">
              <ArrowUpRight size={14} />
              <span>+4% this week</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
