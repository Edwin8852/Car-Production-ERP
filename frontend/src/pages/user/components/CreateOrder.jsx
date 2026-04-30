import React, { useState } from 'react';
import { Car, Send } from 'lucide-react';
import api from '../../../api/axios';

const CreateOrder = ({ onOrderCreated }) => {
  const [productName, setProductName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName) return;
    
    setSubmitting(true);
    try {
      await api.post('/orders', { productName });
      setProductName('');
      if (onOrderCreated) onOrderCreated();
      alert('Car booked successfully!');
    } catch (error) {
      console.error('Failed to create order', error);
      alert('Failed to book car. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <h2>Book a New Car</h2>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <Car size={48} color="var(--accent-primary)" style={{ opacity: 0.8, marginBottom: '1rem' }} />
          <p className="text-secondary">Select your preferred model to start the manufacturing process.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Car Model</label>
            <select 
              className="form-control" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)}
              required
            >
              <option value="" disabled>Select a model...</option>
              <option value="Nexon EV">Nexon EV</option>
              <option value="Harrier SUV">Harrier SUV</option>
              <option value="Safari SUV">Safari SUV</option>
              <option value="Altroz Hatchback">Altroz Hatchback</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            disabled={submitting || !productName}
          >
            {submitting ? 'Processing...' : (
              <>
                <Send size={18} style={{ marginRight: '0.5rem' }} />
                Confirm Booking
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
