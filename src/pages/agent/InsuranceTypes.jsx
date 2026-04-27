import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Search, Plus, Edit, Trash2, Eye, Building, Users, DollarSign, TrendingUp, Star, X, FileSpreadsheet, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import apiService from '../../services/api';
import './InsuranceTypes.css';

const InsuranceTypes = () => {
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [editingType, setEditingType] = useState(null);

  const [insuranceTypes, setInsuranceTypes] = useState([]);

  const loadInsuranceTypes = async () => {
    const response = await apiService.getInsuranceTypes();
    const data = Array.isArray(response?.data) ? response.data : [];
    setInsuranceTypes(data);
  };

  useEffect(() => {
    loadInsuranceTypes().catch((e) => {
      console.error('Failed to load insurance types:', e);
    });
  }, []);

  const [newType, setNewType] = useState({
    type: '',
    description: '',
    status: 'Active'
  });

  const filteredTypes = insuranceTypes.filter(type =>
    type.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddType = async () => {
    if (newType.type && newType.description) {
      try {
        await apiService.createInsuranceType(newType);
        await loadInsuranceTypes();
        setNewType({ type: '', description: '', status: 'Active' });
        setShowAddModal(false);
      } catch (e) {
        console.error('Failed to create insurance type:', e);
        alert(e?.message || 'Failed to create insurance type');
      }
    }
  };

  const handleEditType = async () => {
    if (editingType && editingType.type && editingType.description) {
      try {
        await apiService.request(`/insurance-types/${editingType.id}/`, {
          method: 'PATCH',
          body: JSON.stringify({
            type: editingType.type,
            description: editingType.description,
            status: editingType.status || 'Active'
          }),
        });
        await loadInsuranceTypes();
        setEditingType(null);
        setShowEditModal(false);
      } catch (e) {
        console.error('Failed to update insurance type:', e);
        alert(e?.message || 'Failed to update insurance type');
      }
    }
  };

  const openEditModal = (type) => {
    setEditingType({...type});
    setShowEditModal(true);
  };

  const handleDeleteType = async (typeId) => {
    try {
      await apiService.request(`/insurance-types/${typeId}/`, {
        method: 'DELETE',
      });
      await loadInsuranceTypes();
    } catch (e) {
      console.error('Failed to delete insurance type:', e);
      alert(e?.message || 'Failed to delete insurance type');
    }
  };

  const exportToExcel = () => {
    const data = insuranceTypes.map(type => ({
      'Class/Product Type': type.type,
      'Description': type.description,
      'Status': type.status
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `insurance_types_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcelImport = async (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      alert('Please select a file to import.');
      return;
    }

    const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                        file.type === 'application/vnd.ms-excel' ||
                        file.name.endsWith('.xlsx') ||
                        file.name.endsWith('.xls');

    if (!isValidType) {
      alert('Invalid file type. Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => alert('Error reading file. Please try again.');
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Handle case where first row is data, not headers
        if (jsonData.length > 0 && !jsonData[0].hasOwnProperty('Class/Product Type') && !jsonData[0].hasOwnProperty('type') && !jsonData[0].hasOwnProperty('Type')) {
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
          jsonData = rawRows
            .filter(row => Array.isArray(row) && row.length >= 1 && row[0]) // Only require type
            .map(row => ({
              type: row[0].toString().trim(),
              description: row[1] ? row[1].toString().trim() : '',
              status: 'Active'
            }));
        }

        // Filter and clean the imported data
        const validTypes = jsonData
          .filter(item => item.type && item.type.toString().trim() !== '')
          .map(item => ({
            type: item.type.toString().trim(),
            description: item.description ? item.description.toString().trim() : '',
            status: item.status || 'Active'
          }));

        if (validTypes.length === 0) {
          alert('No valid insurance types found in the Excel file. Please ensure at least the type is filled.');
          return;
        }

        const importResponse = await apiService.bulkImportInsuranceTypes(validTypes);
        await loadInsuranceTypes();
        const created = Array.isArray(importResponse?.created) ? importResponse.created.length : 0;
        const updated = Array.isArray(importResponse?.updated) ? importResponse.updated.length : 0;
        const failed = Array.isArray(importResponse?.failed) ? importResponse.failed.length : 0;
        alert(`Import completed. Created: ${created}, Updated: ${updated}, Failed: ${failed}`);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please check the file format and try again.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="insurance-types-container">
      {/* Header */}
      <div className="insurance-types-header">
        <div className="insurance-types-header-content">
          <div className="insurance-types-header-left">
            <h1 className="insurance-types-title">Insurance Types/Classes</h1>
            <p className="insurance-types-subtitle">Manage insurance product types and classes</p>
          </div>
          <div className="insurance-types-header-actions">
            <button className="insurance-types-btn" onClick={triggerFileUpload}>
              <Upload className="insurance-types-btn-icon" />
              Import Excel
            </button>
            <button className="insurance-types-btn" onClick={exportToExcel}>
              <FileSpreadsheet className="insurance-types-btn-icon" />
              Export to Excel
            </button>
            <button className="insurance-types-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus className="insurance-types-btn-icon" />
              Add Type
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="insurance-types-search-section">
        <div className="insurance-types-search-wrapper">
          <Search className="insurance-types-search-icon" />
          <input
            type="text"
            placeholder="Search by type or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="insurance-types-search-input"
          />
        </div>
      </div>

      {/* Hidden file input for Excel import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleExcelImport}
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
      />

      
      {/* Types Table */}
      <div className="insurance-types-table-container">
        <div className="insurance-types-table-wrapper">
          {filteredTypes.length === 0 ? (
            <div className="insurance-types-empty-state">
              <Shield size={48} opacity={0.5} />
              <h3>
                {searchTerm ? 'No insurance types found matching your search' : 'No insurance types yet'}
              </h3>
              <p>
                {searchTerm ? 'Try adjusting your search terms' : 'Add your first insurance type or import from Excel'}
              </p>
              {!searchTerm && (
                <button className="insurance-types-btn primary" onClick={() => setShowAddModal(true)}>
                  <Plus className="insurance-types-btn-icon" />
                  Add First Type
                </button>
              )}
            </div>
          ) : (
            <table className="insurance-types-table">
              <thead className="insurance-types-table-head">
                <tr className="insurance-types-table-row">
                  <th className="insurance-types-table-header">Class/Product Type</th>
                  <th className="insurance-types-table-header">Description</th>
                  <th className="insurance-types-table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="insurance-types-table-body">
                {filteredTypes.map((type) => (
                  <tr key={type.id} className="insurance-types-table-row">
                    <td className="insurance-types-table-cell">
                      <div className="insurance-types-type-info">
                        <div className="insurance-types-type-name">{type.type}</div>
                      </div>
                    </td>
                    <td className="insurance-types-table-cell">
                      <div className="insurance-types-description-info">
                        <div className="insurance-types-description">{type.description}</div>
                      </div>
                    </td>
                    <td className="insurance-types-table-cell">
                      <div className="insurance-types-actions">
                        <button className="insurance-types-action-btn view">
                          <Eye className="insurance-types-action-icon" />
                        </button>
                        <button className="insurance-types-action-btn edit" onClick={() => openEditModal(type)}>
                          <Edit className="insurance-types-action-icon" />
                        </button>
                        <button className="insurance-types-action-btn delete" onClick={() => handleDeleteType(type.id)}>
                          <Trash2 className="insurance-types-action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Type Modal */}
      {showAddModal && (
        <div className="insurance-types-modal-overlay">
          <div className="insurance-types-modal">
            <div className="insurance-types-modal-header">
              <h2 className="insurance-types-modal-title">Add New Insurance Type</h2>
              <button 
                className="insurance-types-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <X className="insurance-types-modal-close-icon" />
              </button>
            </div>
            <div className="insurance-types-modal-body">
              <div className="insurance-types-form-group">
                <label className="insurance-types-form-label">Class/Product Type</label>
                <input
                  type="text"
                  className="insurance-types-form-input"
                  value={newType.type}
                  onChange={(e) => setNewType({...newType, type: e.target.value})}
                  placeholder="Enter insurance type"
                />
              </div>
              <div className="insurance-types-form-group">
                <label className="insurance-types-form-label">Description</label>
                <textarea
                  className="insurance-types-form-textarea"
                  value={newType.description}
                  onChange={(e) => setNewType({...newType, description: e.target.value})}
                  placeholder="Enter description"
                  rows="4"
                />
              </div>
            </div>
            <div className="insurance-types-modal-footer">
              <button 
                className="insurance-types-btn secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="insurance-types-btn primary"
                onClick={handleAddType}
              >
                Add Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Type Modal */}
      {showEditModal && editingType && (
        <div className="insurance-types-modal-overlay">
          <div className="insurance-types-modal">
            <div className="insurance-types-modal-header">
              <h2 className="insurance-types-modal-title">Edit Insurance Type</h2>
              <button 
                className="insurance-types-modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingType(null);
                }}
              >
                <X className="insurance-types-modal-close-icon" />
              </button>
            </div>
            <div className="insurance-types-modal-body">
              <div className="insurance-types-form-group">
                <label className="insurance-types-form-label">Class/Product Type</label>
                <input
                  type="text"
                  className="insurance-types-form-input"
                  value={editingType.type}
                  onChange={(e) => setEditingType({...editingType, type: e.target.value})}
                  placeholder="Enter insurance type"
                />
              </div>
              <div className="insurance-types-form-group">
                <label className="insurance-types-form-label">Description</label>
                <textarea
                  className="insurance-types-form-textarea"
                  value={editingType.description}
                  onChange={(e) => setEditingType({...editingType, description: e.target.value})}
                  placeholder="Enter description"
                  rows="4"
                />
              </div>
            </div>
            <div className="insurance-types-modal-footer">
              <button 
                className="insurance-types-btn secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingType(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="insurance-types-btn primary"
                onClick={handleEditType}
              >
                Update Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceTypes;
