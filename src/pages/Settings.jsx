import React, { useState } from 'react';
import Layout from './Layout';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoBackup: false,
    darkMode: false,
    language: 'en',
    timezone: 'IST',
    privateAccount: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
    // Logic to send settings to backend (via fetch/axios)
  };

  return (
    <Layout title="Settings">
      <div className="settings-container">
        <h2 className="settings-title">⚙️ Application Settings</h2>
        <p className="settings-subtitle">Customize your preferences</p>

        <div className="settings-list">
          <div className="setting-item">
            <label>Email Notifications</label>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => toggleSetting('emailNotifications')}
            />
          </div>

          <div className="setting-item">
            <label>Auto Backup Data</label>
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={() => toggleSetting('autoBackup')}
            />
          </div>

          <div className="setting-item">
            <label>Enable Dark Mode</label>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => toggleSetting('darkMode')}
            />
          </div>

          <div className="setting-item">
            <label>Account Privacy</label>
            <input
              type="checkbox"
              checked={settings.privateAccount}
              onChange={() => toggleSetting('privateAccount')}
            />
          </div>

          <div className="setting-item">
            <label>Preferred Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
              <option value="bn">Bengali</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Timezone</label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
            >
              <option value="IST">IST (India)</option>
              <option value="UTC">UTC</option>
              <option value="PST">PST (US Pacific)</option>
              <option value="CET">CET (Europe)</option>
            </select>
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={handleSave}>💾 Save Settings</button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
