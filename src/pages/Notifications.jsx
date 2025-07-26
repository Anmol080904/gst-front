import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('https://temp-gst.onrender.com/api/recent/', {
          method: 'GET',
          credentials: 'include', // Important for session authentication
        });

        const result = await res.json();
        if (result.status === 'success') {
          setNotifications(result.activities);
        } else {
          alert(result.error || 'Failed to load notifications.');
        }
      } catch (error) {
        alert('Error fetching notifications: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Layout title="Notifications">
      <div className="notifications">
        <div className="notifications-header">
          <h2 className="notifications-title">🔔 Notifications Center</h2>
          <p className="notifications-subtitle">Stay informed with the latest updates and reminders.</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="empty-message">No recent activities found.</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((note, index) => (
              <div className="notification-card" key={index}>
                <span className="notification-icon">📢</span>
                <div className="notification-content">
                  <p className="notification-text">{note.action}</p>
                  <p className="notification-subtext">Invoice: {note.invoice} | {note.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
