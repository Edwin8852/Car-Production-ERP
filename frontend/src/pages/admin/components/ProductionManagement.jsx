import React from 'react';
import { UserCheck, Clock, Settings } from 'lucide-react';

const ProductionManagement = () => {
  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h2>Production Assignment</h2>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Status</th>
              <th>Assigned Manager</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Safari SUV #521</strong></td>
              <td><span className="badge badge-warning">Pending Assignment</span></td>
              <td>-</td>
              <td><button className="btn btn-primary btn-sm">Assign Manager</button></td>
            </tr>
            <tr>
              <td><strong>Nexon EV #522</strong></td>
              <td><span className="badge badge-info">In Progress</span></td>
              <td>Mr. Suresh (Manager)</td>
              <td><button className="btn btn-outline-secondary btn-sm">Reassign</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionManagement;
