import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Save, Eye } from 'lucide-react';
import api from '../services/api';
import LucideIcon from '../components/LucideIcon';
import ImageUpload from '../components/ImageUpload';
import '../components/ImageUpload.css';
import './AdminDashboard.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    features: [],
    benefits: [],
    coverage: '',
    premium: '',
    icon: '',
    image: '',
    popular: false,
    eligibility: {
      lowerLimit: '',
      upperLimit: ''
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setFormData({
      id: '',
      title: '',
      category: '',
      shortDescription: '',
      description: '',
      features: [],
      benefits: [],
      coverage: '',
      premium: '',
      icon: '',
      image: '',
      popular: false,
      eligibility: {
        lowerLimit: '',
        upperLimit: ''
      }
    });
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      id: product.id,
      title: product.title,
      category: product.category,
      shortDescription: product.shortDescription || '',
      description: product.description,
      features: product.features || [],
      benefits: product.benefits || [],
      coverage: product.coverage,
      premium: product.premium,
      icon: product.icon,
      image: product.image,
      popular: product.popular || false,
      eligibility: product.eligibility || {
        lowerLimit: '',
        upperLimit: ''
      }
    });
    setShowEditModal(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      try {
        await api.deleteProduct(product.id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showAddModal) {
        await api.createProduct(formData);
      } else {
        await api.updateProduct(selectedProduct.id, formData);
      }
      fetchProducts();
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('eligibility.')) {
      const eligibilityField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          [eligibilityField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const filteredProducts = products.filter(product =>
    (product.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="admin-loading">Loading products...</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-header-content">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage insurance products</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAddProduct}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Premium</th>
              <th>Popular</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div className="admin-product-title">
                    <div className="admin-product-icon-preview">
                      <LucideIcon name={product.icon} size={16} />
                    </div>
                    <div>
                      <strong>{product.title}</strong>
                      {product.shortDescription && (
                        <small>{product.shortDescription}</small>
                      )}
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>{product.premium}</td>
                <td>
                  <span className={`admin-badge ${product.popular ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                    {product.popular ? 'Popular' : 'Standard'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleViewProduct(product)}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleEditProduct(product)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="admin-btn-icon admin-btn-icon-danger"
                      onClick={() => handleDeleteProduct(product)}
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
              <h2>{showAddModal ? 'Add Product' : 'Edit Product'}</h2>
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
                <h3 className="admin-form-section-title">Basic Information</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Product ID</label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="e.g., 1, 2, 3"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Enter product title"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="e.g., Health Insurance, Auto Insurance"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Premium</label>
                    <input
                      type="text"
                      name="premium"
                      value={formData.premium}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="e.g., $50/month, $500/year"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Descriptions</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Short Description</label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="Brief summary (optional)"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Full Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="admin-form-textarea"
                    rows="4"
                    placeholder="Detailed product description"
                    required
                  />
                </div>
              </div>

              {/* Features and Benefits */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Features & Benefits</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Features (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.features.join(', ')}
                    onChange={(e) => handleArrayChange('features', e.target.value)}
                    className="admin-form-input"
                    placeholder="Feature 1, Feature 2, Feature 3"
                  />
                  <small className="admin-form-counter">Add product features separated by commas</small>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Benefits (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.benefits.join(', ')}
                    onChange={(e) => handleArrayChange('benefits', e.target.value)}
                    className="admin-form-input"
                    placeholder="Benefit 1, Benefit 2, Benefit 3"
                  />
                  <small className="admin-form-counter">Add customer benefits separated by commas</small>
                </div>
              </div>

              {/* Coverage */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Coverage Details</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Coverage Information</label>
                  <textarea
                    name="coverage"
                    value={formData.coverage}
                    onChange={handleInputChange}
                    className="admin-form-textarea"
                    rows="3"
                    placeholder="What this product covers..."
                    required
                  />
                </div>
              </div>

              {/* Visual Assets */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Visual Assets</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Icon Name</label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Heart, Shield, Home, etc."
                      required
                    />
                    <small className="admin-form-counter">Lucide icon name without .svg</small>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Product Image</label>
                    <ImageUpload
                      value={formData.image}
                      onChange={(imageData) => setFormData(prev => ({ ...prev, image: imageData }))}
                      onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                      placeholder="Drag & drop product image here or click to browse"
                      className="admin-image-upload"
                    />
                    <small className="admin-form-counter">Upload product image with drag & drop or copy & paste</small>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Product Options</h3>
                <div className="admin-form-group">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                    />
                    <span>Mark as Popular Product</span>
                  </label>
                  <small className="admin-form-counter">Popular products will be highlighted on the website</small>
                </div>
              </div>

              {/* Eligibility */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Eligibility Criteria</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Minimum Age</label>
                    <input
                      type="text"
                      name="eligibility.lowerLimit"
                      value={formData.eligibility.lowerLimit}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="e.g., 18 years"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Maximum Age</label>
                    <input
                      type="text"
                      name="eligibility.upperLimit"
                      value={formData.eligibility.upperLimit}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="e.g., 70 years"
                    />
                  </div>
                </div>
                <small className="admin-form-counter">Specify age eligibility requirements for this product</small>
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
                  {showAddModal ? 'Add Product' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedProduct && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Product Details</h2>
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
                    <strong>ID:</strong> {selectedProduct.id}
                  </div>
                  <div>
                    <strong>Title:</strong> {selectedProduct.title}
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedProduct.category}
                  </div>
                  <div>
                    <strong>Premium:</strong> {selectedProduct.premium}
                  </div>
                  <div>
                    <strong>Popular:</strong> {selectedProduct.popular ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              <div className="admin-view-section">
                <h3>Description</h3>
                <p>{selectedProduct.description}</p>
              </div>

              {selectedProduct.shortDescription && (
                <div className="admin-view-section">
                  <h3>Short Description</h3>
                  <p>{selectedProduct.shortDescription}</p>
                </div>
              )}

              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div className="admin-view-section">
                  <h3>Features</h3>
                  <ul>
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProduct.benefits && selectedProduct.benefits.length > 0 && (
                <div className="admin-view-section">
                  <h3>Benefits</h3>
                  <ul>
                    {selectedProduct.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="admin-view-section">
                <h3>Coverage</h3>
                <p>{selectedProduct.coverage}</p>
              </div>

              {selectedProduct.eligibility && (
                <div className="admin-view-section">
                  <h3>Eligibility Criteria</h3>
                  <div className="admin-view-grid">
                    <div>
                      <strong>Minimum Age:</strong> {selectedProduct.eligibility.lowerLimit || 'Not specified'}
                    </div>
                    <div>
                      <strong>Maximum Age:</strong> {selectedProduct.eligibility.upperLimit || 'Not specified'}
                    </div>
                  </div>
                </div>
              )}

              <div className="admin-view-section">
                <h3>Visual</h3>
                <div className="admin-view-grid">
                  <div>
                    <strong>Icon:</strong> <LucideIcon name={selectedProduct.icon} size={20} /> ({selectedProduct.icon})
                  </div>
                  <div>
                    <strong>Image:</strong>
                    <br />
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      style={{ maxWidth: '200px', marginTop: '8px' }}
                    />
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

export default AdminProducts;
