import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Bell, Shield, Palette, Globe, HelpCircle, Save, Eye, EyeOff, Mail, Phone, Camera, Upload, ArrowLeft } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    renewalReminders: true,
    paymentAlerts: true,
    newMessages: false
  });

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Agent',
    email: 'agent@starzedinsurance.com',
    phone: '+254712345678',
    bio: 'Experienced insurance agent specializing in motor and medical insurance.',
    avatar: null
  });

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'light'
  });

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPassword(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field) => {
    setNotifications(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profile);
  };

  const handleSavePassword = () => {
    console.log('Saving password:', password);
  };

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications);
  };

  const handleSavePreferences = () => {
    console.log('Saving preferences:', preferences);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'help', name: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-header-left">
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <div className="tabs-list">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={20} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="settings-main">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <div className="profile-section">
                <div className="avatar-section">
                  <div className="avatar-container">
                    <div className="avatar">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Profile" />
                      ) : (
                        <div className="avatar-placeholder">
                          {profile.firstName?.charAt(0) || ''}{profile.lastName?.charAt(0) || ''}
                        </div>
                      )}
                    </div>
                    <button className="avatar-upload-btn">
                      <Camera size={16} />
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={16} />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-with-icon">
                      <Phone size={16} />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button className="save-btn" onClick={handleSaveProfile}>
                    <Save size={16} />
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <div className="security-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-with-icon">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={password.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-with-icon">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-with-icon">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button className="save-btn" onClick={handleSavePassword}>
                  <Save size={16} />
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <div className="notifications-form">
                <div className="notification-group">
                  <h3>Communication Channels</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Email Notifications</h4>
                      <p>Receive notifications via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>SMS Notifications</h4>
                      <p>Receive notifications via SMS</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.smsNotifications}
                        onChange={() => handleNotificationChange('smsNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Push Notifications</h4>
                      <p>Receive push notifications in browser</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.pushNotifications}
                        onChange={() => handleNotificationChange('pushNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="notification-group">
                  <h3>Notification Types</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Renewal Reminders</h4>
                      <p>Get notified about upcoming policy renewals</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.renewalReminders}
                        onChange={() => handleNotificationChange('renewalReminders')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Payment Alerts</h4>
                      <p>Receive payment confirmations and alerts</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.paymentAlerts}
                        onChange={() => handleNotificationChange('paymentAlerts')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>New Messages</h4>
                      <p>Get notified when clients send messages</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.newMessages}
                        onChange={() => handleNotificationChange('newMessages')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <button className="save-btn" onClick={handleSaveNotifications}>
                  <Save size={16} />
                  Save Notifications
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2>Preferences</h2>
              <div className="preferences-form">
                <div className="form-group">
                  <label>Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                  >
                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                    <option value="Africa/Cairo">Africa/Cairo</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date Format</label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Time Format</label>
                  <select
                    value={preferences.timeFormat}
                    onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                  >
                    <option value="24h">24-hour</option>
                    <option value="12h">12-hour</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <button className="save-btn" onClick={handleSavePreferences}>
                  <Save size={16} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="settings-section">
              <h2>Help & Support</h2>
              <div className="help-content">
                <div className="help-section">
                  <h3>Frequently Asked Questions</h3>
                  <div className="faq-item">
                    <h4>How do I reset my password?</h4>
                    <p>Go to Security settings and enter your current password, then set a new password.</p>
                  </div>
                  <div className="faq-item">
                    <h4>How do I change my notification preferences?</h4>
                    <p>Navigate to the Notifications tab to customize your notification settings.</p>
                  </div>
                  <div className="faq-item">
                    <h4>How can I contact support?</h4>
                    <p>Email us at support@starzedinsurance.com or call +254-123-456-789.</p>
                  </div>
                </div>

                <div className="help-section">
                  <h3>Contact Support</h3>
                  <div className="contact-options">
                    <div className="contact-option">
                      <Mail size={20} />
                      <div>
                        <h4>Email Support</h4>
                        <p>support@starzedinsurance.com</p>
                      </div>
                    </div>
                    <div className="contact-option">
                      <Phone size={20} />
                      <div>
                        <h4>Phone Support</h4>
                        <p>+254-123-456-789</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
