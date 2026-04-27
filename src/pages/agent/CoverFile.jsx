import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Search, Plus, Edit, Trash2, Eye, FileSpreadsheet, X, Tag, FileText } from 'lucide-react';
import apiService from '../../services/api';
import './CoverFile.css';

const CoverFile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCover, setSelectedCover] = useState(null);
  const [editingCover, setEditingCover] = useState(null);
  const [covers, setCovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const coverCategories = [
    'Motor Insurance',
    'Health Insurance',
    'Life Insurance',
    'Property Insurance',
    'Travel Insurance',
    'Business Insurance',
    'Personal Insurance'
  ];

  const [newCover, setNewCover] = useState({
    coverName: '',
    description: '',
    coverCategory: '',
    client_name: '',
    policy_number: '',
    insurer: '',
    product: '',
    premium: '',
    status: 'Active'
  });

  useEffect(() => {
    loadCovers();
  }, []);

  const loadCovers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCovers();
      const data = response?.data || response || [];
      setCovers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading covers:', err);
      setError('Failed to load covers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCovers = covers.filter(cover =>
    (cover.cover_category || cover.coverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cover.notes || cover.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cover.cover_category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cover.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cover.policy_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mapCoverToApi = (formData) => ({
    cover_category: formData.coverCategory,
    notes: formData.description,
    client_name: formData.client_name,
    policy_number: formData.policy_number,
    insurer: formData.insurer,
    product: formData.product,
    premium: formData.premium ? parseFloat(formData.premium) : 0,
    status: formData.status
  });

  const mapApiToForm = (apiCover) => ({
    id: apiCover.id,
    coverName: apiCover.cover_category || '',
    description: apiCover.notes || '',
    coverCategory: apiCover.cover_category || '',
    client_name: apiCover.client_name || '',
    policy_number: apiCover.policy_number || '',
    insurer: apiCover.insurer || '',
    product: apiCover.product || '',
    premium: apiCover.premium !== undefined ? String(apiCover.premium) : '',
    status: apiCover.status || 'Active'
  });

  const handleAddCover = async () => {
    if (newCover.coverName && newCover.coverCategory) {
      try {
        const payload = mapCoverToApi(newCover);
        const response = await apiService.createCover(payload);
        if (response?.success) {
          await loadCovers();
          setNewCover({
            coverName: '', description: '', coverCategory: '',
            client_name: '', policy_number: '', insurer: '',
            product: '', premium: '', status: 'Active'
          });
          setShowAddModal(false);
        }
      } catch (err) {
        console.error('Error adding cover:', err);
        alert('Failed to add cover. Please try again.');
      }
    }
  };

  const handleEditCover = async () => {
    if (editingCover && editingCover.coverName && editingCover.coverCategory) {
      try {
        const payload = mapCoverToApi(editingCover);
        const response = await apiService.updateCover(editingCover.id, payload);
        if (response?.success) {
          await loadCovers();
          setEditingCover(null);
          setShowEditModal(false);
        }
      } catch (err) {
        console.error('Error updating cover:', err);
        alert('Failed to update cover. Please try again.');
      }
    }
  };

  const openEditModal = (cover) => {
    setEditingCover(mapApiToForm(cover));
    setShowEditModal(true);
  };

  const openViewModal = (cover) => {
    setSelectedCover(cover);
    setShowViewModal(true);
  };

  const handleDeleteCover = async (coverId) => {
    if (!window.confirm('Are you sure you want to delete this cover?')) return;
    try {
      const response = await apiService.deleteCover(coverId);
      if (response?.success) {
        await loadCovers();
      }
    } catch (err) {
      console.error('Error deleting cover:', err);
      alert('Failed to delete cover. Please try again.');
    }
  };

  const exportToExcel = () => {
    if (covers.length === 0) {
      alert('No covers to export.');
      return;
    }
    const data = covers.map(cover => ({
      'Cover Name': cover.cover_category || cover.coverName || '',
      'Client Name': cover.client_name || '',
      'Policy Number': cover.policy_number || '',
      'Insurer': cover.insurer || '',
      'Product': cover.product || '',
      'Premium': cover.premium || 0,
      'Status': cover.status || 'Active',
      'Notes': cover.notes || cover.description || ''
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cover_file_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="cover-file-container">
      {/* Header */}
      <div className="cover-file-header">
        <div className="cover-file-header-content">
          <div className="cover-file-header-left">
            <h1 className="cover-file-title">Cover File</h1>
            <p className="cover-file-subtitle">Manage insurance covers and their categories</p>
          </div>
          <div className="cover-file-header-actions">
            <button className="cover-file-btn" onClick={exportToExcel}>
              <FileSpreadsheet className="cover-file-btn-icon" />
              Export to CSV
            </button>
            <button className="cover-file-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus className="cover-file-btn-icon" />
              Add Cover
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="cover-file-search-section">
        <div className="cover-file-search-wrapper">
          <Search className="cover-file-search-icon" />
          <input
            type="text"
            placeholder="Search by cover name, client, policy, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cover-file-search-input"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="cover-file-stats-grid">
        <div className="cover-file-stat-card">
          <div className="cover-file-stat-content">
            <div className="cover-file-stat-info">
              <p className="cover-file-stat-title">Total Covers</p>
              <p className="cover-file-stat-value">{covers.length}</p>
            </div>
            <div className="cover-file-stat-icon-wrapper blue">
              <Shield className="cover-file-stat-icon" />
            </div>
          </div>
        </div>
        <div className="cover-file-stat-card">
          <div className="cover-file-stat-content">
            <div className="cover-file-stat-info">
              <p className="cover-file-stat-title">Categories</p>
              <p className="cover-file-stat-value">{coverCategories.length}</p>
            </div>
            <div className="cover-file-stat-icon-wrapper green">
              <Tag className="cover-file-stat-icon" />
            </div>
          </div>
        </div>
        <div className="cover-file-stat-card">
          <div className="cover-file-stat-content">
            <div className="cover-file-stat-info">
              <p className="cover-file-stat-title">Motor Covers</p>
              <p className="cover-file-stat-value">{covers.filter(c => (c.cover_category || '').toLowerCase().includes('motor')).length}</p>
            </div>
            <div className="cover-file-stat-icon-wrapper orange">
              <FileText className="cover-file-stat-icon" />
            </div>
          </div>
        </div>
        <div className="cover-file-stat-card">
          <div className="cover-file-stat-content">
            <div className="cover-file-stat-info">
              <p className="cover-file-stat-title">Active</p>
              <p className="cover-file-stat-value">{covers.filter(c => (c.status || '').toLowerCase() === 'active').length}</p>
            </div>
            <div className="cover-file-stat-icon-wrapper purple">
              <Shield className="cover-file-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading / Error / Covers Table */}
      <div className="cover-file-table-container">
        <div className="cover-file-table-wrapper">
          {loading ? (
            <div className="cover-file-loading">Loading covers...</div>
          ) : error ? (
            <div className="cover-file-error">{error}</div>
          ) : (
            <table className="cover-file-table">
              <thead className="cover-file-table-head">
                <tr className="cover-file-table-row">
                  <th className="cover-file-table-header">Cover Name</th>
                  <th className="cover-file-table-header">Client</th>
                  <th className="cover-file-table-header">Policy</th>
                  <th className="cover-file-table-header">Insurer</th>
                  <th className="cover-file-table-header">Category</th>
                  <th className="cover-file-table-header">Premium</th>
                  <th className="cover-file-table-header">Status</th>
                  <th className="cover-file-table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="cover-file-table-body">
                {filteredCovers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="cover-file-table-empty">No covers found</td>
                  </tr>
                ) : (
                  filteredCovers.map((cover) => (
                    <tr key={cover.id} className="cover-file-table-row">
                      <td className="cover-file-table-cell">
                        <div className="cover-file-cover-name">{cover.cover_category || cover.coverName}</div>
                      </td>
                      <td className="cover-file-table-cell">{cover.client_name || '-'}</td>
                      <td className="cover-file-table-cell">{cover.policy_number || '-'}</td>
                      <td className="cover-file-table-cell">{cover.insurer || '-'}</td>
                      <td className="cover-file-table-cell">
                        <span className="cover-file-category">{cover.cover_category}</span>
                      </td>
                      <td className="cover-file-table-cell">
                        {cover.premium ? `KES ${parseFloat(cover.premium).toLocaleString()}` : '-'}
                      </td>
                      <td className="cover-file-table-cell">
                        <span className={`cover-file-status ${(cover.status || 'active').toLowerCase()}`}>
                          {cover.status || 'Active'}
                        </span>
                      </td>
                      <td className="cover-file-table-cell">
                        <div className="cover-file-actions">
                          <button className="cover-file-action-btn view" onClick={() => openViewModal(cover)}>
                            <Eye className="cover-file-action-icon" />
                          </button>
                          <button className="cover-file-action-btn edit" onClick={() => openEditModal(cover)}>
                            <Edit className="cover-file-action-icon" />
                          </button>
                          <button className="cover-file-action-btn delete" onClick={() => handleDeleteCover(cover.id)}>
                            <Trash2 className="cover-file-action-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Cover Modal */}
      {showAddModal && (
        <div className="cover-file-modal-overlay">
          <div className="cover-file-modal">
            <div className="cover-file-modal-header">
              <h2 className="cover-file-modal-title">Add New Cover</h2>
              <button className="cover-file-modal-close" onClick={() => setShowAddModal(false)}>
                <X className="cover-file-modal-close-icon" />
              </button>
            </div>
            <div className="cover-file-modal-body">
              <div className="cover-file-form-group">
                <label className="cover-file-form-label">Cover Category *</label>
                <select
                  className="cover-file-form-select"
                  value={newCover.coverCategory}
                  onChange={(e) => setNewCover({...newCover, coverCategory: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {coverCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="cover-file-form-group">
                <label className="cover-file-form-label">Cover Name *</label>
                <input
                  type="text"
                  className="cover-file-form-input"
                  value={newCover.coverName}
                  onChange={(e) => setNewCover({...newCover, coverName: e.target.value})}
                  placeholder="Enter cover name"
                />
              </div>
              <div className="cover-file-form-row">
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Client Name</label>
                  <input
                    type="text"
                    className="cover-file-form-input"
                    value={newCover.client_name}
                    onChange={(e) => setNewCover({...newCover, client_name: e.target.value})}
                    placeholder="Client name"
                  />
                </div>
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Policy Number</label>
                  <input
                    type="text"
                    className="cover-file-form-input"
                    value={newCover.policy_number}
                    onChange={(e) => setNewCover({...newCover, policy_number: e.target.value})}
                    placeholder="Policy number"
                  />
                </div>
              </div>
              <div className="cover-file-form-row">
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Insurer</label>
                  <input
                    type="text"
                    className="cover-file-form-input"
                    value={newCover.insurer}
                    onChange={(e) => setNewCover({...newCover, insurer: e.target.value})}
                    placeholder="Insurer name"
                  />
                </div>
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Product</label>
                  <input
                    type="text"
                    className="cover-file-form-input"
                    value={newCover.product}
                    onChange={(e) => setNewCover({...newCover, product: e.target.value})}
                    placeholder="Product name"
                  />
                </div>
              </div>
              <div className="cover-file-form-row">
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Premium (KES)</label>
                  <input
                    type="number"
                    className="cover-file-form-input"
                    value={newCover.premium}
                    onChange={(e) => setNewCover({...newCover, premium: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Status</label>
                  <select
                    className="cover-file-form-select"
                    value={newCover.status}
                    onChange={(e) => setNewCover({...newCover, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
              <div className="cover-file-form-group">
                <label className="cover-file-form-label">Description / Notes</label>
                <textarea
                  className="cover-file-form-textarea"
                  value={newCover.description}
                  onChange={(e) => setNewCover({...newCover, description: e.target.value})}
                  placeholder="Enter description or notes"
                  rows="3"
                />
              </div>
            </div>
            <div className="cover-file-modal-footer">
              <button className="cover-file-btn secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="cover-file-btn primary" onClick={handleAddCover}>
                Add Cover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Cover Modal */}
      {showEditModal && editingCover && (
        <div className="cover-file-modal-overlay">
          <div className="cover-file-modal">
            <div className="cover-file-modal-header">
              <h2 className="cover-file-modal-title">Edit Cover</h2>
              <button className="cover-file-modal-close" onClick={() => { setShowEditModal(false); setEditingCover(null); }}>
                <X className="cover-file-modal-close-icon" />
              </button>
            </div>
            <div className="cover-file-modal-body">
              <div className="cover-file-form-group">
                <label className="cover-file-form-label">Cover Category *</label>
                <select
                  className="cover-file-form-select"
                  value={editingCover.coverCategory}
                  onChange={(e) => setEditingCover({...editingCover, coverCategory: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {coverCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="cover-file-form-group">
                <label className="cover-file-form-label">Cover Name *</label>
                <input
                  type="text"
                  className="cover-file-form-input"
                  value={editingCover.coverName}
                  onChange={(e) => setEditingCover({...editingCover, coverName: e.target.value})}
                  placeholder="Enter cover name"
                />
              </div>
              <div className="cover-file-form-row">
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Client Name</label>
                  <input
                    type="text"
                    className="cover-file-form-input"
                    value={editingCover.client_name}
                    onChange={(e) => setEditingCover({...editingCover, client_name: e.target.value})}
                    placeholder="Client name"
                  />
                </div>
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Policy Number</label>
                  <input
                    type="text"
                    className="cover-file-form-input"
                    value={editingCover.policy_number}
                    onChange={(e) => setEditingCover({...editingCover, policy_number: e.target.value})}
                    placeholder="Policy number"
                  />
                </div>
              </div>
              <div className="cover-file-form-row">
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Insurer</label>
                  <input
                    type="text"
                    className="cover-file-form-input"
                    value={editingCover.insurer}
                    onChange={(e) => setEditingCover({...editingCover, insurer: e.target.value})}
                    placeholder="Insurer name"
                  />
                </div>
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Product</label>
                  <input
                    type="text"
                    className="cover-file-form-input"
                    value={editingCover.product}
                    onChange={(e) => setEditingCover({...editingCover, product: e.target.value})}
                    placeholder="Product name"
                  />
                </div>
              </div>
              <div className="cover-file-form-row">
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Premium (KES)</label>
                  <input
                    type="number"
                    className="cover-file-form-input"
                    value={editingCover.premium}
                    onChange={(e) => setEditingCover({...editingCover, premium: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className="cover-file-form-group">
                  <label className="cover-file-form-label">Status</label>
                  <select
                    className="cover-file-form-select"
                    value={editingCover.status}
                    onChange={(e) => setEditingCover({...editingCover, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
              <div className="cover-file-form-group">
                <label className="cover-file-form-label">Description / Notes</label>
                <textarea
                  className="cover-file-form-textarea"
                  value={editingCover.description}
                  onChange={(e) => setEditingCover({...editingCover, description: e.target.value})}
                  placeholder="Enter description or notes"
                  rows="3"
                />
              </div>
            </div>
            <div className="cover-file-modal-footer">
              <button className="cover-file-btn secondary" onClick={() => { setShowEditModal(false); setEditingCover(null); }}>
                Cancel
              </button>
              <button className="cover-file-btn primary" onClick={handleEditCover}>
                Update Cover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Cover Modal */}
      {showViewModal && selectedCover && (
        <div className="cover-file-modal-overlay">
          <div className="cover-file-modal">
            <div className="cover-file-modal-header">
              <h2 className="cover-file-modal-title">Cover Details</h2>
              <button className="cover-file-modal-close" onClick={() => { setShowViewModal(false); setSelectedCover(null); }}>
                <X className="cover-file-modal-close-icon" />
              </button>
            </div>
            <div className="cover-file-modal-body">
              <div className="cover-file-view-group">
                <label className="cover-file-view-label">Cover Name</label>
                <p className="cover-file-view-value">{selectedCover.cover_category || selectedCover.coverName}</p>
              </div>
              <div className="cover-file-view-group">
                <label className="cover-file-view-label">Client Name</label>
                <p className="cover-file-view-value">{selectedCover.client_name || '-'}</p>
              </div>
              <div className="cover-file-view-group">
                <label className="cover-file-view-label">Policy Number</label>
                <p className="cover-file-view-value">{selectedCover.policy_number || '-'}</p>
              </div>
              <div className="cover-file-view-group">
                <label className="cover-file-view-label">Insurer</label>
                <p className="cover-file-view-value">{selectedCover.insurer || '-'}</p>
              </div>
              <div className="cover-file-view-group">
                <label className="cover-file-view-label">Product</label>
                <p className="cover-file-view-value">{selectedCover.product || '-'}</p>
              </div>
              <div className="cover-file-view-group">
                <label className="cover-file-view-label">Premium</label>
                <p className="cover-file-view-value">{selectedCover.premium ? `KES ${parseFloat(selectedCover.premium).toLocaleString()}` : '-'}</p>
              </div>
              <div className="cover-file-view-group">
                <label className="cover-file-view-label">Status</label>
                <p className="cover-file-view-value">{selectedCover.status || 'Active'}</p>
              </div>
              <div className="cover-file-view-group">
                <label className="cover-file-view-label">Notes</label>
                <p className="cover-file-view-value">{selectedCover.notes || selectedCover.description || 'No notes'}</p>
              </div>
            </div>
            <div className="cover-file-modal-footer">
              <button className="cover-file-btn secondary" onClick={() => { setShowViewModal(false); setSelectedCover(null); }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverFile;
