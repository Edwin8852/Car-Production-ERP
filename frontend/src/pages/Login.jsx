import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../modules/auth/auth.service';
import { Factory, Lock, Mail } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin@321');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ email, password });
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user?.role) {
          localStorage.setItem('role', response.data.user.role);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        navigate('/');
      } else {
        setError('Login failed. No token received.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card animate-fade-in">
      <div className="auth-header">
        <div className="auth-logo">
          <Factory size={32} color="white" />
        </div>
        <h1>Welcome Back</h1>
        <p>Sign in to Auto ERP System</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-with-icon">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              className="form-control" 
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-with-icon">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
