import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductionOrders } from '../modules/production/production.service';
import { Plus, Search, Filter, Factory } from 'lucide-react';

const Production = () => {
  const [productionOrders, setProductionOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        const data = await getProductionOrders();
        setProductionOrders(data.data || data || []);
      } catch (error) {
        console.error("Failed to fetch production orders:", error);
        setProductionOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduction();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Production Tracking</h1>
        <button className="btn btn-primary">
          <Factory size={18} /> New Production Run
        </button>
      </div>

      <div className="card table-card">
        <div className="card-header" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search production runs..." className="search-input" />
          </div>
          <button className="btn btn-secondary">
            <Filter size={18} /> Filter
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading production data...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Car Model</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productionOrders.length > 0 ? productionOrders.map((run) => (
                  <tr key={run.id}>
                    <td><strong>{run.id}</strong></td>
                    <td>{run.product_name}</td>
                    <td>
                      <span className={`badge badge-${
                        run.status === 'COMPLETED' ? 'success' : 
                        run.status === 'IN_PROGRESS' ? 'info' : 'warning'
                      }`}>
                        {run.status}
                      </span>
                    </td>
                    <td>{run.created_at ? new Date(run.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/orders/${run.order_id}/tracking`)}
                      >
                        Track Stages
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No production runs active.</td>
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

export default Production;
