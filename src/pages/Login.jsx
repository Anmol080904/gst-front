import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch('https://temp-gst.onrender.com/api/login/', {
  method: 'POST',
  credentials: 'include', 
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: formData.email,
    password: formData.password
  })
});

    const result = await response.json();

    if (response.ok && result.status === 'success') {
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: 'John Doe'
      }));

      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed');
    }
  } catch (err) {
    setError('Network error');
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>GST Manager</h1>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="login-footer">
          <p>Demo credentials: any email/password combination</p>
        </div>
      </div>
    </div>
  );
};

export default Login;