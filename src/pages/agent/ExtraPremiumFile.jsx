import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Trash2, FileSpreadsheet, X, DollarSign, ArrowLeft, Calculator, CheckCircle, AlertTriangle, Clock, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import apiService from '../../services/api';
import './ExtraPremiumFile.css';

const ExtraPremiumFile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedExtraPremium, setSelectedExtraPremium] = useState(null);
  const [editingExtraPremium, setEditingExtraPremium] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const [extraPremiums, setExtraPremiums] = useState([]);

  const calculationModes = [
    'Percentage of Base Premium',
    'Fixed Amount',
    'Per Vehicle',
    'Per Thousand Sum Insured',
    'Flat Rate',
    'Sliding Scale'
  ];

  const [newExtraPremium, setNewExtraPremium] = useState({
    extraPremiumName: '',
    description: '',
    calculationMode: '',
    rate: '',
    status: 'Active',
    applicableTo: ''
  });

  const filteredExtraPremiums = extraPremiums.filter(extraPremium =>
    extraPremium.extraPremiumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extraPremium.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extraPremium.calculationMode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extraPremium.applicableTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExtraPremium = () => {
    if (newExtraPremium.extraPremiumName && newExtraPremium.description && newExtraPremium.calculationMode && newExtraPremium.rate && newExtraPremium.applicableTo) {
      const extraPremium = {
        id: extraPremiums.length + 1,
        ...newExtraPremium
      };
      setExtraPremiums([...extraPremiums, extraPremium]);
      setNewExtraPremium({ extraPremiumName: '', description: '', calculationMode: '', rate: '', status: 'Active', applicableTo: '' });
      setShowAddModal(false);
    }
  };

  const handleEditExtraPremium = () => {
    if (editingExtraPremium && editingExtraPremium.extraPremiumName && editingExtraPremium.description && editingExtraPremium.calculationMode && editingExtraPremium.rate && editingExtraPremium.applicableTo) {
      setExtraPremiums(extraPremiums.map(extraPremium => 
        extraPremium.id === editingExtraPremium.id ? editingExtraPremium : extraPremium
      ));
      setEditingExtraPremium(null);
      setShowEditModal(false);
    }
  };

  const openEditModal = (extraPremium) => {
    setEditingExtraPremium({...extraPremium});
    setShowEditModal(true);
  };

  const openViewModal = (extraPremium) => {
    setSelectedExtraPremium(extraPremium);
    setShowViewModal(true);
  };

  const handleDeleteExtraPremium = (extraPremiumId) => {
    setExtraPremiums(extraPremiums.filter(extraPremium => extraPremium.id !== extraPremiumId));
  };

  const exportToExcel = () => {
    const data = extraPremiums.map(extraPremium => ({
      'Extra Premium Name': extraPremium.extraPremiumName,
      'Description': extraPremium.description,
      'Calculation Mode': extraPremium.calculationMode,
      'Rate': extraPremium.rate,
      'Status': extraPremium.status,
      'Applicable To': extraPremium.applicableTo
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `extra_premium_file_${new Date().toISOString().split('T')[0]}.csv`);
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

      const toStr = (value) => {
        if (value === null || value === undefined) return '';
        return String(value);
      };

      const trimStr = (value) => toStr(value).trim();

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

        // Find the name column
        const nameColumnIndex = headers.findIndex(h => 
          h.toLowerCase().includes('name') || 
          h.toLowerCase().includes('premium')
        );

        if (nameColumnIndex === -1) {
          errors.push('File must contain a column with "Name" or "Premium" in the header');
          setImportErrors(errors);
          setImportPreview([]);
          return;
        }

        const parsedPremiums = [];

        for (let i = 0; i < data.length; i++) {
          const values = data[i];
          const premiumName = trimStr(values[nameColumnIndex]);

          if (!premiumName) {
            errors.push(`Row ${i + 2}: Premium name is required`);
            continue;
          }

          // Extract other optional columns
          const descriptionIndex = headers.findIndex(h => h.toLowerCase().includes('description'));
          const calculationIndex = headers.findIndex(h => h.toLowerCase().includes('calculation') || h.toLowerCase().includes('mode'));
          const rateIndex = headers.findIndex(h => h.toLowerCase().includes('rate'));
          const statusIndex = headers.findIndex(h => h.toLowerCase().includes('status'));
          const applicableIndex = headers.findIndex(h => h.toLowerCase().includes('applicable'));

          const premium = {
            extraPremiumName: premiumName,
            description: descriptionIndex !== -1 ? trimStr(values[descriptionIndex]) : '',
            calculationMode: calculationIndex !== -1 ? trimStr(values[calculationIndex]) || 'Fixed Amount' : 'Fixed Amount',
            rate: rateIndex !== -1 ? trimStr(values[rateIndex]) || '0' : '0',
            status: statusIndex !== -1 ? trimStr(values[statusIndex]) || 'Active' : 'Active',
            applicableTo: applicableIndex !== -1 ? trimStr(values[applicableIndex]) || 'All' : 'All'
          };

          parsedPremiums.push(premium);
        }

        setImportPreview(parsedPremiums);
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

  const handleImportPremiums = async () => {
    if (importPreview.length === 0) return;

    setIsImporting(true);
    
    try {
      // Try to import via API first
      const response = await apiService.bulkImportExtraPremiums(importPreview);
      
      if (response.success) {
        // Refresh premiums from API
        const updatedPremiums = await apiService.getExtraPremiums();
        setExtraPremiums(updatedPremiums.data || []);
        
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
        const newPremiums = importPreview.map((premium, index) => ({
          id: extraPremiums.length + index + 1,
          ...premium
        }));

        setExtraPremiums([...extraPremiums, ...newPremiums]);
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
      const newPremiums = importPreview.map((premium, index) => ({
        id: extraPremiums.length + index + 1,
        ...premium
      }));

      setExtraPremiums([...extraPremiums, ...newPremiums]);
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
    const sampleContent = 'Extra Premium Name,Description,Calculation Mode,Rate,Status,Applicable To\n' +
      'Young Driver Surcharge,Additional premium for drivers under 25,Percentage of Base Premium,15%,Active,Private\n' +
      'High Performance Vehicle,Loading for sports cars,Fixed Amount,5000,Active,Commercial\n' +
      'Previous Claims,Loading for claim history,Per Thousand Sum Insured,2,Active,All';

    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'extra_premium_import_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="extra-premium-file-container">
      {/* Header */}
      <div className="extra-premium-header">
        <div className="extra-premium-header-content">
          <div className="extra-premium-header-left">
            <h1 className="extra-premium-title">Extra Premium File</h1>
            <p className="extra-premium-subtitle">Manage extra premium calculations and loading factors</p>
          </div>
          <div className="extra-premium-header-actions">
            <button className="extra-premium-btn" onClick={() => setShowImportModal(true)}>
              <Upload className="extra-premium-btn-icon" />
              Import Premiums
            </button>
            <button className="extra-premium-btn" onClick={exportToExcel}>
              <FileSpreadsheet className="extra-premium-btn-icon" />
              Export to Excel
            </button>
            <button className="extra-premium-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus className="extra-premium-btn-icon" />
              Add Extra Premium
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="extra-premium-search-section">
        <div className="extra-premium-search-wrapper">
          <Search className="extra-premium-search-icon" />
          <input
            type="text"
            placeholder="Search by premium name, description, calculation mode, or applicability..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="extra-premium-search-input"
          />
        </div>
      </div>

      {/* Extra Premium Table */}
      <div className="extra-premium-table-container">
        <div className="extra-premium-table-wrapper">
          <table className="extra-premium-table">
            <thead className="extra-premium-table-head">
              <tr className="extra-premium-table-row">
                <th className="extra-premium-table-header">Extra Premium Name</th>
                <th className="extra-premium-table-header">Description</th>
                <th className="extra-premium-table-header">Calculation Mode</th>
                <th className="extra-premium-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="extra-premium-table-body">
              {filteredExtraPremiums.map((extraPremium) => (
                <tr key={extraPremium.id} className="extra-premium-table-row">
                  <td className="extra-premium-table-cell">
                    <div className="extra-premium-name">{extraPremium.extraPremiumName}</div>
                  </td>
                  <td className="extra-premium-table-cell">
                    <div className="extra-premium-description">{extraPremium.description}</div>
                  </td>
                  <td className="extra-premium-table-cell">
                    <div className="extra-premium-calculation-info">
                      <div className="extra-premium-calculation-mode">{extraPremium.calculationMode}</div>
                      <div className="extra-premium-calculation-icon">
                        {extraPremium.calculationMode === 'Percentage' && <Calculator className="extra-premium-calculation-icon-symbol" />}
                        {extraPremium.calculationMode === 'Fixed Amount' && <DollarSign className="extra-premium-calculation-icon-symbol" />}
                      </div>
                    </div>
                  </td>
                  <td className="extra-premium-table-cell">
                    <div className="extra-premium-actions">
                      <button className="extra-premium-action-btn view" onClick={() => openViewModal(extraPremium)}>
                        <Eye className="extra-premium-action-icon" />
                      </button>
                      <button className="extra-premium-action-btn edit" onClick={() => openEditModal(extraPremium)}>
                        <Edit className="extra-premium-action-icon" />
                      </button>
                      <button className="extra-premium-action-btn delete" onClick={() => handleDeleteExtraPremium(extraPremium.id)}>
                        <Trash2 className="extra-premium-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Extra Premium Modal */}
      {showAddModal && (
        <div className="extra-premium-modal-overlay">
          <div className="extra-premium-modal">
            <div className="extra-premium-modal-header">
              <h2 className="extra-premium-modal-title">Add New Extra Premium</h2>
              <button 
                className="extra-premium-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <X className="extra-premium-modal-close-icon" />
              </button>
            </div>
            <div className="extra-premium-modal-body">
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Extra Premium Name</label>
                <input
                  type="text"
                  className="extra-premium-form-input"
                  value={newExtraPremium.extraPremiumName}
                  onChange={(e) => setNewExtraPremium({...newExtraPremium, extraPremiumName: e.target.value})}
                  placeholder="Enter extra premium name"
                />
              </div>
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Description</label>
                <textarea
                  className="extra-premium-form-textarea"
                  value={newExtraPremium.description}
                  onChange={(e) => setNewExtraPremium({...newExtraPremium, description: e.target.value})}
                  placeholder="Enter description"
                  rows="3"
                />
              </div>
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Calculation Mode</label>
                <select
                  className="extra-premium-form-select"
                  value={newExtraPremium.calculationMode}
                  onChange={(e) => setNewExtraPremium({...newExtraPremium, calculationMode: e.target.value})}
                >
                  <option value="">Select Calculation Mode</option>
                  {calculationModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Rate</label>
                <input
                  type="text"
                  className="extra-premium-form-input"
                  value={newExtraPremium.rate}
                  onChange={(e) => setNewExtraPremium({...newExtraPremium, rate: e.target.value})}
                  placeholder="Enter rate (e.g., 15%, KES 5,000)"
                />
              </div>
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Applicable To</label>
                <input
                  type="text"
                  className="extra-premium-form-input"
                  value={newExtraPremium.applicableTo}
                  onChange={(e) => setNewExtraPremium({...newExtraPremium, applicableTo: e.target.value})}
                  placeholder="Enter applicable insurance types"
                />
              </div>
            </div>
            <div className="extra-premium-modal-footer">
              <button 
                className="extra-premium-btn secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="extra-premium-btn primary"
                onClick={handleAddExtraPremium}
              >
                Add Extra Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Extra Premium Modal */}
      {showEditModal && editingExtraPremium && (
        <div className="extra-premium-modal-overlay">
          <div className="extra-premium-modal">
            <div className="extra-premium-modal-header">
              <h2 className="extra-premium-modal-title">Edit Extra Premium</h2>
              <button 
                className="extra-premium-modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingExtraPremium(null);
                }}
              >
                <X className="extra-premium-modal-close-icon" />
              </button>
            </div>
            <div className="extra-premium-modal-body">
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Extra Premium Name</label>
                <input
                  type="text"
                  className="extra-premium-form-input"
                  value={editingExtraPremium.extraPremiumName}
                  onChange={(e) => setEditingExtraPremium({...editingExtraPremium, extraPremiumName: e.target.value})}
                  placeholder="Enter extra premium name"
                />
              </div>
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Description</label>
                <textarea
                  className="extra-premium-form-textarea"
                  value={editingExtraPremium.description}
                  onChange={(e) => setEditingExtraPremium({...editingExtraPremium, description: e.target.value})}
                  placeholder="Enter description"
                  rows="3"
                />
              </div>
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Calculation Mode</label>
                <select
                  className="extra-premium-form-select"
                  value={editingExtraPremium.calculationMode}
                  onChange={(e) => setEditingExtraPremium({...editingExtraPremium, calculationMode: e.target.value})}
                >
                  <option value="">Select Calculation Mode</option>
                  {calculationModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Rate</label>
                <input
                  type="text"
                  className="extra-premium-form-input"
                  value={editingExtraPremium.rate}
                  onChange={(e) => setEditingExtraPremium({...editingExtraPremium, rate: e.target.value})}
                  placeholder="Enter rate (e.g., 15%, KES 5,000)"
                />
              </div>
              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Applicable To</label>
                <input
                  type="text"
                  className="extra-premium-form-input"
                  value={editingExtraPremium.applicableTo}
                  onChange={(e) => setEditingExtraPremium({...editingExtraPremium, applicableTo: e.target.value})}
                  placeholder="Enter applicable insurance types"
                />
              </div>
            </div>
            <div className="extra-premium-modal-footer">
              <button 
                className="extra-premium-btn secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingExtraPremium(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="extra-premium-btn primary"
                onClick={handleEditExtraPremium}
              >
                Update Extra Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Extra Premiums Modal */}
      {showImportModal && (
        <div className="extra-premium-modal-overlay">
          <div className="extra-premium-modal import-modal">
            <div className="extra-premium-modal-header">
              <h2 className="extra-premium-modal-title">Import Extra Premiums</h2>
              <button 
                className="extra-premium-modal-close"
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
                <X className="extra-premium-modal-close-icon" />
              </button>
            </div>
            <div className="extra-premium-modal-body">
              <div className="extra-premium-import-instructions">
                <h3>Import Instructions</h3>
                <ul>
                  <li>Only the <strong>Extra Premium Name</strong> column is required</li>
                  <li>Optional columns: Description, Calculation Mode, Rate, Status, Applicable To</li>
                  <li>File must be in CSV or Excel format (.xlsx, .xls)</li>
                  <li>First row should contain column headers</li>
                </ul>
                <button className="extra-premium-btn secondary" onClick={downloadSampleCSV}>
                  Download Sample CSV
                </button>
              </div>

              <div className="extra-premium-form-group">
                <label className="extra-premium-form-label">Select CSV or Excel File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="extra-premium-form-input"
                />
              </div>

              {importErrors.length > 0 && (
                <div className="extra-premium-import-errors">
                  <h4>Import Errors:</h4>
                  {importErrors.map((error, index) => (
                    <p key={index} className="extra-premium-error-text">{error}</p>
                  ))}
                </div>
              )}

              {importPreview.length > 0 && (
                <div className="extra-premium-import-preview">
                  <h4>Preview ({importPreview.length} premiums found):</h4>
                  <div className="extra-premium-preview-table">
                    <table className="extra-premium-table">
                      <thead>
                        <tr>
                          <th>Premium Name</th>
                          <th>Description</th>
                          <th>Calculation Mode</th>
                          <th>Rate</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.slice(0, 5).map((premium, index) => (
                          <tr key={index}>
                            <td>{premium.extraPremiumName}</td>
                            <td>{premium.description}</td>
                            <td>{premium.calculationMode}</td>
                            <td>{premium.rate}</td>
                            <td>{premium.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 5 && (
                      <p className="extra-premium-preview-more">...and {importPreview.length - 5} more premiums</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="extra-premium-modal-footer">
              <button 
                className="extra-premium-btn secondary"
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
                className="extra-premium-btn primary"
                onClick={handleImportPremiums}
                disabled={importPreview.length === 0 || isImporting}
              >
                {isImporting ? `Importing ${importPreview.length} Premiums...` : `Import ${importPreview.length} Premiums`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Extra Premium Modal */}
      {showViewModal && selectedExtraPremium && (
        <div className="extra-premium-modal-overlay">
          <div className="extra-premium-modal">
            <div className="extra-premium-modal-header">
              <h2 className="extra-premium-modal-title">Extra Premium Details</h2>
              <button 
                className="extra-premium-modal-close"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedExtraPremium(null);
                }}
              >
                <X className="extra-premium-modal-close-icon" />
              </button>
            </div>
            <div className="extra-premium-modal-body">
              <div className="extra-premium-view-group">
                <label className="extra-premium-view-label">Extra Premium Name</label>
                <p className="extra-premium-view-value">{selectedExtraPremium.extraPremiumName}</p>
              </div>
              <div className="extra-premium-view-group">
                <label className="extra-premium-view-label">Description</label>
                <p className="extra-premium-view-value">{selectedExtraPremium.description}</p>
              </div>
              <div className="extra-premium-view-group">
                <label className="extra-premium-view-label">Calculation Mode</label>
                <p className="extra-premium-view-value">{selectedExtraPremium.calculationMode}</p>
              </div>
              <div className="extra-premium-view-group">
                <label className="extra-premium-view-label">Rate</label>
                <p className="extra-premium-view-value">{selectedExtraPremium.rate}</p>
              </div>
              <div className="extra-premium-view-group">
                <label className="extra-premium-view-label">Status</label>
                <p className="extra-premium-view-value">{selectedExtraPremium.status}</p>
              </div>
              <div className="extra-premium-view-group">
                <label className="extra-premium-view-label">Applicable To</label>
                <p className="extra-premium-view-value">{selectedExtraPremium.applicableTo}</p>
              </div>
            </div>
            <div className="extra-premium-modal-footer">
              <button 
                className="extra-premium-btn secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedExtraPremium(null);
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

export default ExtraPremiumFile;
