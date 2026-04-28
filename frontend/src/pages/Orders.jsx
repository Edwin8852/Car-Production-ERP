import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, createOrder } from '../modules/orders/orders.service';
import { getCustomers } from '../modules/customers/customers.service';
import { Plus, Search, Filter, X, ShoppingCart } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', product_name: '' });
  
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, customersData] = await Promise.all([
        getOrders(),
        getCustomers()
      ]);
      setOrders(ordersData.data || ordersData || []);
      setCustomers(customersData.data || customersData || []);
    } catch (error) {
      console.error("Failed to fetch orders/customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrder(formData);
      setIsModalOpen(false);
      setFormData({ customer_id: '', product_name: '' });
      fetchData();
    } catch (error) {
      alert("Failed to create order");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Sales Orders</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Order
        </button>
      </div>

      <div className="card table-card">
        <div className="card-header" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search orders..." className="search-input" />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.customer_name}</td>
                    <td>{order.product_name}</td>
                    <td>
                      <span className={`badge badge-${
                        ['COMPLETED', 'DELIVERED'].includes(order.status?.toUpperCase()) ? 'success' : 
                        ['PENDING'].includes(order.status?.toUpperCase()) ? 'warning' : 'info'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/orders/${order.id}/tracking`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Order Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={24} color="var(--accent-primary)" /> Create New Order
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Customer</label>
                <select 
                  className="form-control" required
                  value={formData.customer_id} 
                  onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Car Model / Product</label>
                <input 
                  type="text" className="form-control" required placeholder="e.g. Nexon EV, Safari SUV"
                  value={formData.product_name} 
                  onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
