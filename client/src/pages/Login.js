import React, { useState } from 'react';
import { api } from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login({ email, password });
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fillCredentials = () => {
    setEmail('admin@exportcontrol.com');
    setPassword('password');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>ECSS</h1>
        <p className="login-subtitle">Export Control & Sanctions Screener</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <button className="btn-fill" onClick={fillCredentials}>
          Fill Demo Credentials
        </button>
      </div>
    </div>
  );
}
