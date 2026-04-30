import React from 'react';
import { Truck, MapPin, PackageCheck, Navigation, Clock, CheckCircle2 } from 'lucide-react';
import '../Dashboard.css';

const DeliveryDashboard = () => {
  const tasks = [
    { title: 'To Deliver', value: '8', status: 'In Progress', icon: <Truck size={24} />, color: '#6366f1' },
    { title: 'Completed', value: '14', status: 'Today', icon: <PackageCheck size={24} />, color: '#10b981' },
    { title: 'Distance', value: '42km', status: 'Total', icon: <Navigation size={24} />, color: '#f59e0b' },
    { title: 'Avg Time', value: '25m', status: 'Per Stop', icon: <Clock size={24} />, color: '#8b5cf6' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Delivery Hub</h1>
          <p className="text-secondary">Track your routes and delivery status</p>
        </div>
        <button className="btn btn-primary">Start New Route</button>
      </div>

      <div className="dashboard-grid">
        {tasks.map((task, index) => (
          <div className="card stat-card" key={index}>
            <div className="stat-icon" style={{ backgroundColor: `${task.color}15`, color: task.color }}>
              {task.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{task.title}</p>
              <h3 className="stat-value">{task.value}</h3>
              <p className="text-secondary" style={{ fontSize: '0.8rem' }}>{task.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Upcoming Deliveries</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Address</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ORD-5231</strong></td>
                <td>Sector 5, Industrial Area</td>
                <td><span className="badge badge-warning">High</span></td>
                <td><button className="btn btn-sm btn-outline-primary">Update</button></td>
              </tr>
              <tr>
                <td><strong>ORD-5232</strong></td>
                <td>Outer Ring Road, Block B</td>
                <td><span className="badge badge-info">Normal</span></td>
                <td><button className="btn btn-sm btn-outline-primary">Update</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
