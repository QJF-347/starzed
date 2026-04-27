import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  X,
  Globe,
  Phone,
  Mail,
  Star,
  Package,
  Shield,
  CheckCircle,
  Users,
  Settings,
  FileText,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';
import '../components/ImageUpload.css';
import './AdminDashboard.css';

const getValidLogoUrl = (logo) => {
  if (!logo) return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';

  // Check for invalid base64 URLs
  if (logo.startsWith('data:image/png;base') && logo.length < 50) {
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';
  }

  // Check for other invalid data URLs
  if (logo.startsWith('data:') && !logo.includes('base64,')) {
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';
  }

  return logo;
};

const AdminCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    logo: '',
    website: '',
    policies: [],
    company_plans: [],
    description: '',
    contact: {
      phone: '',
      email: '',
      address: ''
    }
  });

  // Product form state
  const [productFormData, setProductFormData] = useState({
    productName: '',
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

  useEffect(() => {
    fetchCompanies();
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = companies.filter(company =>
      (company.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [companies, searchTerm]);

  const fetchCompanies = async () => {
    try {
      const response = await api.getCompanies();
      setCompanies(response.data);
      setFilteredCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts();
      setAvailableProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const handleAddCompany = () => {
    setFormData({
      name: '',
      displayName: '',
      logo: '',
      website: '',
      policies: [],
      company_plans: [],
      description: '',
      founded: '',
      headquarters: '',
      contact: {
        phone: '',
        email: '',
        address: ''
      }
    });
    setShowAddModal(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      displayName: company.displayName,
      logo: company.logo,
      website: company.website,
      policies: company.policies,
      company_plans: company.company_plans,
      description: company.description,
      contact: company.contact
    });
    setShowEditModal(true);
  };

  // Product Management Functions
  const handleAddProduct = () => {
    setProductFormData({
      productName: '',
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
    setShowAddProductModal(true);
  };

  const handleEditProduct = (company) => {
    setSelectedCompany(company);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        // Update existing product
        await api.updateCompanyProduct(selectedCompany._id, selectedProduct._id, productFormData);
        toast.success('Product updated successfully');
      } else {
        // Add new product to company
        await api.addCompanyProduct(selectedCompany._id, productFormData);
        toast.success('Product added successfully');
      }
      setShowProductModal(false);
      fetchCompanies(); // Refresh companies list
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  const handleDeleteProduct = async (companyId, productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteCompanyProduct(companyId, productId);
        toast.success('Product deleted successfully');
        fetchCompanies(); // Refresh companies list
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      // Handle nested fields
      const [parent, child] = name.split('.');
      setProductFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle regular fields
      setProductFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleEditProductDetail = (company, product) => {
    setSelectedProduct(product);
    setProductFormData({
      productName: product.generic_product_id?.title || '',
      branded_name: product.branded_name || '',
      description: product.description || '',
      features: product.features || [],
      benefits: product.benefits || [],
      coverage: product.coverage || '',
      premium: product.premium || '',
      image: product.image || '',
      popular: product.popular || false,
      eligibility: product.eligibility || {
        ageRange: '',
        occupation: '',
        medical: '',
        other: ''
      },
      coverageDetails: product.coverageDetails || {
        death: '',
        disability: '',
        medical: '',
        accidental: ''
      }
    });
    setShowProductModal(false);
    setShowAddProductModal(true);
  };

  const handleManageCompany = (company) => {
    navigate(`/admin/companies/${company._id}`);
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setShowViewModal(true);
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
    } else if (name === 'policies' || name === 'company_plans') {
      // Handle array fields as comma-separated values
      const values = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({
        ...prev,
        [name]: values
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEditModal && selectedCompany) {
        await api.updateCompany(selectedCompany._id, formData);
        toast.success('Company updated successfully');
      } else {
        await api.createCompany(formData);
        toast.success('Company created successfully');
      }
      resetForm();
      fetchCompanies();
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Failed to save company');
    }
  };

  const handleDeleteCompany = async (company) => {
    if (window.confirm(`Are you sure you want to delete "${company.displayName}"?`)) {
      try {
        await api.deleteCompany(company._id);
        toast.success('Company deleted successfully');
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        toast.error('Failed to delete company');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      logo: '',
      website: '',
      policies: [],
      company_plans: [],
      description: '',
      contact: {
        phone: '',
        email: '',
        address: ''
      }
    });
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedCompany(null);
  };

  if (loading) {
    return <div className="admin-loading">Loading companies...</div>;
  }

  return (
    <div className="admin-companies">
      <div className="admin-header-content">
        <div>
          <h1 className="admin-page-title">Companies</h1>
          <p className="admin-page-subtitle">Manage insurance companies</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAddCompany}>
          <Plus size={20} />
          Add Company
        </button>
      </div>

      {/* Search and Filter */}
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Companies Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Website</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company._id}>
                <td>
                  <div className="admin-company-info-cell">
                    <div className="admin-company-logo-small">
                      <img src={getValidLogoUrl(company.logo)} alt={company.name} onError={(e) => {
                        const initial = company.name?.charAt(0)?.toUpperCase() || 'C';
                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%236b7280'%3E${initial}%3C/text%3E%3C/svg%3E`;
                      }} />
                    </div>
                    <div>
                      <strong>{company.displayName}</strong>
                      <small>{company.name}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="admin-link">
                    <Globe size={14} />
                    Visit Website
                  </a>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleViewCompany(company)}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="admin-btn-icon admin-btn-icon-success"
                      onClick={() => handleManageCompany(company)}
                      title="Manage Company"
                    >
                      <Settings size={16} />
                    </button>
                    <button
                      className="admin-btn-icon admin-btn-icon-primary"
                      onClick={() => handleEditProduct(company)}
                      title="Manage Products"
                    >
                      <Package size={16} />
                    </button>
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleEditCompany(company)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="admin-btn-icon admin-btn-icon-danger"
                      onClick={() => handleDeleteCompany(company)}
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

      {filteredCompanies.length === 0 && (
        <div className="admin-empty-state">
          <Building2 size={48} />
          <h3>No companies found</h3>
          <p>Try adjusting your search or add a new company to get started.</p>
          <button className="admin-btn admin-btn-primary" onClick={handleAddCompany}>
            <Plus size={16} />
            Add Company
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>{showAddModal ? 'Add Company' : 'Edit Company'}</h2>
              <button
                className="admin-btn-icon"
                onClick={resetForm}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              {/* Basic Information */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Basic Information</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Company Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="e.g., starzed_insurance"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Display Name</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="e.g., Starzed Insurance"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Company Logo</label>
                    <ImageUpload
                      value={formData.logo}
                      onChange={(logoData) => setFormData(prev => ({ ...prev, logo: logoData }))}
                      onRemove={() => setFormData(prev => ({ ...prev, logo: '' }))}
                      placeholder="Drag & drop company logo here or click to browse"
                      className="admin-logo-upload"
                    />
                    <small className="admin-form-counter">Upload company logo with drag & drop or copy & paste</small>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                                  </div>
              </div>

              {/* Description */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Description</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Company Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="admin-form-textarea"
                    rows="4"
                    placeholder="Enter company description..."
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Contact Information</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone</label>
                    <input
                      type="text"
                      name="contact.phone"
                      value={formData.contact.phone}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email</label>
                    <input
                      type="email"
                      name="contact.email"
                      value={formData.contact.email}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Address</label>
                  <input
                    type="text"
                    name="contact.address"
                    value={formData.contact.address}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
              </div>

              {/* Policies and Products */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Policies & Products</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Policies (comma-separated)</label>
                  <input
                    type="text"
                    name="policies"
                    value={formData.policies.join(', ')}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="Medical Insurance, Motor Insurance, Life Insurance"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Plans (comma-separated IDs)</label>
                  <input
                    type="text"
                    name="company_plans"
                    value={formData.company_plans.join(', ')}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="1, 2, 3"
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {showAddModal ? 'Create Company' : 'Update Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedCompany && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Company Details</h2>
              <button
                className="admin-btn-icon"
                onClick={resetForm}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-view-section">
                <div className="admin-company-view-header">
                  <div className="admin-company-logo-large">
                    <img src={selectedCompany.logo} alt={selectedCompany.name} onError={(e) => {
                      const initial = selectedCompany.name?.charAt(0)?.toUpperCase() || 'C';
                      e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='28' fill='%236b7280'%3E${initial}%3C/text%3E%3C/svg%3E`;
                    }} />
                  </div>
                  <div className="admin-company-view-info">
                    <h3>{selectedCompany.displayName}</h3>
                    <p>{selectedCompany.name}</p>
                  </div>
                </div>
              </div>

              <div className="admin-view-section">
                <h4>Basic Information</h4>
                <div className="admin-info-grid">
                  <div className="admin-info-item">
                    <strong>Website:</strong>
                    <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">
                      {selectedCompany.website}
                    </a>
                  </div>
                  <div className="admin-info-item">
                    <strong>Founded:</strong>
                    <span>{selectedCompany.founded || 'Not specified'}</span>
                  </div>
                  <div className="admin-info-item">
                    <strong>Headquarters:</strong>
                    <span>{selectedCompany.headquarters || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="admin-view-section">
                <h4>Description</h4>
                <p>{selectedCompany.description}</p>
              </div>

              <div className="admin-view-section">
                <h4>Contact Information</h4>
                <div className="admin-info-grid">
                  <div className="admin-info-item">
                    <strong>Phone:</strong>
                    <span>{selectedCompany.contact?.phone || 'Not specified'}</span>
                  </div>
                  <div className="admin-info-item">
                    <strong>Email:</strong>
                    <span>{selectedCompany.contact?.email || 'Not specified'}</span>
                  </div>
                  <div className="admin-info-item">
                    <strong>Address:</strong>
                    <span>{selectedCompany.contact?.address || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="admin-view-section">
                <h4>Policies</h4>
                <div className="admin-policy-list">
                  {selectedCompany.policies?.length > 0 ? (
                    selectedCompany.policies.map((policy, index) => (
                      <span key={index} className="admin-badge admin-badge-secondary">
                        {policy.title || policy}
                      </span>
                    ))
                  ) : (
                    <span className="admin-text-muted">No policies available</span>
                  )}
                </div>
              </div>

              <div className="admin-view-section">
                <h4>Products</h4>
                <div className="admin-product-list">
                  {selectedCompany.products?.length > 0 ? (
                    selectedCompany.products.map((productId, index) => (
                      <span key={index} className="admin-badge admin-badge-primary">
                        Product ID: {productId}
                      </span>
                    ))
                  ) : (
                    <span className="admin-text-muted">No products available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Management Modal */}
      {showProductModal && (
        <div className="admin-modal">
          <div className="admin-modal-content admin-modal-large">
            <div className="admin-modal-header">
              <h2>Manage Products - {selectedCompany?.displayName}</h2>
              <button className="admin-modal-close" onClick={() => setShowProductModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Current Products */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Current Plans</h3>
                <div className="admin-product-grid">
                  {selectedCompany?.company_plans?.length > 0 ? (
                    selectedCompany.company_plans.map((product, index) => (
                      <div key={index} className="admin-product-card">
                        <div className="admin-product-header">
                          <h4>{product.branded_name || product.generic_product_id?.title || `Plan ${index + 1}`}</h4>
                          <div className="admin-product-actions">
                            <button
                              className="admin-btn-icon admin-btn-icon-small"
                              onClick={() => handleEditProductDetail(selectedCompany, product)}
                              title="Edit Plan"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="admin-btn-icon admin-btn-icon-small admin-btn-icon-danger"
                              onClick={() => handleDeleteProduct(selectedCompany._id, product._id)}
                              title="Delete Plan"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="admin-product-details">
                          <p><strong>Description:</strong> {product.description || 'No description'}</p>
                          <p><strong>Premium:</strong> {product.premium || 'Not specified'}</p>
                          <p><strong>Coverage:</strong> {product.coverage || 'Not specified'}</p>
                          {product.features?.length > 0 && (
                            <div className="admin-product-features">
                              <strong>Features:</strong>
                              <ul>
                                {product.features.map((feature, idx) => (
                                  <li key={idx}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="admin-text-muted">No plans available</p>
                  )}
                </div>

                <div className="admin-form-actions">
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setShowAddProductModal(true)}
                  >
                    <Plus size={16} />
                    Add New Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddProductModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Add Product - {selectedCompany?.displayName}</h2>
              <button className="admin-modal-close" onClick={() => setShowAddProductModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="admin-form">
              {/* Product Selection */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Product Information</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Select Product</label>
                    <select
                      name="productName"
                      value={productFormData.productName}
                      onChange={handleProductInputChange}
                      className="admin-form-select"
                      required
                    >
                      <option value="">Choose a product...</option>
                      {availableProducts.map(product => (
                        <option key={product._id} value={product.title}>
                          {product.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Custom Name</label>
                    <input
                      type="text"
                      name="customName"
                      value={productFormData.customName}
                      onChange={handleProductInputChange}
                      className="admin-form-input"
                      placeholder="Custom product name for this company"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Custom Description</label>
                    <textarea
                      name="customDescription"
                      value={productFormData.customDescription}
                      onChange={handleProductInputChange}
                      className="admin-form-textarea"
                      rows="3"
                      placeholder="Custom description for this company"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Premium Information</label>
                    <input
                      type="text"
                      name="customPremium"
                      value={productFormData.customPremium}
                      onChange={handleProductInputChange}
                      className="admin-form-input"
                      placeholder="e.g., KES 5,000 per year"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Coverage Details</label>
                    <textarea
                      name="customCoverage"
                      value={productFormData.customCoverage}
                      onChange={handleProductInputChange}
                      className="admin-form-textarea"
                      rows="3"
                      placeholder="Detailed coverage information"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Product Image URL</label>
                    <input
                      type="url"
                      name="customImage"
                      value={productFormData.customImage}
                      onChange={handleProductInputChange}
                      className="admin-form-input"
                      placeholder="https://example.com/product-image.jpg"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-checkbox">
                      <input
                        type="checkbox"
                        name="popular"
                        checked={productFormData.popular}
                        onChange={handleProductInputChange}
                      />
                      Mark as Popular Product
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAddProductModal(false)}>
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
    </div>
  );
};

export default AdminCompanies;
