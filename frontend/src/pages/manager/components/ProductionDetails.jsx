import React, { useState } from 'react';
import { Package, Activity, CheckCircle, Search, Save } from 'lucide-react';
import api from '../../../api/axios';

const ProductionDetails = ({ order, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [materialForm, setMaterialForm] = useState({ materialId: '', quantity: '' });

  if (!order) {
    return (
      <div className="card" style={{ marginTop: '2rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-secondary">Select a production batch to view details</p>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/production-orders/${order.id}/status`, { status: newStatus });
      onUpdate(); // refresh data
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleMaterialUsage = async (e) => {
    e.preventDefault();
    // In a real scenario, this would call an API to log material usage and deduct inventory
    console.log("Logged material usage:", materialForm);
    alert(`Logged ${materialForm.quantity} units of material ID ${materialForm.materialId}`);
    setMaterialForm({ materialId: '', quantity: '' });
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h2>Batch Details: #{order.id}</h2>
        <span className={`badge badge-${order.status === 'COMPLETED' ? 'success' : order.status === 'IN_PROGRESS' ? 'primary' : 'warning'}`}>
          {order.status}
        </span>
      </div>

      <div style={{ padding: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{order.product_name}</h3>
        
        {/* Status Update Buttons */}
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Update Status</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn btn-outline-primary" 
              disabled={updating || order.status === 'PENDING'}
              onClick={() => handleStatusUpdate('PENDING')}
            >
              Pending
            </button>
            <button 
              className="btn btn-primary" 
              disabled={updating || order.status === 'IN_PROGRESS'}
              onClick={() => handleStatusUpdate('IN_PROGRESS')}
            >
              <Activity size={16} style={{ marginRight: '0.5rem' }} />
              In Progress
            </button>
            <button 
              className="btn btn-success" 
              style={{ background: '#10b981', color: 'white' }}
              disabled={updating || order.status === 'COMPLETED'}
              onClick={() => handleStatusUpdate('COMPLETED')}
            >
              <CheckCircle size={16} style={{ marginRight: '0.5rem' }} />
              Mark Completed
            </button>
          </div>
        </div>

        {/* Manufacturing Workflow Stages */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manufacturing Stages</h4>
          {order.stages && order.stages.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {order.stages.map((stage, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
                  <span>{stage.stage}</span>
                  <span className={`badge badge-${stage.status === 'COMPLETED' ? 'success' : 'warning'}`}>{stage.status}</span>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-secondary" style={{ fontSize: '0.85rem' }}>No detailed stages tracked for this batch.</p>
          )}
        </div>

        {/* Material Usage Form */}
        <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={16} /> Track Material Usage
          </h4>
          <form onSubmit={handleMaterialUsage} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Material ID</label>
              <input 
                type="text" 
                className="form-control" 
                value={materialForm.materialId}
                onChange={e => setMaterialForm({...materialForm, materialId: e.target.value})}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0, width: '100px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Qty</label>
              <input 
                type="number" 
                className="form-control" 
                value={materialForm.quantity}
                onChange={e => setMaterialForm({...materialForm, quantity: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductionDetails;
