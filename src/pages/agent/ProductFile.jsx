import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileSpreadsheet, Plus, Search, Shield, Building, DollarSign, TrendingUp, Eye, Edit, Trash2, X, Upload, Star, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import apiService from '../../services/api';
import './ProductFile.css';

const ProductFile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const response = await apiService.getProducts();
    const data = Array.isArray(response?.data) ? response.data : [];
    setProducts(data);
  };

  useEffect(() => {
    loadProducts().catch((e) => {
      console.error('Failed to load products:', e);
    });
  }, []);

  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    insurer: '',
    minRate: '',
    maxRate: ''
  });

  const insurers = ['Jubilee Insurance', 'APA Insurance', 'UAP Old Mutual', 'Britam', 'CIC Insurance', 'GA Insurance', 'Madison Insurance', 'ICEA Lion'];

  const filteredProducts = products.filter(product =>
    (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProduct = async () => {
    if (newProduct.productName && newProduct.description && newProduct.insurer && newProduct.minRate && newProduct.maxRate) {
      try {
        await apiService.request('/products/create/', {
          method: 'POST',
          body: JSON.stringify({
            title: newProduct.productName,
            category: newProduct.insurer,
            shortDescription: newProduct.description,
            description: newProduct.description,
            premium: String(newProduct.minRate || ''),
          }),
        });
        await loadProducts();
        setNewProduct({ productName: '', description: '', insurer: '', minRate: '', maxRate: '' });
        setShowAddModal(false);
      } catch (e) {
        console.error('Failed to create product:', e);
        alert(e?.message || 'Failed to create product');
      }
    }
  };

  const handleEditProduct = async () => {
    if (editingProduct && editingProduct.title && editingProduct.description && editingProduct.category) {
      try {
        await apiService.request(`/products/${editingProduct.id}/update/`, {
          method: 'PUT',
          body: JSON.stringify({
            title: editingProduct.title,
            category: editingProduct.category,
            shortDescription: editingProduct.description,
            description: editingProduct.description,
            premium: String(editingProduct.premium || ''),
          }),
        });
        await loadProducts();
        setEditingProduct(null);
        setShowEditModal(false);
      } catch (e) {
        console.error('Failed to update product:', e);
        alert(e?.message || 'Failed to update product');
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({...product});
    setShowEditModal(true);
  };

  const openViewModal = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await apiService.request(`/products/${productId}/delete/`, {
        method: 'DELETE',
      });
      await loadProducts();
    } catch (e) {
      console.error('Failed to delete product:', e);
      alert(e?.message || 'Failed to delete product');
    }
  };

  const exportToExcel = () => {
    const data = products.map(product => ({
      'Product Name/Description': `${product.title || ''} - ${product.description || ''}`,
      'Insurer': product.category || '',
      'Min Rate': product.premium || '',
      'Max Rate': product.premium || ''
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `product_file_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImportFile(file);
      parseFile(file);
    }
  };

  const parseFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      let headers = [];
      let data = [];
      const errors = [];

      try {
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Parse Excel file
          const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            setImportErrors(['Excel file must contain at least a header row and one data row']);
            setImportPreview([]);
            return;
          }
          
          headers = jsonData[0].map(h => String(h).trim());
          data = jsonData.slice(1);
        } else if (file.name.endsWith('.csv')) {
          // Parse CSV file
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            setImportErrors(['CSV file must contain at least a header row and one data row']);
            setImportPreview([]);
            return;
          }
          
          headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          data = lines.slice(1).map(line => line.split(',').map(v => v.trim().replace(/"/g, '')));
        } else {
          setImportErrors(['Please upload a valid CSV or Excel file']);
          setImportPreview([]);
          return;
        }

        // Find the product name/description column
        const nameColumnIndex = headers.findIndex(h => 
          h.toLowerCase().includes('product') && 
          (h.toLowerCase().includes('name') || h.toLowerCase().includes('description'))
        );

        if (nameColumnIndex === -1) {
          errors.push('File must contain a column with "Product Name" or "Product Description" in the header');
          setImportErrors(errors);
          setImportPreview([]);
          return;
        }

        const parsedProducts = [];

        for (let i = 0; i < data.length; i++) {
          const values = data[i];
          const productName = String(values[nameColumnIndex] ?? '').trim();

          if (!productName) {
            errors.push(`Row ${i + 2}: Product name/description is required`);
            continue;
          }

          // Extract other optional columns
          const insurerIndex = headers.findIndex(h => h.toLowerCase().includes('insurer'));
          const minRateIndex = headers.findIndex(h => h.toLowerCase().includes('min') && h.toLowerCase().includes('rate'));
          const maxRateIndex = headers.findIndex(h => h.toLowerCase().includes('max') && h.toLowerCase().includes('rate'));
          const descriptionIndex = headers.findIndex(h => h.toLowerCase().includes('description'));

          const product = {
            productName: productName,
            description: descriptionIndex !== -1 && values[descriptionIndex] ? String(values[descriptionIndex]).trim() : productName,
            insurer: insurerIndex !== -1 && values[insurerIndex] ? String(values[insurerIndex]).trim() : 'Unknown',
            minRate: minRateIndex !== -1 && values[minRateIndex] ? parseFloat(String(values[minRateIndex]).trim()) || 0 : 0,
            maxRate: maxRateIndex !== -1 && values[maxRateIndex] ? parseFloat(String(values[maxRateIndex]).trim()) || 0 : 0
          };

          parsedProducts.push(product);
        }

        setImportPreview(parsedProducts);
        setImportErrors(errors);
      } catch (error) {
        setImportErrors([`Error parsing file: ${error.message}`]);
        setImportPreview([]);
      }
    };

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleImportProducts = async () => {
    if (importPreview.length === 0) return;

    setIsImporting(true);
    
    try {
      // Try to import via API first
      const response = await apiService.bulkImportProducts(importPreview);
      
      if (response.success) {
        await loadProducts();
        
        alert(`Successfully imported ${importPreview.length} products to database!`);
        
        // Close modal and reset state
        setShowImportModal(false);
        setImportFile(null);
        setImportPreview([]);
        setImportErrors([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(response.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import failed:', error);

      const errorMessage = error?.message || '';
      if (errorMessage.includes('Method "POST" not allowed') || errorMessage.includes('405')) {
        alert('Import failed: backend is not accepting imports right now (likely deploying). Please try again in a moment.');
        return;
      }

      alert(errorMessage || 'Import failed. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleContent = 'Product Name/Description,Insurer,Min Rate,Max Rate\n' +
      'Comprehensive Motor Insurance,Jubilee Insurance,50000,200000\n' +
      'Third Party Insurance,APA Insurance,10000,50000\n' +
      'Health Insurance,UAP Old Mutual,20000,100000';

    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'product_import_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="product-file-container">
      {/* Header */}
      <div className="product-file-header">
        <div className="product-file-header-content">
          <div className="product-file-header-left">
            <h1 className="product-file-title">Product File</h1>
            <p className="product-file-subtitle">Manage insurance products and their rate ranges</p>
          </div>
          <div className="product-file-header-actions">
            <button className="product-file-btn" onClick={() => setShowImportModal(true)}>
              <Upload className="product-file-btn-icon" />
              Import Products
            </button>
            <button className="product-file-btn" onClick={exportToExcel}>
              <FileSpreadsheet className="product-file-btn-icon" />
              Export to Excel
            </button>
            <button className="product-file-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus className="product-file-btn-icon" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="product-file-search-section">
        <div className="product-file-search-wrapper">
          <Search className="product-file-search-icon" />
          <input
            type="text"
            placeholder="Search by product name, description, or insurer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="product-file-search-input"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="product-file-stats-grid">
        <div className="product-file-stat-card">
          <div className="product-file-stat-content">
            <div className="product-file-stat-info">
              <p className="product-file-stat-title">Total Products</p>
              <p className="product-file-stat-value">{products.length}</p>
            </div>
            <div className="product-file-stat-icon-wrapper blue">
              <Shield className="product-file-stat-icon" />
            </div>
          </div>
        </div>
        <div className="product-file-stat-card">
          <div className="product-file-stat-content">
            <div className="product-file-stat-info">
              <p className="product-file-stat-title">Active Insurers</p>
              <p className="product-file-stat-value">{insurers.length}</p>
            </div>
            <div className="product-file-stat-icon-wrapper green">
              <Building className="product-file-stat-icon" />
            </div>
          </div>
        </div>
        <div className="product-file-stat-card">
          <div className="product-file-stat-content">
            <div className="product-file-stat-info">
              <p className="product-file-stat-title">Categories</p>
              <p className="product-file-stat-value">
                {[...new Set(products.map(p => p.category))].length}
              </p>
            </div>
            <div className="product-file-stat-icon-wrapper orange">
              <FileText className="product-file-stat-icon" />
            </div>
          </div>
        </div>
        <div className="product-file-stat-card">
          <div className="product-file-stat-content">
            <div className="product-file-stat-info">
              <p className="product-file-stat-title">Popular Products</p>
              <p className="product-file-stat-value">
                {products.filter(p => p.popular).length}
              </p>
            </div>
            <div className="product-file-stat-icon-wrapper purple">
              <Star className="product-file-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="product-file-table-container">
        <div className="product-file-table-wrapper">
          <table className="product-file-table">
            <thead className="product-file-table-head">
              <tr className="product-file-table-row">
                <th className="product-file-table-header">Product Name/Description</th>
                <th className="product-file-table-header">Insurer</th>
                <th className="product-file-table-header">Min Rate</th>
                <th className="product-file-table-header">Max Rate</th>
                <th className="product-file-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="product-file-table-body">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="product-file-table-row">
                  <td className="product-file-table-cell">
                    <div className="product-file-product-info">
                      <div className="product-file-product-name product-name-cell">{product.title}</div>
                      <div className="product-file-product-description text-clamp-2">{product.description}</div>
                    </div>
                  </td>
                  <td className="product-file-table-cell">
                    <div className="product-file-insurer-info">
                      <div className="product-file-insurer-name">{product.category}</div>
                    </div>
                  </td>
                  <td className="product-file-table-cell">
                    <div className="product-file-rate-info">
                      <span className="product-file-rate">KES {(product.premium || '0').toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="product-file-table-cell">
                    <div className="product-file-rate-info">
                      <span className="product-file-rate">KES {(product.premium || '0').toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="product-file-table-cell">
                    <div className="product-file-actions">
                      <button className="product-file-action-btn view" onClick={() => openViewModal(product)}>
                        <Eye className="product-file-action-icon" />
                      </button>
                      <button className="product-file-action-btn edit" onClick={() => openEditModal(product)}>
                        <Edit className="product-file-action-icon" />
                      </button>
                      <button className="product-file-action-btn delete" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="product-file-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="product-file-modal-overlay">
          <div className="product-file-modal">
            <div className="product-file-modal-header">
              <h2 className="product-file-modal-title">Add New Product</h2>
              <button 
                className="product-file-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <X className="product-file-modal-close-icon" />
              </button>
            </div>
            <div className="product-file-modal-body">
              <div className="product-file-form-group">
                <label className="product-file-form-label">Product Name</label>
                <input
                  type="text"
                  className="product-file-form-input"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div className="product-file-form-group">
                <label className="product-file-form-label">Description</label>
                <textarea
                  className="product-file-form-textarea"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>
              <div className="product-file-form-group">
                <label className="product-file-form-label">Insurer</label>
                <select
                  className="product-file-form-select"
                  value={newProduct.insurer}
                  onChange={(e) => setNewProduct({...newProduct, insurer: e.target.value})}
                >
                  <option value="">Select Insurer</option>
                  {insurers.map(insurer => (
                    <option key={insurer} value={insurer}>{insurer}</option>
                  ))}
                </select>
              </div>
              <div className="product-file-form-row">
                <div className="product-file-form-group">
                  <label className="product-file-form-label">Min Rate (KES)</label>
                  <input
                    type="number"
                    className="product-file-form-input"
                    value={newProduct.minRate}
                    onChange={(e) => setNewProduct({...newProduct, minRate: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="product-file-form-group">
                  <label className="product-file-form-label">Max Rate (KES)</label>
                  <input
                    type="number"
                    className="product-file-form-input"
                    value={newProduct.maxRate}
                    onChange={(e) => setNewProduct({...newProduct, maxRate: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="product-file-modal-footer">
              <button 
                className="product-file-btn secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="product-file-btn primary"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="product-file-modal-overlay">
          <div className="product-file-modal">
            <div className="product-file-modal-header">
              <h2 className="product-file-modal-title">Edit Product</h2>
              <button 
                className="product-file-modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
              >
                <X className="product-file-modal-close-icon" />
              </button>
            </div>
            <div className="product-file-modal-body">
              <div className="product-file-form-group">
                <label className="product-file-form-label">Product Name</label>
                <input
                  type="text"
                  className="product-file-form-input"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div className="product-file-form-group">
                <label className="product-file-form-label">Description</label>
                <textarea
                  className="product-file-form-textarea"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>
              <div className="product-file-form-group">
                <label className="product-file-form-label">Insurer</label>
                <select
                  className="product-file-form-select"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                >
                  <option value="">Select Insurer</option>
                  {insurers.map(insurer => (
                    <option key={insurer} value={insurer}>{insurer}</option>
                  ))}
                </select>
              </div>
              <div className="product-file-form-row">
                <div className="product-file-form-group">
                  <label className="product-file-form-label">Min Rate (KES)</label>
                  <input
                    type="number"
                    className="product-file-form-input"
                    value={editingProduct.premium || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, premium: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="product-file-form-group">
                  <label className="product-file-form-label">Max Rate (KES)</label>
                  <input
                    type="number"
                    className="product-file-form-input"
                    value={editingProduct.premium || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, premium: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="product-file-modal-footer">
              <button 
                className="product-file-btn secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="product-file-btn primary"
                onClick={handleEditProduct}
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Products Modal */}
      {showImportModal && (
        <div className="product-file-modal-overlay">
          <div className="product-file-modal import-modal">
            <div className="product-file-modal-header">
              <h2 className="product-file-modal-title">Import Products</h2>
              <button 
                className="product-file-modal-close"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportPreview([]);
                  setImportErrors([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <X className="product-file-modal-close-icon" />
              </button>
            </div>
            <div className="product-file-modal-body">
              <div className="product-file-import-instructions">
                <h3>Import Instructions</h3>
                <ul>
                  <li>Only the <strong>Product Name/Description</strong> column is required</li>
                  <li>Optional columns: Insurer, Min Rate, Max Rate</li>
                  <li>File must be in CSV or Excel format (.xlsx, .xls)</li>
                  <li>First row should contain column headers</li>
                </ul>
                <button className="product-file-btn secondary" onClick={downloadSampleCSV}>
                  Download Sample CSV
                </button>
              </div>

              <div className="product-file-form-group">
                <label className="product-file-form-label">Select CSV or Excel File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="product-file-form-input"
                />
              </div>

              {importErrors.length > 0 && (
                <div className="product-file-import-errors">
                  <h4>Import Errors:</h4>
                  {importErrors.map((error, index) => (
                    <p key={index} className="product-file-error-text">{error}</p>
                  ))}
                </div>
              )}

              {importPreview.length > 0 && (
                <div className="product-file-import-preview">
                  <h4>Preview ({importPreview.length} products found):</h4>
                  <div className="product-file-preview-table">
                    <table className="product-file-table">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Description</th>
                          <th>Insurer</th>
                          <th>Min Rate</th>
                          <th>Max Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.slice(0, 5).map((product, index) => (
                          <tr key={index}>
                            <td>{product.productName}</td>
                            <td>{product.description}</td>
                            <td>{product.insurer}</td>
                            <td>KES {(product.premium || '0').toLocaleString()}</td>
                            <td>KES {(product.premium || '0').toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 5 && (
                      <p className="product-file-preview-more">...and {importPreview.length - 5} more products</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="product-file-modal-footer">
              <button 
                className="product-file-btn secondary"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportPreview([]);
                  setImportErrors([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Cancel
              </button>
              <button 
                className="product-file-btn primary"
                onClick={handleImportProducts}
                disabled={importPreview.length === 0 || isImporting}
              >
                {isImporting ? `Importing ${importPreview.length} Products...` : `Import ${importPreview.length} Products`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="product-file-modal-overlay">
          <div className="product-file-modal">
            <div className="product-file-modal-header">
              <h2 className="product-file-modal-title">Product Details</h2>
              <button 
                className="product-file-modal-close"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedProduct(null);
                }}
              >
                <X className="product-file-modal-close-icon" />
              </button>
            </div>
            <div className="product-file-modal-body">
              <div className="product-file-view-group">
                <label className="product-file-view-label">Product Name</label>
                <p className="product-file-view-value">{selectedProduct.title}</p>
              </div>
              <div className="product-file-view-group">
                <label className="product-file-view-label">Description</label>
                <p className="product-file-view-value">{selectedProduct.description}</p>
              </div>
              <div className="product-file-view-group">
                <label className="product-file-view-label">Insurer</label>
                <p className="product-file-view-value">{selectedProduct.category}</p>
              </div>
              <div className="product-file-view-row">
                <div className="product-file-view-group">
                  <label className="product-file-view-label">Min Rate</label>
                  <p className="product-file-view-value">KES {(selectedProduct.premium || '0').toLocaleString()}</p>
                </div>
                <div className="product-file-view-group">
                  <label className="product-file-view-label">Max Rate</label>
                  <p className="product-file-view-value">KES {(selectedProduct.premium || '0').toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="product-file-modal-footer">
              <button 
                className="product-file-btn secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedProduct(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFile;
