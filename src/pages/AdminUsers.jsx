import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, UserX, Trash2, Eye, Mail, Calendar, Shield, X, Plus, Save, Edit2 } from 'lucide-react';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';
import '../components/ImageUpload.css';
import './AdminDashboard.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    avatar: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleToggleUserStatus = async (user) => {
    if (window.confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`)) {
      try {
        await api.toggleUserStatus(user._id);
        fetchUsers();
      } catch (error) {
        console.error('Error toggling user status:', error);
        alert('Error updating user status');
      }
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete "${user.first_name} ${user.last_name}"? This action cannot be undone.`)) {
      try {
        await api.deleteUser(user._id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const handleAddUser = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user',
      phone: ''
    });
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      password: '', // Don't show password
      role: user.role,
      phone: user.phone || ''
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (showAddModal) {
        await api.createUser(formData);
      } else {
        await api.updateUser(selectedUser._id, formData);
      }
      fetchUsers();
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.message || 'Error saving user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="admin-loading">Loading users...</div>;
  }

  return (
    <div className="admin-users">
      <div className="admin-header-content">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-subtitle">Manage user accounts</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAddUser}>
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="admin-user-info-cell">
                    <div className="admin-user-avatar-small">
                      {user.first_name?.charAt(0) || ''}{user.last_name?.charAt(0) || ''}
                    </div>
                    <div>
                      <strong>{user.first_name} {user.last_name}</strong>
                      {user.phone && <small>{user.phone}</small>}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="admin-user-email">
                    <Mail size={14} />
                    {user.email}
                  </div>
                </td>
                <td>
                  <span className={`admin-badge ${user.role === 'admin'
                    ? 'admin-badge-danger'
                    : 'admin-badge-secondary'
                    }`}>
                    <Shield size={12} />
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${user.isActive
                    ? 'admin-badge-success'
                    : 'admin-badge-warning'
                    }`}>
                    {user.isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="admin-user-date">
                    <Calendar size={14} />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleViewUser(user)}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleEditUser(user)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className={`admin-btn-icon ${user.isActive ? 'admin-btn-icon-warning' : ''
                        }`}
                      onClick={() => handleToggleUserStatus(user)}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                    <button
                      className="admin-btn-icon admin-btn-icon-danger"
                      onClick={() => handleDeleteUser(user)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>User Details</h2>
              <button
                className="admin-btn-icon"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-view-content">
              <div className="admin-view-section">
                <h3>Profile Information</h3>
                <div className="admin-user-profile">
                  <div className="admin-user-avatar-large">
                    {selectedUser.first_name?.charAt(0) || ''}{selectedUser.last_name?.charAt(0) || ''}
                  </div>
                  <div className="admin-user-details">
                    <h4>{selectedUser.first_name} {selectedUser.last_name}</h4>
                    <span className={`admin-badge ${selectedUser.role === 'admin'
                      ? 'admin-badge-danger'
                      : 'admin-badge-secondary'
                      }`}>
                      <Shield size={12} />
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-view-section">
                <h3>Contact Information</h3>
                <div className="admin-view-grid">
                  <div>
                    <strong>Email:</strong>
                    <br />
                    <a href={`mailto:${selectedUser.email}`} className="admin-link">
                      {selectedUser.email}
                    </a>
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <strong>Phone:</strong>
                      <br />
                      {selectedUser.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-view-section">
                <h3>Account Status</h3>
                <div className="admin-view-grid">
                  <div>
                    <strong>Status:</strong>
                    <br />
                    <span className={`admin-badge ${selectedUser.isActive
                      ? 'admin-badge-success'
                      : 'admin-badge-warning'
                      }`}>
                      {selectedUser.isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <strong>Member Since:</strong>
                    <br />
                    <div className="admin-user-date">
                      <Calendar size={14} />
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-view-section">
                <h3>Account Actions</h3>
                <div className="admin-user-actions">
                  <button
                    className={`admin-btn ${selectedUser.isActive
                      ? 'admin-btn-secondary'
                      : 'admin-btn-primary'
                      }`}
                    onClick={() => {
                      handleToggleUserStatus(selectedUser);
                      setShowViewModal(false);
                    }}
                  >
                    {selectedUser.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                    {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                  </button>

                  {selectedUser.role !== 'admin' && (
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => {
                        handleDeleteUser(selectedUser);
                        setShowViewModal(false);
                      }}
                    >
                      <Trash2 size={16} />
                      Delete User
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>{showAddModal ? 'Add User' : 'Edit User'}</h2>
              <button
                className="admin-btn-icon"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Personal Information</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Jane"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="jane@example.com"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Account Settings</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {showAddModal && (
                    <div className="admin-form-group">
                      <label className="admin-form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="admin-form-input"
                        placeholder="••••••••"
                        required={showAddModal}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Avatar */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Profile Avatar</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">User Avatar</label>
                  <ImageUpload
                    value={formData.avatar}
                    onChange={(avatarData) => setFormData(prev => ({ ...prev, avatar: avatarData }))}
                    onRemove={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                    placeholder="Drag & drop user avatar here or click to browse"
                    className="admin-avatar-upload"
                  />
                  <small className="admin-form-counter">Upload user avatar with drag & drop or copy & paste (optional)</small>
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={isSubmitting}
                >
                  <Save size={16} />
                  {isSubmitting ? 'Saving...' : (showAddModal ? 'Create User' : 'Update User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
