import React, { useEffect, useRef, useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, Calendar, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import apiService from '../../../services/api';
import './Policies.css';

const Policies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [statusFilter, setStatusFilter] = useState('all');
  const fileInputRef = useRef(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);

  const [policies, setPolicies] = useState([]);

  const loadPolicies = async () => {
    const response = await apiService.getClientPolicies();
    const data = Array.isArray(response?.data) ? response.data : [];
    setPolicies(data);
  };

  useEffect(() => {
    loadPolicies().catch((e) => {
      console.error('Failed to load policies:', e);
    });
  }, []);

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = 
      (policy.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (policy.policy_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (policy.client_mobile || '').includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || (policy.status || '') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'expiring': return 'status-expiring';
      case 'expired': return 'status-expired';
      default: return '';
    }
  };

  const openViewModal = (policy) => {
    setSelectedPolicy(policy);
    setShowViewModal(true);
  };

  const openEditModal = (policy) => {
    setEditingPolicy({...policy});
    setShowEditModal(true);
  };

  const openDeleteModal = (policy) => {
    setSelectedPolicy(policy);
    setShowDeleteModal(true);
  };

  const handleEditPolicy = () => {
    console.log('Updating policy:', editingPolicy);
    setShowEditModal(false);
    setEditingPolicy(null);
  };

  const handleDeletePolicy = () => {
    console.log('Deleting policy:', selectedPolicy);
    setShowDeleteModal(false);
    setSelectedPolicy(null);
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
      const toStr = (v) => (v === null || v === undefined ? '' : String(v));
      const trimStr = (v) => toStr(v).trim();

      try {
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            setImportErrors(['Excel file must contain at least a header row and one data row']);
            setImportPreview([]);
            return;
          }

          headers = jsonData[0].map((h) => trimStr(h));
          data = jsonData.slice(1);
        } else if (file.name.endsWith('.csv')) {
          const text = e.target.result;
          const lines = text.split('\n').filter((line) => line.trim());
          if (lines.length < 2) {
            setImportErrors(['CSV file must contain at least a header row and one data row']);
            setImportPreview([]);
            return;
          }

          headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
          data = lines.slice(1).map((line) => line.split(',').map((v) => v.trim().replace(/"/g, '')));
        } else {
          setImportErrors(['Please upload a valid CSV or Excel file']);
          setImportPreview([]);
          return;
        }

        const idxPolicy = headers.findIndex((h) => h.toLowerCase().includes('policy'));
        const idxClient = headers.findIndex((h) => h.toLowerCase().includes('client'));
        const idxContact = headers.findIndex((h) => h.toLowerCase().includes('contact') || h.toLowerCase().includes('mobile'));
        const idxClass = headers.findIndex((h) => h.toLowerCase().includes('class') || h.toLowerCase().includes('type'));
        const idxCover = headers.findIndex((h) => h.toLowerCase().includes('cover'));
        const idxDate = headers.findIndex((h) => h.toLowerCase() === 'date' || h.toLowerCase().includes('start'));
        const idxExpiry = headers.findIndex((h) => h.toLowerCase().includes('expiry'));
        const idxPremium = headers.findIndex((h) => h.toLowerCase().includes('premium'));
        const idxBalance = headers.findIndex((h) => h.toLowerCase().includes('balance'));
        const idxStatus = headers.findIndex((h) => h.toLowerCase().includes('status'));

        if (idxPolicy === -1) {
          errors.push('File must contain a Policy No column');
          setImportErrors(errors);
          setImportPreview([]);
          return;
        }

        const parsed = [];
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const policyNo = trimStr(row[idxPolicy]);
          if (!policyNo) {
            errors.push(`Row ${i + 2}: Policy No is required`);
            continue;
          }

          parsed.push({
            policyNo,
            clientName: idxClient !== -1 ? trimStr(row[idxClient]) : '',
            contact: idxContact !== -1 ? trimStr(row[idxContact]) : '',
            class: idxClass !== -1 ? trimStr(row[idxClass]) : '',
            cover: idxCover !== -1 ? trimStr(row[idxCover]) : '',
            date: idxDate !== -1 ? trimStr(row[idxDate]) : '',
            expiryDate: idxExpiry !== -1 ? trimStr(row[idxExpiry]) : '',
            premium: idxPremium !== -1 ? trimStr(row[idxPremium]) : '',
            balance: idxBalance !== -1 ? trimStr(row[idxBalance]) : '',
            status: idxStatus !== -1 ? trimStr(row[idxStatus]) : '',
          });
        }

        setImportPreview(parsed);
        setImportErrors(errors);
      } catch (err) {
        setImportErrors([`Error parsing file: ${err.message}`]);
        setImportPreview([]);
      }
    };

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleImportPolicies = async () => {
    if (importPreview.length === 0) return;

    setIsImporting(true);
    try {
      const response = await apiService.bulkImportClientPolicies(importPreview);
      if (response?.success) {
        await loadPolicies();
        const created = Array.isArray(response?.created) ? response.created.length : 0;
        const updated = Array.isArray(response?.updated) ? response.updated.length : 0;
        const failed = Array.isArray(response?.failed) ? response.failed.length : 0;
        alert(`Import completed. Created: ${created}, Updated: ${updated}, Failed: ${failed}`);

        setShowImportModal(false);
        setImportFile(null);
        setImportPreview([]);
        setImportErrors([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        throw new Error(response?.message || 'Import failed');
      }
    } catch (e) {
      console.error('Import failed:', e);
      alert(e?.message || 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="policies-container">
      {/* Header */}
      <div className="policies-header">
        <h1 className="policies-title">Policies</h1>
        <p className="policies-subtitle">Manage all insurance policies</p>
      </div>

      {/* Filters */}
      <div className="policies-filters">
        <div className="policies-search">
          <Search className="policies-search-icon" />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="policies-search-input"
          />
        </div>
        
        <div className="policies-status-filter">
          <label>Status Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="policies-status-select"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <button className="policies-filter-btn">
          <Filter className="policies-filter-icon" />
          Filters
        </button>
        
        <button className="policies-export-btn">
          <Download className="policies-export-icon" />
          Export
        </button>

        <button className="policies-export-btn" onClick={() => setShowImportModal(true)}>
          <Upload className="policies-export-icon" />
          Import
        </button>
      </div>

      {/* Policies Table */}
      <div className="policies-table-container">
        <div className="policies-table-wrapper">
          <table className="policies-table">
            <thead className="policies-table-head">
              <tr className="policies-table-row">
                <th className="policies-table-header">CLIENT NAME</th>
                <th className="policies-table-header">CONTACT</th>
                <th className="policies-table-header">POLICY NO.</th>
                <th className="policies-table-header">DATE</th>
                <th className="policies-table-header">CLASS</th>
                <th className="policies-table-header">COVER</th>
                <th className="policies-table-header">EXPIRY D.</th>
                <th className="policies-table-header">STATUS</th>
                <th className="policies-table-header">PREMIUM</th>
                <th className="policies-table-header">PAID</th>
                <th className="policies-table-header">BALANCE</th>
                <th className="policies-table-header">ACTIONs</th>
              </tr>
            </thead>
            <tbody className="policies-table-body">
              {paginatedPolicies.map((policy) => (
                <tr key={policy.id} className="policies-table-row">
                  <td className="policies-table-cell">
                    <div className="policies-client-info">
                      <div className="policies-client-name">{policy.client_name}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-contact-info">
                      <div className="policies-contact">{policy.client_mobile || ''}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-policy-info">
                      <div className="policies-policy-no">{policy.policy_number}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-date-info">
                      <div className="policies-date">{policy.start_date}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-class-info">
                      <div className="policies-class">{policy.policy_type}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-cover-info">
                      <div className="policies-cover">{policy.cover_type || ''}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-expiry-info">
                      <div className="policies-expiry-date">{policy.expiry_date}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <span className={`policies-status ${getStatusClass(policy.status)}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-premium-info">
                      <div className="policies-premium">KES {Number(policy.premium_amount || 0).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-paid-info">
                      <div className="policies-paid">KES {Number((policy.premium_amount || 0) - (policy.premium_balance || 0)).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-balance-info">
                      <div className="policies-balance">KES {Number(policy.premium_balance || 0).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-actions">
                      <button className="policies-action-btn view" onClick={() => openViewModal(policy)}>
                        <Eye className="policies-action-icon" />
                      </button>
                      <button className="policies-action-btn edit" onClick={() => openEditModal(policy)}>
                        <Edit className="policies-action-icon" />
                      </button>
                      <button className="policies-action-btn delete" onClick={() => openDeleteModal(policy)}>
                        <Trash2 className="policies-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedPolicy(null);
        }}
        title="Policy Details"
        size="medium"
      >
        {selectedPolicy && (
          <div className="policy-details">
            <div className="detail-row">
              <label>Client Name:</label>
              <span>{selectedPolicy.client_name}</span>
            </div>
            <div className="detail-row">
              <label>Contact:</label>
              <span>{selectedPolicy.client_mobile || ''}</span>
            </div>
            <div className="detail-row">
              <label>Policy No:</label>
              <span>{selectedPolicy.policy_number}</span>
            </div>
            <div className="detail-row">
              <label>Date:</label>
              <span>{selectedPolicy.start_date}</span>
            </div>
            <div className="detail-row">
              <label>Class:</label>
              <span>{selectedPolicy.policy_type}</span>
            </div>
            <div className="detail-row">
              <label>Cover:</label>
              <span>{selectedPolicy.cover_type || ''}</span>
            </div>
            <div className="detail-row">
              <label>Expiry Date:</label>
              <span>{selectedPolicy.expiry_date}</span>
            </div>
            <div className="detail-row">
              <label>Status:</label>
              <span className={`policies-status ${getStatusClass(selectedPolicy.status)}`}>
                {selectedPolicy.status}
              </span>
            </div>
            <div className="detail-row">
              <label>Premium:</label>
              <span>KES {Number(selectedPolicy.premium_amount || 0).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <label>Paid:</label>
              <span>KES {Number((selectedPolicy.premium_amount || 0) - (selectedPolicy.premium_balance || 0)).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <label>Balance:</label>
              <span>KES {Number(selectedPolicy.premium_balance || 0).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setEditingPolicy(null);
        }}
        title="Edit Policy"
        size="medium"
      >
        {editingPolicy && (
          <div className="policy-edit-form">
            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                value={editingPolicy.client_name}
                onChange={(e) => setEditingPolicy({...editingPolicy, client_name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input
                type="text"
                value={editingPolicy.client_mobile || ''}
                onChange={(e) => setEditingPolicy({...editingPolicy, client_mobile: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Policy No</label>
              <input
                type="text"
                value={editingPolicy.policy_number}
                onChange={(e) => setEditingPolicy({...editingPolicy, policy_number: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Class</label>
              <input
                type="text"
                value={editingPolicy.policy_type}
                onChange={(e) => setEditingPolicy({...editingPolicy, policy_type: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Cover</label>
              <input
                type="text"
                value={editingPolicy.cover_type || ''}
                onChange={(e) => setEditingPolicy({...editingPolicy, cover_type: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                value={editingPolicy.expiry_date}
                onChange={(e) => setEditingPolicy({...editingPolicy, expiry_date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={editingPolicy.status}
                onChange={(e) => setEditingPolicy({...editingPolicy, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="expiring">Expiring</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="form-group">
              <label>Premium</label>
              <input
                type="number"
                value={editingPolicy.premium_amount || 0}
                onChange={(e) => setEditingPolicy({...editingPolicy, premium_amount: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditPolicy}>
                Update Policy
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPolicy(null);
        }}
        onConfirm={handleDeletePolicy}
        title="Delete Policy"
        message={`Are you sure you want to delete policy ${selectedPolicy?.policy_number} for ${selectedPolicy?.client_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportFile(null);
          setImportPreview([]);
          setImportErrors([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        title="Import Policies"
        size="medium"
      >
        <div className="policy-edit-form">
          <div className="form-group">
            <label>Select CSV or Excel File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
            />
          </div>

          {importErrors.length > 0 && (
            <div>
              {importErrors.map((err, idx) => (
                <div key={idx}>{err}</div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowImportModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleImportPolicies} disabled={isImporting || importPreview.length === 0}>
              {isImporting ? 'Importing...' : `Import ${importPreview.length}`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Policies;
