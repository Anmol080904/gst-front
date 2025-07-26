import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing the same styles

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    phone: '',
    company_name: '',
    gstin: '',
    pan: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://temp-gst.onrender.com/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        navigate('/login');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>GST Manager</h1>
          <p>Create a new account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {[
            ['email', 'Email Address', 'email'],
            ['username', 'Username', 'text'],
            ['password', 'Password', 'password'],
            ['phone', 'Phone', 'text'],
            ['company_name', 'Company Name', 'text'],
            ['gstin', 'GSTIN', 'text'],
            ['pan', 'PAN', 'text'],
            ['address', 'Address', 'text'],
            ['city', 'City', 'text'],
            ['state', 'State', 'text'],
            ['pincode', 'Pincode', 'text'],
          ].map(([name, label, type]) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input
                name={name}
                type={type}
                required={['email', 'username', 'password', 'company_name', 'gstin', 'pan'].includes(name)}
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="login-footer">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
