import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Save, Eye, ExternalLink, Upload, Image } from 'lucide-react';
import api from '../services/api';
import LucideIcon from '../components/LucideIcon';
import './AdminDashboard.css';

// Insurance-related icons
const INSURANCE_ICONS = [
  'Shield', 'Heart', 'Home', 'Car', 'Plane', 'Ship', 'Train', 'Bicycle',
  'User', 'Users', 'Family', 'Baby', 'Stethoscope', 'Pill', 'Activity',
  'Briefcase', 'FileText', 'FileCheck', 'Clipboard', 'Award', 'Trophy',
  'Building', 'Factory', 'Store', 'ShoppingBag', 'CreditCard', 'DollarSign',
  'PiggyBank', 'TrendingUp', 'BarChart', 'PieChart', 'Calculator', 'Receipt',
  'Umbrella', 'Sun', 'Cloud', 'CloudRain', 'Wind', 'Zap', 'Flame',
  'AlertTriangle', 'CheckCircle', 'XCircle', 'Info', 'HelpCircle', 'Lock',
  'Key', 'Safe', 'Banknote', 'Coins', 'Wallet', 'Package', 'Box',
  'Truck', 'Van', 'Bus', 'Motorcycle', 'Helicopter', 'Anchor', 'Compass',
  'Map', 'MapPin', 'Globe', 'Phone', 'Mail', 'MessageSquare', 'Video',
  'Camera', 'Image', 'FileImage', 'Folder', 'FolderOpen', 'Archive',
  'Calendar', 'Clock', 'Timer', 'Hourglass', 'Bookmark', 'Flag',
  'Target', 'Crosshair', 'Navigation', 'Gps', 'Wifi', 'Database',
  'Server', 'HardDrive', 'Cpu', 'Monitor', 'Smartphone', 'Tablet',
  'Laptop', 'Headphones', 'Speaker', 'Mic', 'Volume2', 'Music'
];

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    image: null,
    image_url: '',
    link: '',
    path: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await api.getPolicies();
      setPolicies(response.data);
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      image: null,
      image_url: '',
      link: '',
      path: ''
    });
    setImagePreview(null);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image file');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleAddPolicy = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setFormData({
      title: policy.title,
      description: policy.description,
      icon: policy.icon,
      image: null,
      image_url: policy.image_url || policy.image || '',
      link: policy.link,
      path: policy.path || ''
    });
    setImagePreview(policy.image_url || policy.image || null);
    setShowEditModal(true);
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowViewModal(true);
  };

  const handleDeletePolicy = async (policy) => {
    if (window.confirm(`Are you sure you want to delete "${policy.title}"?`)) {
      try {
        await api.deletePolicy(policy._id);
        fetchPolicies();
      } catch (error) {
        console.error('Error deleting policy:', error);
        alert('Error deleting policy');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      
      // Add form fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('icon', formData.icon);
      submitData.append('link', formData.link);
      
      // Add image if provided
      if (formData.image) {
        submitData.append('image', formData.image);
      } else if (formData.image_url) {
        submitData.append('image_url', formData.image_url);
      }
      
      if (showAddModal) {
        await api.createPolicy(submitData);
      } else {
        await api.updatePolicy(selectedPolicy._id, submitData);
      }
      fetchPolicies();
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving policy:', error);
      alert('Error saving policy');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredPolicies = policies.filter(policy =>
    (policy.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (policy.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="admin-loading">Loading policies...</div>;
  }

  return (
    <div className="admin-policies">
      <div className="admin-header-content">
        <div>
          <h1 className="admin-page-title">Policies</h1>
          <p className="admin-page-subtitle">Manage insurance policies</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAddPolicy}>
          <Plus size={20} />
          Add Policy
        </button>
      </div>

      {/* Search */}
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Policies Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Icon</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.map((policy) => (
              <tr key={policy._id}>
                <td>
                  <div className="admin-service-title">
                    <strong>{policy.title}</strong>
                  </div>
                </td>
                <td>
                  <div className="admin-service-description">
                    {policy.description.length > 100
                      ? `${policy.description.substring(0, 100)}...`
                      : policy.description}
                  </div>
                </td>
                <td>
                  <span className="admin-badge admin-badge-info">
                    <LucideIcon name={policy.icon} size={16} /> {policy.icon}
                  </span>
                </td>
                <td>
                  <a
                    href={policy.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-link"
                  >
                    <ExternalLink size={14} />
                    View Link
                  </a>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleViewPolicy(policy)}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleEditPolicy(policy)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="admin-btn-icon admin-btn-icon-danger"
                      onClick={() => handleDeletePolicy(policy)}
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

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>{showAddModal ? 'Add Policy' : 'Edit Policy'}</h2>
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
              {/* Basic Information */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Policy Information</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Policy Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="Enter policy title"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="admin-form-textarea"
                    rows="4"
                    placeholder="Detailed policy description"
                    required
                  />
                </div>
              </div>

              {/* Visual Assets */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Visual Assets</h3>
                
                {/* Icon Dropdown */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Select Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="admin-form-select"
                    required
                  >
                    <option value="">Choose an icon...</option>
                    {INSURANCE_ICONS.map(icon => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                  <small className="admin-form-counter">Select from insurance-related icons</small>
                </div>

                {/* Drag and Drop Image Upload */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Policy Image</label>
                  <div 
                    className={`admin-drag-drop-area ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="admin-image-preview">
                        <img src={imagePreview} alt="Policy preview" className="admin-preview-image" />
                        <button
                          type="button"
                          className="admin-remove-image"
                          onClick={() => {
                            setFormData({ ...formData, image: null, image_url: '' });
                            setImagePreview(null);
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="admin-drag-drop-content">
                        <Upload size={48} className="admin-upload-icon" />
                        <p>Drag and drop an image here, or click to browse</p>
                        <p className="admin-upload-hint">PNG, JPG, GIF up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="admin-file-input"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Navigation</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Link Path</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="/products?category=Medical Insurance"
                    required
                  />
                  <small className="admin-form-counter">URL path for this policy</small>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Auto-generated Path</label>
                  <input
                    type="text"
                    value={formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[-\s]+/g, '-') : ''}
                    className="admin-form-input"
                    placeholder="auto-generated-from-title"
                    readOnly
                  />
                  <small className="admin-form-counter">Path will be automatically generated from title</small>
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
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={16} />
                  {showAddModal ? 'Add Policy' : 'Update Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPolicy && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Service Details</h2>
              <button
                className="admin-btn-icon"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-view-content">
              <div className="admin-view-section">
                <h3>Basic Information</h3>
                <div className="admin-view-grid">
                  <div>
                    <strong>Title:</strong> {selectedPolicy.title}
                  </div>
                  <div>
                    <strong>Icon:</strong> <LucideIcon name={selectedPolicy.icon} size={20} /> ({selectedPolicy.icon})
                  </div>
                </div>
              </div>

              <div className="admin-view-section">
                <h3>Description</h3>
                <p>{selectedPolicy.description}</p>
              </div>

              <div className="admin-view-section">
                <h3>Visual</h3>
                <div className="admin-view-grid">
                  <div>
                    <strong>Image:</strong>
                    <br />
                    <img
                      src={selectedPolicy.image}
                      alt={selectedPolicy.title}
                      style={{ maxWidth: '200px', marginTop: '8px' }}
                    />
                  </div>
                  <div>
                    <strong>Link:</strong>
                    <br />
                    <a
                      href={selectedPolicy.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-link"
                    >
                      {selectedPolicy.link}
                      <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPolicies;
