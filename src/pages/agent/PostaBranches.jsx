import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowLeft, Search, Plus, Edit, Trash2, Eye, FileSpreadsheet, X, Building, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import Pagination from '../../components/Pagination';
import '../../components/Pagination.css';
import apiService from '../../services/api';
import './PostaBranches.css';

const PostaBranches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const [newBranch, setNewBranch] = useState({
    branchName: '',
    branchCode: '',
    town: '',
    remarks: '',
    status: 'Active'
  });

  // Map backend snake_case to frontend camelCase
  const normalizeBranch = (b) => ({
    id: b.id,
    branchName: b.branch_name || '',
    branchCode: b.branch_code || '',
    town: b.location || '',
    location: b.location || '',
    address: b.address || '',
    phone: b.phone || '',
    email: b.email || '',
    remarks: b.remarks || '',
    status: b.status || 'active'
  });

  const normalizedBranches = branches.map(normalizeBranch);

  const filteredBranches = normalizedBranches.filter(branch =>
    (branch.branchName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (branch.branchCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (branch.town || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (branch.remarks || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const paginatedBranches = filteredBranches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddBranch = () => {
    if (newBranch.branchName) {
      const branch = {
        id: branches.length + 1,
        ...newBranch
      };
      setBranches([...branches, branch]);
      setNewBranch({ branchName: '', branchCode: '', town: '', remarks: '', status: 'Active' });
      setShowAddModal(false);
    }
  };

  const handleEditBranch = () => {
    if (editingBranch && editingBranch.branchName) {
      setBranches(branches.map(branch =>
        branch.id === editingBranch.id ? editingBranch : branch
      ));
      setEditingBranch(null);
      setShowEditModal(false);
    }
  };

  const openEditModal = (branch) => {
    setEditingBranch({...branch});
    setShowEditModal(true);
  };

  const openViewModal = (branch) => {
    setSelectedBranch(branch);
  };

  const handleDeleteBranch = (branchId) => {
    setBranches(branches.filter(branch => branch.id !== branchId));
  };

  const exportToExcel = () => {
    const data = filteredBranches.map(branch => ({
      'Branch Name': branch.branchName,
      'Branch Code': branch.branchCode,
      'Town': branch.town,
      'Remarks': branch.remarks,
      'Status': branch.status
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `posta_branches_${new Date().toISOString().split('T')[0]}.csv`);
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

        // Find the required columns — match any header containing "branch" or watch the first text column
        const nameColumnIndex = headers.findIndex(h => {
          const lower = h.toLowerCase();
          return lower.includes('branch');
        });

        if (nameColumnIndex === -1) {
          errors.push('File must contain a column with "Branch" in the header');
        }

        if (errors.length > 0) {
          setImportErrors(errors);
          setImportPreview([]);
          return;
        }

        // Find optional columns
        const codeColumnIndex = headers.findIndex(h => {
          const lower = h.toLowerCase();
          return lower.includes('code') && lower.includes('branch');
        });
        // Broader code match if "branch code" not found
        const finalCodeIndex = codeColumnIndex !== -1 ? codeColumnIndex : headers.findIndex(h => {
          const lower = h.toLowerCase();
          return lower.includes('code');
        });
        const townColumnIndex = headers.findIndex(h =>
          h.toLowerCase().includes('town')
        );
        const remarksIndex = headers.findIndex(h => h.toLowerCase().includes('remark'));
        const statusIndex = headers.findIndex(h => h.toLowerCase().includes('status'));

        const parsedBranches = [];

        for (let i = 0; i < data.length; i++) {
          const values = data[i];
          const branchName = String(values[nameColumnIndex] ?? '').trim();

          if (!branchName) {
            errors.push(`Row ${i + 2}: Branch Name is required`);
            continue;
          }

          const branchCode = finalCodeIndex !== -1 ? String(values[finalCodeIndex] ?? '').trim() : '';
          const town = townColumnIndex !== -1 ? String(values[townColumnIndex] ?? '').trim() : '';

          const branch = {
            branchName: branchName,
            branchCode: branchCode,
            town: town,
            remarks: remarksIndex !== -1 && values[remarksIndex] ? String(values[remarksIndex]).trim() : '',
            status: statusIndex !== -1 && values[statusIndex] ? String(values[statusIndex]).trim() : 'Active'
          };

          parsedBranches.push(branch);
        }

        setImportPreview(parsedBranches); // Show all parsed rows
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

  const handleImportBranches = async () => {
    if (importPreview.length === 0) return;

    setIsImporting(true);

    try {
      // Map frontend camelCase to backend snake_case before sending
      const backendData = importPreview.map(branch => ({
        branch_name: branch.branchName || '',
        branch_code: branch.branchCode || '',
        location: branch.town || '',
        remarks: branch.remarks || '',
        status: branch.status || 'Active'
      }));

      // Try to import via API first
      const response = await apiService.bulkImportPostaBranches({ branches: backendData });

      if (response.success) {
        // Refresh branches from API
        const updatedBranches = await apiService.getPostaBranches();
        setBranches(updatedBranches.data || []);

        // Close modal and reset state
        setShowImportModal(false);
        setImportFile(null);
        setImportPreview([]);
        setImportErrors([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        // If API fails, fall back to local state
        const newBranches = importPreview.map((branch, index) => ({
          id: branches.length + index + 1,
          ...branch
        }));

        setBranches([...branches, ...newBranches]);
        setShowImportModal(false);
        setImportFile(null);
        setImportPreview([]);
        setImportErrors([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Import failed:', error);
      // Fall back to local state if API is unavailable
      const newBranches = importPreview.map((branch, index) => ({
        id: branches.length + index + 1,
        ...branch
      }));

      setBranches([...branches, ...newBranches]);
      setShowImportModal(false);
      setImportFile(null);
      setImportPreview([]);
      setImportErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleContent = 'Branch Name,Branch Code,Town,Remarks,Status\n' +
      'Nairobi Central,NCB001,Nairobi,Main branch,Active\n' +
      'Mombasa Branch,MBB002,Mombasa,Coastal region branch,Active\n' +
      'Kisumu Office,KSO003,Kisumu,Lake Victoria region,Active';

    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'posta_branches_import_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="posta-branches-container">
      {/* Header */}
      <div className="posta-branches-header">
        <div className="posta-branches-header-content">
          <div className="posta-branches-header-left">
            <h1 className="posta-branches-title">Posta Branches</h1>
            <p className="posta-branches-subtitle">Manage postal service branches and their information</p>
          </div>
          <div className="posta-branches-header-actions">
            <button className="posta-branches-btn" onClick={() => setShowImportModal(true)}>
              <Upload className="posta-branches-btn-icon" />
              Import Branches
            </button>
            <button className="posta-branches-btn" onClick={exportToExcel}>
              <FileSpreadsheet className="posta-branches-btn-icon" />
              Export to Excel
            </button>
            <button className="posta-branches-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus className="posta-branches-btn-icon" />
              Add Branch
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="posta-branches-search-section">
        <div className="posta-branches-search-wrapper">
          <Search className="posta-branches-search-icon" />
          <input
            type="text"
            placeholder="Search by branch name, code, town, or remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="posta-branches-search-input"
          />
        </div>
      </div>

      {/* Branches Table */}
      <div className="posta-branches-table-container">
        <div className="posta-branches-table-wrapper">
          <table className="posta-branches-table">
            <thead className="posta-branches-table-head">
              <tr className="posta-branches-table-row">
                <th className="posta-branches-table-header">Branch Name</th>
                <th className="posta-branches-table-header">Branch Code</th>
                <th className="posta-branches-table-header">Town</th>
                <th className="posta-branches-table-header">Remarks</th>
                <th className="posta-branches-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="posta-branches-table-body">
              {paginatedBranches.map((branch) => (
                <tr key={branch.id} className="posta-branches-table-row">
                  <td className="posta-branches-table-cell">
                    <div className="posta-branches-branch-info">
                      <div className="posta-branches-branch-name">{branch.branchName}</div>
                    </div>
                  </td>
                  <td className="posta-branches-table-cell">
                    <div className="posta-branches-code-info">
                      <div className="posta-branches-code">{branch.branchCode}</div>
                    </div>
                  </td>
                  <td className="posta-branches-table-cell">
                    <div className="posta-branches-town-info">
                      <div className="posta-branches-town">{branch.town}</div>
                    </div>
                  </td>
                  <td className="posta-branches-table-cell">
                    <div className="posta-branches-remarks-info">
                      <div className="posta-branches-remarks">{branch.remarks}</div>
                    </div>
                  </td>
                  <td className="posta-branches-table-cell">
                    <div className="posta-branches-actions">
                      <button className="posta-branches-action-btn view" onClick={() => openViewModal(branch)}>
                        <Eye className="posta-branches-action-icon" />
                      </button>
                      <button className="posta-branches-action-btn edit" onClick={() => openEditModal(branch)}>
                        <Edit className="posta-branches-action-icon" />
                      </button>
                      <button className="posta-branches-action-btn delete" onClick={() => handleDeleteBranch(branch.id)}>
                        <Trash2 className="posta-branches-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {filteredBranches.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredBranches.length)} of {filteredBranches.length} branches
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={filteredBranches.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="posta-branches-modal-overlay">
          <div className="posta-branches-modal">
            <div className="posta-branches-modal-header">
              <h2 className="posta-branches-modal-title">Add New Branch</h2>
              <button
                className="posta-branches-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <X className="posta-branches-modal-close-icon" />
              </button>
            </div>
            <div className="posta-branches-modal-body">
              <div className="posta-branches-form-group">
                <label className="posta-branches-form-label">Branch Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="posta-branches-form-input"
                  value={newBranch.branchName}
                  onChange={(e) => setNewBranch({...newBranch, branchName: e.target.value})}
                  placeholder="Enter branch name"
                />
              </div>
              <div className="posta-branches-form-group">
                <label className="posta-branches-form-label">Branch Code</label>
                <input
                  type="text"
                  className="posta-branches-form-input"
                  value={newBranch.branchCode}
                  onChange={(e) => setNewBranch({...newBranch, branchCode: e.target.value})}
                  placeholder="Enter branch code"
                />
              </div>
              <div className="posta-branches-form-group">
                <label className="posta-branches-form-label">Town</label>
                <input
                  type="text"
                  className="posta-branches-form-input"
                  value={newBranch.town}
                  onChange={(e) => setNewBranch({...newBranch, town: e.target.value})}
                  placeholder="Enter town"
                />
              </div>
              <div className="posta-branches-form-group">
                <label className="posta-branches-form-label">Remarks</label>
                <textarea
                  className="posta-branches-form-textarea"
                  value={newBranch.remarks}
                  onChange={(e) => setNewBranch({...newBranch, remarks: e.target.value})}
                  placeholder="Enter remarks"
                  rows="3"
                />
              </div>
            </div>
            <div className="posta-branches-modal-footer">
              <button
                className="posta-branches-btn secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="posta-branches-btn primary"
                onClick={handleAddBranch}
              >
                Add Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {showEditModal && editingBranch && (
        <div className="posta-branches-modal-overlay">
          <div className="posta-branches-modal">
            <div className="posta-branches-modal-header">
              <h2 className="posta-branches-modal-title">Edit Branch</h2>
              <button
                className="posta-branches-modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBranch(null);
                }}
              >
                <X className="posta-branches-modal-close-icon" />
              </button>
            </div>
            <div className="posta-branches-modal-body">
              <div className="posta-branches-form-group">
                <label className="posta-branches-form-label">Branch Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="posta-branches-form-input"
                  value={editingBranch.branchName}
                  onChange={(e) => setEditingBranch({...editingBranch, branchName: e.target.value})}
                  placeholder="Enter branch name"
                />
              </div>
              <div className="posta-branches-form-group">
                <label className="posta-branches-form-label">Branch Code</label>
                <input
                  type="text"
                  className="posta-branches-form-input"
                  value={editingBranch.branchCode}
                  onChange={(e) => setEditingBranch({...editingBranch, branchCode: e.target.value})}
                  placeholder="Enter branch code"
                />
              </div>
              <div className="posta-branches-form-group">
                <label className="posta-branches-form-label">Town</label>
                <input
                  type="text"
                  className="posta-branches-form-input"
                  value={editingBranch.town}
                  onChange={(e) => setEditingBranch({...editingBranch, town: e.target.value})}
                  placeholder="Enter town"
                />
              </div>
              <div className="posta-branches-form-group">
                <label className="posta-branches-form-label">Remarks</label>
                <textarea
                  className="posta-branches-form-textarea"
                  value={editingBranch.remarks}
                  onChange={(e) => setEditingBranch({...editingBranch, remarks: e.target.value})}
                  placeholder="Enter remarks"
                  rows="3"
                />
              </div>
            </div>
            <div className="posta-branches-modal-footer">
              <button
                className="posta-branches-btn secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBranch(null);
                }}
              >
                Cancel
              </button>
              <button
                className="posta-branches-btn primary"
                onClick={handleEditBranch}
              >
                Update Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Posta Branches Modal */}
      {showImportModal && (
        <div className="posta-branches-modal-overlay">
          <div className="posta-branches-modal import-modal">
            <div className="posta-branches-modal-header">
              <h2 className="posta-branches-modal-title">Import Posta Branches</h2>
              <button
                className="posta-branches-modal-close"
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
                <X className="posta-branches-modal-close-icon" />
              </button>
            </div>
            <div className="posta-branches-modal-body">
              <div className="posta-branches-import-instructions">
                <h3>Import Instructions</h3>
                <ul>
                  <li><strong>Required columns:</strong> Branch Name</li>
                  <li><strong>Optional columns:</strong> Branch Code, Town, Remarks, Status</li>
                  <li>File must be in CSV or Excel format (.xlsx, .xls)</li>
                  <li>First row should contain column headers</li>
                </ul>
                <button className="posta-branches-btn secondary" onClick={downloadSampleCSV}>
                  Download Sample CSV
                </button>
              </div>

              <div className="posta-branches-form-group">
                <label className="posta-branches-form-label">Select CSV or Excel File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="posta-branches-form-input"
                />
              </div>

              {importErrors.length > 0 && (
                <div className="posta-branches-import-errors">
                  <h4>Import Errors:</h4>
                  {importErrors.map((error, index) => (
                    <p key={index} className="posta-branches-error-text">{error}</p>
                  ))}
                </div>
              )}

              {importPreview.length > 0 && (
                <div className="posta-branches-import-preview">
                  <h4>Preview ({importPreview.length} branches found):</h4>
                  <div className="posta-branches-preview-table">
                    <table className="posta-branches-table">
                      <thead>
                        <tr>
                          <th>Branch Name</th>
                          <th>Branch Code</th>
                          <th>Town</th>
                          <th>Remarks</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.slice(0, 20).map((branch, index) => (
                          <tr key={index}>
                            <td>{branch.branchName}</td>
                            <td>{branch.branchCode}</td>
                            <td>{branch.town}</td>
                            <td>{branch.remarks}</td>
                            <td>{branch.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 20 && (
                      <p className="posta-branches-preview-more">...and {importPreview.length - 5} more branches</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="posta-branches-modal-footer">
              <button
                className="posta-branches-btn secondary"
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
                className="posta-branches-btn primary"
                onClick={handleImportBranches}
                disabled={importPreview.length === 0 || isImporting}
              >
                {isImporting ? `Importing ${importPreview.length} Branches...` : `Import ${importPreview.length} Branches`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Branch Modal */}
      {selectedBranch && (
        <div className="posta-branches-modal-overlay">
          <div className="posta-branches-modal">
            <div className="posta-branches-modal-header">
              <h2 className="posta-branches-modal-title">Branch Details</h2>
              <button
                className="posta-branches-modal-close"
                onClick={() => setSelectedBranch(null)}
              >
                <X className="posta-branches-modal-close-icon" />
              </button>
            </div>
            <div className="posta-branches-modal-body">
              <div className="posta-branches-view-group">
                <label className="posta-branches-view-label">Branch Name</label>
                <p className="posta-branches-view-value">{selectedBranch.branchName}</p>
              </div>
              <div className="posta-branches-view-group">
                <label className="posta-branches-view-label">Branch Code</label>
                <p className="posta-branches-view-value">{selectedBranch.branchCode}</p>
              </div>
              <div className="posta-branches-view-group">
                <label className="posta-branches-view-label">Town</label>
                <p className="posta-branches-view-value">{selectedBranch.town}</p>
              </div>
              <div className="posta-branches-view-group">
                <label className="posta-branches-view-label">Remarks</label>
                <p className="posta-branches-view-value">{selectedBranch.remarks}</p>
              </div>
              <div className="posta-branches-view-group">
                <label className="posta-branches-view-label">Status</label>
                <p className="posta-branches-view-value">{selectedBranch.status}</p>
              </div>
            </div>
            <div className="posta-branches-modal-footer">
              <button
                className="posta-branches-btn secondary"
                onClick={() => setSelectedBranch(null)}
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

export default PostaBranches;
