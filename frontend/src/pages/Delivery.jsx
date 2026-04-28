import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeliveries } from '../modules/delivery/delivery.service';
import { Plus, Search, Truck } from 'lucide-react';

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await getDeliveries();
        setDeliveries(data.data || data || []);
      } catch (error) {
        console.error("Failed to fetch deliveries:", error);
        setDeliveries([
          { _id: 'DEL-8890', orderId: 'ORD-2026-001', destination: 'New York, NY', driver: 'Mike Tyson', status: 'In Transit', dispatchDate: '2026-10-24' },
          { _id: 'DEL-8891', orderId: 'ORD-2026-002', destination: 'Los Angeles, CA', driver: 'John Smith', status: 'Delivered', dispatchDate: '2026-10-20' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Delivery & Logistics</h1>
        <button className="btn btn-primary">
          <Truck size={18} /> Schedule Delivery
        </button>
      </div>

      <div className="card table-card">
        <div className="card-header" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search shipments..." className="search-input" />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading deliveries...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Order Ref</th>
                  <th>Destination</th>
                  <th>Driver/Carrier</th>
                  <th>Dispatch Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.length > 0 ? deliveries.map((del) => (
                  <tr key={del.id}>
                    <td><strong>{del.id}</strong></td>
                    <td>{del.order_id}</td>
                    <td>N/A</td>
                    <td>{del.delivery_person_name || 'Unassigned'}</td>
                    <td>{del.delivery_date ? new Date(del.delivery_date).toLocaleDateString() : 'Pending'}</td>
                    <td>
                      <span className={`badge badge-${
                        del.delivery_status === 'DELIVERED' ? 'success' : 
                        del.delivery_status === 'DISPATCHED' ? 'info' : 'warning'
                      }`}>
                        {del.delivery_status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/orders/${del.order_id}/tracking`)}
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No deliveries scheduled.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;
