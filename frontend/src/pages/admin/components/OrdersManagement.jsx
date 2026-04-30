import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { Plus, Search, Filter } from 'lucide-react';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Order Management</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="input-with-icon" style={{ marginBottom: 0 }}>
            <Search size={16} className="input-icon" />
            <input type="text" placeholder="Search orders..." className="form-control" style={{ padding: '0.4rem 0.4rem 0.4rem 2rem', fontSize: '0.85rem' }} />
          </div>
          <button className="btn btn-primary btn-sm">
            <Plus size={16} style={{ marginRight: '0.5rem' }} />
            New Order
          </button>
        </div>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(order => (
              <tr key={order.id}>
                <td><strong>#{order.id}</strong></td>
                <td>{order.customer_name || 'Walk-in'}</td>
                <td>{order.product_name}</td>
                <td>
                  <span className={`badge badge-${order.status === 'DELIVERED' ? 'success' : 'info'}`}>
                    {order.status}
                  </span>
                </td>
                <td><button className="btn btn-text btn-sm">Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManagement;
