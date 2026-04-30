import React, { useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';

const SettingsPanel = () => {
  const [config, setConfig] = useState({
    systemName: 'Auto ERP Global',
    maintenanceMode: false,
    maxProductionCapacity: 500,
    notificationEmail: 'admin@autoerp.com'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={20} color="var(--accent-primary)" />
          <h2>System Configuration</h2>
        </div>
      </div>
      
      <div className="settings-form" style={{ padding: '1rem', display: 'grid', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">System Display Name</label>
          <input 
            type="text" 
            className="form-control" 
            name="systemName"
            value={config.systemName}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Maintenance Mode</label>
          <input 
            type="checkbox" 
            name="maintenanceMode"
            checked={config.maintenanceMode}
            onChange={handleChange}
            style={{ width: '20px', height: '20px' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Max Production Capacity (Cars/Month)</label>
          <input 
            type="number" 
            className="form-control" 
            name="maxProductionCapacity"
            value={config.maxProductionCapacity}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn btn-primary">
            <Save size={18} style={{ marginRight: '0.5rem' }} />
            Save Changes
          </button>
          <button className="btn btn-outline-secondary">
            <RefreshCw size={18} style={{ marginRight: '0.5rem' }} />
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
