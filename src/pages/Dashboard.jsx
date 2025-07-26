import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    gstPayable: 0,
    itcClaimed: 0,
    monthlySales: 0
  });

 useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('https://temp-gst.onrender.com/api/stats/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await res.json();
      if (result.status === 'success') {
        setStats({
          totalInvoices: result.totalInvoices,
          gstPayable: result.gstPayable,
          itcClaimed: result.itcClaimed,
          monthlySales: 0 // intentionally omitted
        });
      } else {
        alert('Failed to fetch dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  fetchDashboardStats();
}, []);


  const quickActions = [
    { title: 'Create Invoice', path: '/invoice/create', icon: '📄', color: 'blue' },
    { title: 'GSTR Reports', path: '/gstr-reports', icon: '📊', color: 'green' },
    { title: 'ITC Tracker', path: '/itc-tracker', icon: '💸', color: 'orange' },
    { title: 'Monthly Summary', path: '/monthly-summary', icon: '📅', color: 'purple' }
  ];

  return (
    <Layout title="Dashboard">
      <div className="dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Invoices</h3>
              <p className="stat-number">{stats.totalInvoices}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>GST Payable</h3>
              <p className="stat-number">₹{stats.gstPayable.toLocaleString()}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💸</div>
            <div className="stat-content">
              <h3>ITC Claimed</h3>
              <p className="stat-number">₹{stats.itcClaimed.toLocaleString()}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Monthly Sales</h3>
              <p className="stat-number">₹{stats.monthlySales.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className={`action-card ${action.color}`}>
                <div className="action-icon">{action.icon}</div>
                <h3>{action.title}</h3>
                <button 
                  className="action-btn"
                  onClick={() => window.location.href = action.path}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📄</div>
              <div className="activity-content">
                <p>Invoice #INV-001 created</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <p>GSTR-1 report generated</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💸</div>
              <div className="activity-content">
                <p>ITC of ₹5,600 claimed</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;