import React, { useEffect, useRef, useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, Plus, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import apiService from '../../../services/api';
import './Claims.css';

const Claims = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState({
    clientName: '',
    clientMobile: '',
    clientId: '',
    policyNo: '',
    insurer: '',
    productType: ''
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [editingClaim, setEditingClaim] = useState(null);

  const fileInputRef = useRef(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  const [claims, setClaims] = useState([]);

  const loadClaims = async () => {
    const response = await apiService.getClaims();
    const data = Array.isArray(response?.data) ? response.data : [];
    setClaims(data);
  };

  useEffect(() => {
    loadClaims().catch((e) => {
      console.error('Failed to load claims:', e);
    });
  }, []);

  const handleSearchChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log('Searching with data:', searchData);
    // Implement search functionality
  };

  const handleClear = () => {
    setSearchData({
      clientName: '',
      clientMobile: '',
      clientId: '',
      policyNo: '',
      insurer: '',
      productType: ''
    });
  };

  const openViewModal = (claim) => {
    setSelectedClaim(claim);
    setShowViewModal(true);
  };

  const openEditModal = (claim) => {
    setEditingClaim({...claim});
    setShowEditModal(true);
  };

  const openDeleteModal = (claim) => {
    setSelectedClaim(claim);
    setShowDeleteModal(true);
  };

  const handleEditClaim = () => {
    // Here you would normally update the claim in the database
    console.log('Updating claim:', editingClaim);
    setShowEditModal(false);
    setEditingClaim(null);
  };

  const handleDeleteClaim = () => {
    // Here you would normally delete the claim from the database
    console.log('Deleting claim:', selectedClaim);
    setShowDeleteModal(false);
    setSelectedClaim(null);
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
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

        const idxClient = headers.findIndex((h) => h.toLowerCase().includes('client'));
        const idxPolicy = headers.findIndex((h) => h.toLowerCase().includes('policy'));
        const idxClaim = headers.findIndex((h) => h.toLowerCase().includes('claim'));
        const idxDate = headers.findIndex((h) => h.toLowerCase() === 'date' || h.toLowerCase().includes('incident'));
        const idxClass = headers.findIndex((h) => h.toLowerCase().includes('class'));
        const idxType = headers.findIndex((h) => h.toLowerCase().includes('type'));
        const idxStatus = headers.findIndex((h) => h.toLowerCase().includes('status'));
        const idxAmount = headers.findIndex((h) => h.toLowerCase().includes('amount'));
        const idxPaid = headers.findIndex((h) => h.toLowerCase().includes('paid'));
        const idxBalance = headers.findIndex((h) => h.toLowerCase().includes('balance'));
        const idxItem = headers.findIndex((h) => h.toLowerCase().includes('item'));

        if (idxClient === -1) {
          errors.push('File must contain a Client Name column');
        }
        if (idxClaim === -1) {
          errors.push('File must contain a Claim No column');
        }
        if (errors.length > 0) {
          setImportErrors(errors);
          setImportPreview([]);
          return;
        }

        const parsed = [];
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const clientName = trimStr(row[idxClient]);
          const claimNo = trimStr(row[idxClaim]);

          if (!clientName) {
            errors.push(`Row ${i + 2}: Client name is required`);
            continue;
          }
          if (!claimNo) {
            errors.push(`Row ${i + 2}: Claim No is required`);
            continue;
          }

          parsed.push({
            clientName,
            policyNo: idxPolicy !== -1 ? trimStr(row[idxPolicy]) : '',
            claimNo,
            date: idxDate !== -1 ? trimStr(row[idxDate]) : '',
            class: idxClass !== -1 ? trimStr(row[idxClass]) : '',
            claimType: idxType !== -1 ? trimStr(row[idxType]) : '',
            status: idxStatus !== -1 ? trimStr(row[idxStatus]) : '',
            amount: idxAmount !== -1 ? trimStr(row[idxAmount]) : '',
            paid: idxPaid !== -1 ? trimStr(row[idxPaid]) : '',
            balance: idxBalance !== -1 ? trimStr(row[idxBalance]) : '',
            item: idxItem !== -1 ? trimStr(row[idxItem]) : '',
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

  const handleImportClaims = async () => {
    if (importPreview.length === 0) return;

    setIsImporting(true);
    try {
      const response = await apiService.bulkImportClaims(importPreview);
      if (response?.success) {
        await loadClaims();
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
    <div className="claims-container">
      {/* Header */}
      <div className="claims-header">
        <div className="claims-header-content">
          <div className="claims-header-left">
            <h1 className="claims-title">Claims</h1>
            <p className="claims-subtitle">Manage and track all insurance claims</p>
          </div>
          <div className="claims-header-actions">
            <button className="btn btn-outline">
              <Download className="btn-icon" />
              Export
            </button>
            <button className="btn btn-outline" onClick={() => setShowImportModal(true)}>
              <Upload className="btn-icon" />
              Import
            </button>
            <button className="btn btn-primary">
              <Plus className="btn-icon" />
              New Claim
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="claims-filters">
        <div className="claims-search">
          <Search className="claims-search-icon" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="claims-search-input"
          />
        </div>
        <button className="claims-filter-btn">
          <Filter className="claims-filter-icon" />
          Filters
        </button>
        <button className="claims-export-btn">
          <Download className="claims-export-icon" />
          Export
        </button>
      </div>

      <div className="search-section">
        <div className="search-card">
          <h2>Search Claims</h2>
          <div className="search-grid">
            <div className="search-group">
              <label>Search By Name</label>
              <input
                type="text"
                placeholder="Search Client Name"
                value={searchData.clientName}
                onChange={(e) => handleSearchChange('clientName', e.target.value)}
              />
            </div>

            <div className="search-group">
              <label>Search By Mobile No.</label>
              <input
                type="text"
                placeholder="Search Mobile Number"
                value={searchData.clientMobile}
                onChange={(e) => handleSearchChange('clientMobile', e.target.value)}
              />
            </div>

            <div className="search-group">
              <label>Search By ID No.</label>
              <input
                type="text"
                placeholder="Search ID Number"
                value={searchData.clientId}
                onChange={(e) => handleSearchChange('clientId', e.target.value)}
              />
            </div>

            <div className="search-group">
              <label>Search By Policy No.</label>
              <input
                type="text"
                placeholder="Search Policy Number"
                value={searchData.policyNo}
                onChange={(e) => handleSearchChange('policyNo', e.target.value)}
              />
            </div>

            <div className="search-group">
              <label>Search By Insurer</label>
              <select
                value={searchData.insurer}
                onChange={(e) => handleSearchChange('insurer', e.target.value)}
              >
                <option value="">Select Insurer</option>
                <option value="insurer1">Insurance Company A</option>
                <option value="insurer2">Insurance Company B</option>
                <option value="insurer3">Insurance Company C</option>
              </select>
            </div>

            <div className="search-group">
              <label>Search By Class/Product Type</label>
              <select
                value={searchData.productType}
                onChange={(e) => handleSearchChange('productType', e.target.value)}
              >
                <option value="">Select Product Type</option>
                <option value="motor">Motor Insurance</option>
                <option value="health">Health Insurance</option>
                <option value="property">Property Insurance</option>
                <option value="life">Life Insurance</option>
              </select>
            </div>
          </div>

          <div className="search-actions">
            <button className="btn btn-primary" onClick={handleSearch}>
              <Search className="btn-icon" />
              Search
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="claims-table-section">
        <div className="table-card">
          <div className="table-header">
            <h2>Claims List</h2>
            <div className="table-actions">
              <button className="btn btn-outline">
                <Filter className="btn-icon" />
                Filter
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="claims-table">
              <thead>
                <tr>
                  <th>CLIENT NAME</th>
                  <th>POLICY NO.</th>
                  <th>CLAIM NO.</th>
                  <th>DATE</th>
                  <th>CLASS</th>
                  <th>CLAIM TYPE</th>
                  <th>STATUS</th>
                  <th>AMOUNT</th>
                  <th>PAID</th>
                  <th>BALANCE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td>{claim.client_name}</td>
                    <td>{claim.policy_number}</td>
                    <td>{claim.claim_number}</td>
                    <td>{claim.date || ''}</td>
                    <td>{claim.insurance_class || ''}</td>
                    <td>{claim.claim_type || ''}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>KES {Number(claim.amount || 0).toLocaleString()}</td>
                    <td>KES {Number(claim.paid || 0).toLocaleString()}</td>
                    <td>KES {Number(claim.balance || 0).toLocaleString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon-btn btn-view" title="View" onClick={() => openViewModal(claim)}>
                          <Eye className="icon" />
                        </button>
                        <button className="btn-icon-btn btn-edit" title="Edit" onClick={() => openEditModal(claim)}>
                          <Edit className="icon" />
                        </button>
                        <button className="btn-icon-btn btn-delete" title="Delete" onClick={() => openDeleteModal(claim)}>
                          <Trash2 className="icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Claim Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedClaim(null);
        }}
        title="Claim Details"
        size="medium"
      >
        {selectedClaim && (
          <div className="claim-details">
            <div className="detail-row">
              <label>Client Name:</label>
              <span>{selectedClaim.client_name}</span>
            </div>
            <div className="detail-row">
              <label>Policy No:</label>
              <span>{selectedClaim.policy_number}</span>
            </div>
            <div className="detail-row">
              <label>Claim No:</label>
              <span>{selectedClaim.claim_number}</span>
            </div>
            <div className="detail-row">
              <label>Date:</label>
              <span>{selectedClaim.date || ''}</span>
            </div>
            <div className="detail-row">
              <label>Class:</label>
              <span>{selectedClaim.insurance_class || ''}</span>
            </div>
            <div className="detail-row">
              <label>Claim Type:</label>
              <span>{selectedClaim.claim_type || ''}</span>
            </div>
            <div className="detail-row">
              <label>Status:</label>
              <span className={`status-badge ${getStatusClass(selectedClaim.status)}`}>
                {selectedClaim.status}
              </span>
            </div>
            <div className="detail-row">
              <label>Amount:</label>
              <span>KES {Number(selectedClaim.amount || 0).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <label>Paid:</label>
              <span>KES {Number(selectedClaim.paid || 0).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <label>Balance:</label>
              <span>KES {Number(selectedClaim.balance || 0).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <label>Item:</label>
              <span>{selectedClaim.item}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Claim Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setEditingClaim(null);
        }}
        title="Edit Claim"
        size="medium"
      >
        {editingClaim && (
          <div className="claim-edit-form">
            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                value={editingClaim.clientName}
                onChange={(e) => setEditingClaim({...editingClaim, clientName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Policy No</label>
              <input
                type="text"
                value={editingClaim.policyNo}
                onChange={(e) => setEditingClaim({...editingClaim, policyNo: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Claim No</label>
              <input
                type="text"
                value={editingClaim.claimNo}
                onChange={(e) => setEditingClaim({...editingClaim, claimNo: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={editingClaim.status}
                onChange={(e) => setEditingClaim({...editingClaim, status: e.target.value})}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={editingClaim.amount}
                onChange={(e) => setEditingClaim({...editingClaim, amount: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Paid</label>
              <input
                type="number"
                value={editingClaim.paid}
                onChange={(e) => setEditingClaim({...editingClaim, paid: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Item</label>
              <input
                type="text"
                value={editingClaim.item}
                onChange={(e) => setEditingClaim({...editingClaim, item: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditClaim}>
                Update Claim
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedClaim(null);
        }}
        onConfirm={handleDeleteClaim}
        title="Delete Claim"
        message={`Are you sure you want to delete claim ${selectedClaim?.claim_number} for ${selectedClaim?.client_name}? This action cannot be undone.`}
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
        title="Import Claims"
        size="medium"
      >
        <div className="claim-edit-form">
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
            <button className="btn btn-primary" onClick={handleImportClaims} disabled={isImporting || importPreview.length === 0}>
              {isImporting ? 'Importing...' : `Import ${importPreview.length}`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Claims;
