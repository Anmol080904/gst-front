import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/invoice/create', label: 'Create Invoice', icon: '📄' },
    { path: '/purchase/create', label: 'Create Purchase', icon: '🛒' },
    { path: '/purchase/list', label: 'Purchase List', icon: '🗂️' },
    { path: '/invoice/list', label: 'Invoice List', icon: '📚' },
    { path: '/gstr-reports', label: 'GSTR Reports', icon: '📊' },
    { path: '/itc-tracker', label: 'ITC Tracker', icon: '💸' },
    { path: '/monthly-summary', label: 'Monthly Summary', icon: '📅' },
    { path: '/export-center', label: 'Export Center', icon: '🗃️' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>GST Manager</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>{title}</h1>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;