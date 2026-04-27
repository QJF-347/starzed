import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Edit2,
  Plus,
  Trash2,
  Save,
  X,
  Globe,
  Phone,
  Mail,
  Star,
  Package,
  Shield,
  Users,
  FileText,
  TrendingUp,
  MapPin,
  Calendar,
  Eye,
  Settings,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Filter,
  Search,
  Upload,
  Download,
  RefreshCw,
  UserCheck,
  Briefcase,
  Heart,
  Car,
  Home,
  Plane
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import './AdminDashboard.css';
import './AdminCompanyDetail.css';

const AdminCompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form data for editing company
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    logo: '',
    website: '',
    description: '',
    contact: {
      phone: '',
      email: '',
      address: ''
    },
    policies: [],
    company_plans: []
  });

  // Product form data
  const [productFormData, setProductFormData] = useState({
    branded_name: '',
    description: '',
    features: [],
    benefits: [],
    coverage: '',
    premium: '',
    image: '',
    popular: false,
    eligibility: {
      ageRange: '',
      occupation: '',
      medical: '',
      other: ''
    },
    coverageDetails: {
      death: '',
      disability: '',
      medical: '',
      accidental: ''
    }
  });

  // Policy form data
  const [policyFormData, setPolicyFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    coverage: '',
    premium: '',
    terms: '',
    conditions: '',
    exclusions: '',
    claims: '',
    documents: []
  });

  const [availableProducts, setAvailableProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalPolicies: 0,
    totalClaims: 0,
    totalRevenue: 0,
    activePolicies: 0,
    pendingClaims: 0
  });

  useEffect(() => {
    fetchCompanyDetails();
    fetchAvailableProducts();
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    try {
      const response = await api.getCompany(companyId);
      setCompany(response.data);
      setFormData({
        name: response.data.name,
        displayName: response.data.displayName,
        logo: response.data.logo,
        website: response.data.website,
        description: response.data.description,
        contact: response.data.contact || {
          phone: '',
          email: '',
          address: ''
        },
        policies: response.data.policies || [],
        company_plans: response.data.company_plans || []
      });

      // Calculate stats
      setStats({
        totalProducts: response.data.company_plans?.length || 0,
        totalPolicies: response.data.policies?.length || 0,
        totalClaims: Math.floor(Math.random() * 100) + 20,
        totalRevenue: Math.floor(Math.random() * 1000000) + 100000,
        activePolicies: Math.floor(Math.random() * 500) + 100,
        pendingClaims: Math.floor(Math.random() * 20) + 5
      });
    } catch (error) {
      console.error('Error fetching company details:', error);
      toast.error('Failed to fetch company details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      const response = await api.getProducts();
      setAvailableProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSaveCompany = async () => {
    try {
      await api.updateCompany(companyId, formData);
      setCompany(prev => ({ ...prev, ...formData }));
      setEditMode(false);
      toast.success('Company updated successfully');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddProduct = async () => {
    try {
      await api.addCompanyProduct(companyId, productFormData);
      setShowAddProductModal(false);
      fetchCompanyDetails();
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleAddPolicy = async () => {
    try {
      await api.addCompanyPolicy(companyId, policyFormData);
      setShowAddPolicyModal(false);
      fetchCompanyDetails();
      toast.success('Policy added successfully');
    } catch (error) {
      console.error('Error adding policy:', error);
      toast.error('Failed to add policy');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteCompanyProduct(companyId, productId);
        fetchCompanyDetails();
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleDeletePolicy = async (policyId) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await api.deleteCompanyPolicy(companyId, policyId);
        fetchCompanyDetails();
        toast.success('Policy deleted successfully');
      } catch (error) {
        console.error('Error deleting policy:', error);
        toast.error('Failed to delete policy');
      }
    }
  };

  const getPolicyIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'medical': return <Heart size={20} />;
      case 'motor': return <Car size={20} />;
      case 'home': return <Home size={20} />;
      case 'travel': return <Plane size={20} />;
      default: return <Shield size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading company details...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="admin-error">
        <AlertCircle size={48} />
        <h2>Company Not Found</h2>
        <p>The company you're looking for doesn't exist.</p>
        <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/companies')}>
          Back to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="admin-company-detail">
      {/* Header */}
      <div className="admin-company-header">
        <div className="admin-company-nav">
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/companies')}>
            <ArrowLeft size={20} />
            Back to Companies
          </button>
          <div className="admin-company-actions">
            {editMode ? (
              <>
                <button className="admin-btn admin-btn-success" onClick={handleSaveCompany}>
                  <Save size={20} />
                  Save Changes
                </button>
                <button className="admin-btn admin-btn-secondary" onClick={() => setEditMode(false)}>
                  <X size={20} />
                  Cancel
                </button>
              </>
            ) : (
              <button className="admin-btn admin-btn-primary" onClick={() => setEditMode(true)}>
                <Edit2 size={20} />
                Edit Company
              </button>
            )}
          </div>
        </div>

        <div className="admin-company-info">
          <div className="admin-company-logo">
            <img src={company.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80'}
              alt={company.displayName} />
          </div>
          <div className="admin-company-details">
            <h1>{company.displayName}</h1>
            <p className="admin-company-name">{company.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={20} />
          Overview
        </button>
        <button
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={20} />
          Products ({company.company_plans?.length || 0})
        </button>
        <button
          className={`admin-tab ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          <FileText size={20} />
          Policies ({company.policies?.length || 0})
        </button>
        <button
          className={`admin-tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <TrendingUp size={20} />
          Performance
        </button>
        <button
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="admin-overview">
            {/* Stats Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <Package size={32} />
                </div>
                <div className="admin-stat-content">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <FileText size={32} />
                </div>
                <div className="admin-stat-content">
                  <h3>{stats.totalPolicies}</h3>
                  <p>Total Policies</p>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <Users size={32} />
                </div>
                <div className="admin-stat-content">
                  <h3>{stats.activePolicies}</h3>
                  <p>Active Policies</p>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <DollarSign size={32} />
                </div>
                <div className="admin-stat-content">
                  <h3>Ksh {stats.totalRevenue.toLocaleString()}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="admin-info-section">
              <h2>Company Information</h2>
              <div className="admin-info-grid">
                <div className="admin-info-card">
                  <h3>Basic Details</h3>
                  {editMode ? (
                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Display Name</label>
                        <input
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          className="admin-form-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Website</label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="admin-form-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Founded</label>
                        <input
                          type="text"
                          name="founded"
                          value={formData.founded}
                          onChange={handleInputChange}
                          className="admin-form-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Headquarters</label>
                        <input
                          type="text"
                          name="headquarters"
                          value={formData.headquarters}
                          onChange={handleInputChange}
                          className="admin-form-input"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="admin-info-list">
                      <div className="admin-info-item">
                        <strong>Website:</strong>
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="admin-info-card">
                  <h3>Contact Information</h3>
                  {editMode ? (
                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Phone</label>
                        <input
                          type="text"
                          name="contact.phone"
                          value={formData.contact.phone}
                          onChange={handleInputChange}
                          className="admin-form-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="contact.email"
                          value={formData.contact.email}
                          onChange={handleInputChange}
                          className="admin-form-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          name="contact.address"
                          value={formData.contact.address}
                          onChange={handleInputChange}
                          className="admin-form-input"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="admin-info-list">
                      <div className="admin-info-item">
                        <strong>Phone:</strong>
                        <span>{company.contact?.phone || 'Not specified'}</span>
                      </div>
                      <div className="admin-info-item">
                        <strong>Email:</strong>
                        <span>{company.contact?.email || 'Not specified'}</span>
                      </div>
                      <div className="admin-info-item">
                        <strong>Address:</strong>
                        <span>{company.contact?.address || 'Not specified'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-info-card full-width">
                <h3>Description</h3>
                {editMode ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="admin-form-textarea"
                    rows="4"
                  />
                ) : (
                  <p>{company.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="admin-products">
            <div className="admin-section-header">
              <h2>Products Management</h2>
              <button className="admin-btn admin-btn-primary" onClick={() => setShowAddProductModal(true)}>
                <Plus size={20} />
                Add Product
              </button>
            </div>

            <div className="admin-search-filter">
              <div className="admin-search">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className="admin-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Products</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="popular">Popular</option>
              </select>
            </div>

            <div className="admin-products-grid">
              {company.company_plans?.filter(product =>
                product.branded_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((product, index) => (
                <div key={index} className="admin-product-card">
                  <div className="admin-product-header">
                    <h3>{product.branded_name || product.generic_product_id?.title || `Product ${index + 1}`}</h3>
                    <div className="admin-product-actions">
                      <button className="admin-btn-icon" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="admin-btn-icon admin-btn-icon-danger"
                        onClick={() => handleDeleteProduct(product._id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="admin-product-body">
                    <p>{product.description || 'No description available'}</p>
                    <div className="admin-product-details">
                      <div className="admin-product-detail">
                        <DollarSign size={16} />
                        <span>{product.premium || 'Not specified'}</span>
                      </div>
                      <div className="admin-product-detail">
                        <Shield size={16} />
                        <span>{product.coverage || 'Standard coverage'}</span>
                      </div>
                    </div>
                    {product.popular && (
                      <div className="admin-product-badge">
                        <Award size={14} />
                        Popular
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="admin-policies">
            <div className="admin-section-header">
              <h2>Policies Management</h2>
              <button className="admin-btn admin-btn-primary" onClick={() => setShowAddPolicyModal(true)}>
                <Plus size={20} />
                Add Policy
              </button>
            </div>

            <div className="admin-policies-grid">
              {company.policies?.map((policy, index) => (
                <div key={index} className="admin-policy-card">
                  <div className="admin-policy-header">
                    <div className="admin-policy-icon">
                      {getPolicyIcon(policy.category)}
                    </div>
                    <div className="admin-policy-actions">
                      <button className="admin-btn-icon" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="admin-btn-icon admin-btn-icon-danger"
                        onClick={() => handleDeletePolicy(policy._id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="admin-policy-body">
                    <h3>{policy.title || `Policy ${index + 1}`}</h3>
                    <p>{policy.description}</p>
                    <div className="admin-policy-details">
                      <div className="admin-policy-detail">
                        <DollarSign size={16} />
                        <span>{policy.premium || 'Contact for pricing'}</span>
                      </div>
                      <div className="admin-policy-detail">
                        <Shield size={16} />
                        <span>{policy.coverage || 'Standard coverage'}</span>
                      </div>
                    </div>
                    <div className="admin-policy-meta">
                      <span className="admin-policy-type">{policy.type}</span>
                      <span className="admin-policy-category">{policy.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="admin-performance">
            <h2>Performance Analytics</h2>
            <div className="admin-performance-grid">
              <div className="admin-performance-card">
                <h3>Sales Overview</h3>
                <div className="admin-performance-chart">
                  <div className="admin-chart-placeholder">
                    <BarChart3 size={48} />
                    <p>Sales chart will be displayed here</p>
                  </div>
                </div>
              </div>
              <div className="admin-performance-card">
                <h3>Claims Analysis</h3>
                <div className="admin-performance-chart">
                  <div className="admin-chart-placeholder">
                    <PieChart size={48} />
                    <p>Claims distribution chart</p>
                  </div>
                </div>
              </div>
              <div className="admin-performance-card">
                <h3>Customer Satisfaction</h3>
                <div className="admin-performance-metrics">
                  <div className="admin-metric">
                    <div className="admin-metric-value">4.5</div>
                    <div className="admin-metric-label">Average Rating</div>
                  </div>
                  <div className="admin-metric">
                    <div className="admin-metric-value">92%</div>
                    <div className="admin-metric-label">Satisfaction Rate</div>
                  </div>
                  <div className="admin-metric">
                    <div className="admin-metric-value">24h</div>
                    <div className="admin-metric-label">Avg Response Time</div>
                  </div>
                </div>
              </div>
              <div className="admin-performance-card">
                <h3>Recent Activity</h3>
                <div className="admin-activity-list">
                  <div className="admin-activity-item">
                    <div className="admin-activity-icon">
                      <CheckCircle size={16} />
                    </div>
                    <div className="admin-activity-content">
                      <p>New policy sold</p>
                      <small>2 hours ago</small>
                    </div>
                  </div>
                  <div className="admin-activity-item">
                    <div className="admin-activity-icon">
                      <AlertCircle size={16} />
                    </div>
                    <div className="admin-activity-content">
                      <p>Claim filed</p>
                      <small>5 hours ago</small>
                    </div>
                  </div>
                  <div className="admin-activity-item">
                    <div className="admin-activity-icon">
                      <UserCheck size={16} />
                    </div>
                    <div className="admin-activity-content">
                      <p>New customer registered</p>
                      <small>1 day ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="admin-settings">
            <h2>Company Settings</h2>
            <div className="admin-settings-grid">
              <div className="admin-settings-card">
                <h3>General Settings</h3>
                <div className="admin-settings-list">
                  <div className="admin-setting-item">
                    <label>Company Status</label>
                    <select className="admin-form-select">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="admin-setting-item">
                    <label>Featured Company</label>
                    <input type="checkbox" />
                  </div>
                  <div className="admin-setting-item">
                    <label>Auto-approve Policies</label>
                    <input type="checkbox" />
                  </div>
                </div>
              </div>

              <div className="admin-settings-card">
                <h3>Notification Settings</h3>
                <div className="admin-settings-list">
                  <div className="admin-setting-item">
                    <label>Email Notifications</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="admin-setting-item">
                    <label>SMS Notifications</label>
                    <input type="checkbox" />
                  </div>
                  <div className="admin-setting-item">
                    <label>Monthly Reports</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="admin-settings-card">
                <h3>Integration Settings</h3>
                <div className="admin-settings-list">
                  <div className="admin-setting-item">
                    <label>Payment Gateway</label>
                    <select className="admin-form-select">
                      <option value="mpesa">M-Pesa</option>
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                  <div className="admin-setting-item">
                    <label>CRM Integration</label>
                    <input type="checkbox" />
                  </div>
                  <div className="admin-setting-item">
                    <label>Analytics Tracking</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Add New Product</h2>
              <button className="admin-btn-icon" onClick={() => setShowAddProductModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="admin-form">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={productFormData.branded_name}
                    onChange={(e) => setProductFormData(prev => ({ ...prev, branded_name: e.target.value }))}
                    className="admin-form-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Premium</label>
                  <input
                    type="text"
                    value={productFormData.premium}
                    onChange={(e) => setProductFormData(prev => ({ ...prev, premium: e.target.value }))}
                    className="admin-form-input"
                    placeholder="e.g., Ksh 5,000/year"
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  value={productFormData.description}
                  onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="admin-form-textarea"
                  rows="3"
                />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Policy Modal */}
      {showAddPolicyModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Add New Policy</h2>
              <button className="admin-btn-icon" onClick={() => setShowAddPolicyModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPolicy} className="admin-form">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Policy Title</label>
                  <input
                    type="text"
                    value={policyFormData.title}
                    onChange={(e) => setPolicyFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="admin-form-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Policy Type</label>
                  <select
                    value={policyFormData.type}
                    onChange={(e) => setPolicyFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="admin-form-select"
                    required
                  >
                    <option value="">Select type...</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="third-party">Third Party</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  value={policyFormData.description}
                  onChange={(e) => setPolicyFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="admin-form-textarea"
                  rows="3"
                />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddPolicyModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Add Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanyDetail;
