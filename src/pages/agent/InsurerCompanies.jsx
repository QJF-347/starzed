import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Phone, Mail, MapPin, Globe, Users, FileText, ArrowLeft, Search, Plus, Edit, Trash2, Eye, Upload, Download, X, FolderOpen, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import Pagination from '../../components/Pagination';
import '../../components/Pagination.css';
import './InsurerCompanies.css';
import apiService from '../../services/api';

const InsurerCompanies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  const [documents, setDocuments] = useState([]);

  const [newCompany, setNewCompany] = useState({
    name: '',
    paybillNumber: '',
    address: '',
    mobile: '',
    email: '',
    website: ''
  });

  const [newFile, setNewFile] = useState({
    companyId: '',
    file: null,
    description: ''
  });

  // Fetch companies from database on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCompanies();
      // Extract the data array from the API response
      let companiesData = response.success ? response.data : [];
      
      // Ensure we have an array
      if (!Array.isArray(companiesData)) {
        console.warn('API response data is not an array:', companiesData);
        companiesData = [];
      }
      
      // Map the data to handle the expected format
      const mappedCompanies = companiesData.map(company => ({
        id: company.id,
        name: company.name || company.display_name || '',
        display_name: company.display_name || company.name || '',
        paybillNumber: company.contact?.phone || '',
        address: company.contact?.address || company.headquarters || '',
        mobile: company.contact?.phone || '',
        email: company.contact?.email || '',
        website: company.website || '',
        description: company.description || '',
        status: company.active ? 'Active' : 'Inactive',
        established: company.established || '',
        logo: company.logo || '',
        createdAt: company.created_at,
        updatedAt: company.updated_at
      }));
      
      setCompanies(mappedCompanies);
    } catch (error) {
      console.warn('Error fetching companies, working in offline mode:', error.message);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddCompany = async () => {
    if (!newCompany.name?.trim()) {
      alert('Please fill in at least Company Name.');
      return;
    }

    const companyData = {
      name: newCompany.name,
      displayName: newCompany.name,
      description: `Insurance company - ${newCompany.name}`,
      logo: '/assets/default-company-logo.png',
      website: newCompany.website || `https://${newCompany.name.toLowerCase().replace(/\s+/g, '')}.com`,
      contact: {
        phone: newCompany.mobile || '',
        email: newCompany.email || '',
        address: newCompany.address || ''
      },
      established: 2024,
      headquarters: newCompany.address || '',
      licensed: true,
      active: true
    };

    try {
      const response = await apiService.createCompany(companyData);
      if (response.success) {
        await fetchCompanies();
        setNewCompany({ name: '', paybillNumber: '', address: '', mobile: '', email: '', website: '' });
        setShowAddCompanyModal(false);
        alert('Company successfully added to database!');
      } else {
        throw new Error(response.message || 'Failed to add company');
      }
    } catch (error) {
      console.error('Error adding company:', error);
      
      // Check if it's a validation error related to displayName (deployment in progress)
      const errorMessage = error.message || '';
      if (errorMessage.includes('Validation errors') && errorMessage.includes('displayName')) {
        alert('Backend deployment is currently updating. Company will be added locally and saved to database automatically once deployment completes.');
        
        // Fallback to local state
        const company = {
          id: `local_${Date.now()}`,
          ...companyData,
          status: 'Active'
        };
        setCompanies(prev => [...prev, company]);
        setNewCompany({ name: '', paybillNumber: '', address: '', mobile: '', email: '', website: '' });
        setShowAddCompanyModal(false);
        return;
      }
      
      // For other errors, still fall back to local state
      const company = {
        id: `local_${Date.now()}`,
        ...companyData,
        status: 'Active'
      };
      setCompanies(prev => [...prev, company]);
      setNewCompany({ name: '', paybillNumber: '', address: '', mobile: '', email: '', website: '' });
      setShowAddCompanyModal(false);
      alert(`Company added locally. ${error.message ? `Backend unavailable: ${error.message}` : 'Working in offline mode.'}`);
    }
  };

  const handleEditCompany = async () => {
    if (!editingCompany?.name?.trim()) {
      alert('Please fill in at least Company Name.');
      return;
    }

    const companyData = {
      name: editingCompany.name,
      displayName: editingCompany.displayName || editingCompany.name,
      description: editingCompany.description || `Insurance company - ${editingCompany.name}`,
      logo: editingCompany.logo || '/assets/default-company-logo.png',
      website: editingCompany.website || `https://${editingCompany.name.toLowerCase().replace(/\s+/g, '')}.com`,
      contact: {
        phone: editingCompany.mobile || '',
        email: editingCompany.email || '',
        address: editingCompany.address || ''
      },
      established: editingCompany.established || 2024,
      headquarters: editingCompany.headquarters || editingCompany.address || '',
      licensed: true,
      active: true
    };

    try {
      const response = await apiService.updateCompany(editingCompany.id, companyData);
      if (response.success) {
        await fetchCompanies();
        setEditingCompany(null);
        setShowEditCompanyModal(false);
        alert('Company successfully updated in database!');
      } else {
        throw new Error(response.message || 'Failed to update company');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      // Fallback to local state
      setCompanies(prev => prev.map(company => 
        company.id === editingCompany.id ? { ...editingCompany, ...companyData } : company
      ));
      setEditingCompany(null);
      setShowEditCompanyModal(false);
      alert(`Company updated locally. ${error.message ? `Database unavailable: ${error.message}` : 'Working in offline mode.'}`);
    }
  };

  const openEditModal = (company) => {
    setEditingCompany({...company});
    setShowEditCompanyModal(true);
  };

  const exportToExcel = () => {
    const data = companies.map(company => ({
      'Insurance Company Name': company.name,
      'Paybill Number': company.paybillNumber,
      'Address': company.address,
      'Mobile': company.mobile,
      'Email': company.email,
      'Status': company.status
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `insurance_companies_${new Date().toISOString().split('T')[0]}.csv`);
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
    
    if (isValidType) {
      const reader = new FileReader();
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Error reading file. Please try again.');
      };
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Parse Excel data - only require company name
          let jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Handle case where first row is data, not headers
          if (jsonData.length > 0 && !jsonData[0].hasOwnProperty('Company Name') && !jsonData[0].hasOwnProperty('name') && !jsonData[0].hasOwnProperty('Insurer Name')) {
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
            jsonData = rawRows
              .filter(row => Array.isArray(row) && row.length >= 1 && row[0]) // Only require first column (name)
              .map(row => ({
                name: row[0].toString().trim()
              }));
          }
          
          // Filter to only companies with names
          const validCompanies = jsonData
            .filter(company => company.name && company.name.trim() !== '')
            .map(company => ({
              name: company.name.toString().trim()
            }));
          
          if (validCompanies.length === 0) {
            alert('No valid companies found in the Excel file. Please ensure at least the company name is filled.');
            return;
          }
          
          // Try to import to backend, fallback to local
          try {
            const response = await apiService.bulkImportCompanies(validCompanies);
            if (response.success) {
              await fetchCompanies();
              alert(`Successfully imported ${response.created_companies?.length || validCompanies.length} companies to the database!${response.failed_companies?.length > 0 ? ` Failed: ${response.failed_companies.length}` : ''}`);
            } else {
              throw new Error(response.message || 'Failed to import companies');
            }
          } catch (error) {
            console.error('Error importing companies:', error);
            // Fallback to local state
            setCompanies(prev => [...prev, ...validCompanies.map((company, index) => ({
              ...company,
              id: `local_${Date.now()}_${index}`,
              status: 'Active'
            }))]);
            alert(`Companies imported locally. ${error.message ? `Database unavailable: ${error.message}` : 'Working in offline mode.'}`);
          }
          
        } catch (error) {
          console.error('Error processing Excel file:', error);
          alert('Error processing Excel file. Please check the file format and try again.');
        }
      };
      
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please select a valid Excel file (.xlsx or .xls)');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async () => {
    if (!newFile.companyId || !newFile.file || !newFile.description) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    try {
      // Try Google Drive upload first
      const formData = new FormData();
      formData.append('file', newFile.file);
      formData.append('company_id', newFile.companyId);
      
      // Find company name
      const company = companies.find(c => c.id === newFile.companyId);
      const companyName = company ? company.name : 'Unknown Company';
      formData.append('company_name', companyName);
      
      formData.append('description', newFile.description);
      
      const response = await fetch(`${apiService.baseURL}/upload/google-drive/`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header, let browser set it with boundary
          // for multipart/form-data
        }
      }).then(res => res.json());
      
      if (response.success) {
        const document = {
          id: response.data.id,
          companyId: newFile.companyId,
          fileName: response.data.file_name,
          size: `${(response.data.file_size / (1024 * 1024)).toFixed(2)} MB`,
          description: newFile.description,
          date: new Date().toISOString().split('T')[0],
          googleDriveUrl: response.data.google_drive_url,
          googleDriveFileId: response.data.google_drive_file_id,
          uploadedAt: response.data.uploaded_at,
          isGoogleDrive: true
        };
        
        setDocuments([...documents, document]);
        setNewFile({ companyId: '', file: null, description: '' });
        setShowUploadModal(false);
        alert('Document uploaded successfully to Google Drive!');
      } else {
        throw new Error(response.message || 'Google Drive upload failed');
      }
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      
      // Check if it's a Google auth error
      if (error.message.includes('Google Drive credentials') || error.message.includes('access token')) {
        alert('Google Drive authentication required. Please authenticate with Google first.');
        // TODO: Trigger Google OAuth flow
        return;
      }
      
      // Fallback to local upload if Google Drive fails
      try {
        const response = await apiService.uploadFile(newFile.file);
        
        if (response.success) {
          const document = {
            id: documents.length + 1,
            companyId: newFile.companyId,
            fileName: newFile.file.name,
            size: `${(newFile.file.size / (1024 * 1024)).toFixed(2)} MB`,
            description: newFile.description,
            date: new Date().toISOString().split('T')[0],
            url: response.data.url,
            path: response.data.path,
            uploadedAt: new Date().toISOString(),
            isLocal: true
          };
          
          setDocuments([...documents, document]);
          setNewFile({ companyId: '', file: null, description: '' });
          setShowUploadModal(false);
          alert('Document uploaded locally (Google Drive unavailable).');
        } else {
          throw new Error(response.message || 'Local upload failed');
        }
      } catch (localError) {
        // Final fallback to local state
        const document = {
          id: documents.length + 1,
          companyId: newFile.companyId,
          fileName: newFile.file.name,
          size: `${(newFile.file.size / (1024 * 1024)).toFixed(2)} MB`,
          description: newFile.description,
          date: new Date().toISOString().split('T')[0],
          uploadedAt: new Date().toISOString(),
          local: true
        };
        
        setDocuments([...documents, document]);
        setNewFile({ companyId: '', file: null, description: '' });
        setShowUploadModal(false);
        alert(`Document saved locally. Backend unavailable: ${localError.message}`);
      }
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      const response = await apiService.deleteCompany(companyId);
      if (response.success) {
        await fetchCompanies();
        alert('Company deleted successfully!');
      } else {
        throw new Error(response.message || 'Failed to delete company');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      
      // Fallback to local state if backend fails
      setCompanies(prev => prev.filter(company => company.id !== companyId));
      alert(`Company deleted locally. Backend unavailable: ${error.message}`);
    }
  };

  const handleOpenDocument = (document) => {
    if (document.googleDriveUrl) {
      // Open Google Drive link in new tab
      window.open(document.googleDriveUrl, '_blank');
    } else if (document.url) {
      // Open local file link in new tab
      window.open(document.url, '_blank');
    } else {
      alert('Document link not available');
    }
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const getCompanyDocuments = (companyId) => {
    return documents.filter(doc => doc.companyId === companyId);
  };

  return (
    <div className="insurer-companies-container">
      {/* Header */}
      <div className="insurer-companies-header">
        <div className="insurer-companies-header-content">
          <div className="insurer-companies-header-left">
            <h1 className="insurer-companies-title">Insurance Companies</h1>
            <p className="insurer-companies-subtitle">Manage insurance companies and their documents</p>
          </div>
          <div className="insurer-companies-header-actions">
            <button className="insurer-companies-btn" onClick={triggerFileUpload}>
              <Upload className="insurer-companies-btn-icon" />
              Import Excel
            </button>
            <button className="insurer-companies-btn" onClick={exportToExcel}>
              <FileSpreadsheet className="insurer-companies-btn-icon" />
              Export to Excel
            </button>
            <button className="insurer-companies-btn" onClick={() => setShowUploadModal(true)}>
              <FolderOpen className="insurer-companies-btn-icon" />
              Upload Document
            </button>
            <button className="insurer-companies-btn primary" onClick={() => setShowAddCompanyModal(true)}>
              <Plus className="insurer-companies-btn-icon" />
              Add Company
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="insurer-companies-search-section">
        <div className="insurer-companies-search-wrapper">
          <Search className="insurer-companies-search-icon" />
          <input
            type="text"
            placeholder="Search by company name, address, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="insurer-companies-search-input"
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

      
      {/* Companies Table */}
      <div className="insurer-companies-table-container">
        <div className="insurer-companies-table-wrapper">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#64748b' }}>
              Loading companies...
            </div>
          ) : paginatedCompanies.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#64748b' }}>
              <Building style={{ width: '3rem', height: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                {searchTerm ? 'No companies found matching your search' : 'No companies yet'}
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Add your first company or import from Excel'}
              </p>
              {!searchTerm && (
                <button className="insurer-companies-btn primary" onClick={() => setShowAddCompanyModal(true)}>
                  <Plus className="insurer-companies-btn-icon" />
                  Add First Company
                </button>
              )}
            </div>
          ) : (
            <table className="insurer-companies-table">
            <thead className="insurer-companies-table-head">
              <tr className="insurer-companies-table-row">
                <th className="insurer-companies-table-header">Insurance Company Name</th>
                <th className="insurer-companies-table-header">Paybill Number</th>
                <th className="insurer-companies-table-header">Address</th>
                <th className="insurer-companies-table-header">Mobile</th>
                <th className="insurer-companies-table-header">Email</th>
                <th className="insurer-companies-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="insurer-companies-table-body">
              {paginatedCompanies.map((company) => (
                <tr key={company.id} className="insurer-companies-table-row">
                  <td className="insurer-companies-table-cell">
                    <div className="insurer-companies-company-info">
                      <div className="insurer-companies-company-name">{company.name}</div>
                    </div>
                  </td>
                  <td className="insurer-companies-table-cell">
                    <span className="insurer-companies-paybill">{company.paybillNumber}</span>
                  </td>
                  <td className="insurer-companies-table-cell">
                    <div className="insurer-companies-address-info">
                      <div className="insurer-companies-address">{company.address}</div>
                    </div>
                  </td>
                  <td className="insurer-companies-table-cell">
                    <div className="insurer-companies-contact-info">
                      <div className="insurer-companies-mobile">{company.mobile}</div>
                    </div>
                  </td>
                  <td className="insurer-companies-table-cell">
                    <div className="insurer-companies-email-info">
                      <div className="insurer-companies-email">{company.email}</div>
                    </div>
                  </td>
                  <td className="insurer-companies-table-cell">
                    <div className="insurer-companies-actions">
                      <button 
                        className="insurer-companies-action-btn view"
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowDocumentsModal(true);
                        }}
                      >
                        <FolderOpen className="insurer-companies-action-icon" />
                      </button>
                      <button className="insurer-companies-action-btn edit" onClick={() => openEditModal(company)}>
                        <Edit className="insurer-companies-action-icon" />
                      </button>
                      <button className="insurer-companies-action-btn delete" onClick={() => handleDeleteCompany(company.id)}>
                        <Trash2 className="insurer-companies-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredCompanies.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Add Company Modal */}
      {showAddCompanyModal && (
        <div className="insurer-companies-modal-overlay">
          <div className="insurer-companies-modal">
            <div className="insurer-companies-modal-header">
              <h2 className="insurer-companies-modal-title">Add New Company</h2>
              <button 
                className="insurer-companies-modal-close"
                onClick={() => setShowAddCompanyModal(false)}
              >
                <X className="insurer-companies-modal-close-icon" />
              </button>
            </div>
            <div className="insurer-companies-modal-body">
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Company Name</label>
                <input
                  type="text"
                  className="insurer-companies-form-input"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Paybill Number</label>
                <input
                  type="text"
                  className="insurer-companies-form-input"
                  value={newCompany.paybillNumber}
                  onChange={(e) => setNewCompany({...newCompany, paybillNumber: e.target.value})}
                  placeholder="Enter paybill number"
                />
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Address</label>
                <input
                  type="text"
                  className="insurer-companies-form-input"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                  placeholder="Enter address"
                />
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Mobile</label>
                <input
                  type="text"
                  className="insurer-companies-form-input"
                  value={newCompany.mobile}
                  onChange={(e) => setNewCompany({...newCompany, mobile: e.target.value})}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Email</label>
                <input
                  type="email"
                  className="insurer-companies-form-input"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="insurer-companies-modal-footer">
              <button 
                className="insurer-companies-btn secondary"
                onClick={() => setShowAddCompanyModal(false)}
              >
                Cancel
              </button>
              <button 
                className="insurer-companies-btn primary"
                onClick={handleAddCompany}
              >
                Add Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditCompanyModal && editingCompany && (
        <div className="insurer-companies-modal-overlay">
          <div className="insurer-companies-modal">
            <div className="insurer-companies-modal-header">
              <h2 className="insurer-companies-modal-title">Edit Company</h2>
              <button 
                className="insurer-companies-modal-close"
                onClick={() => {
                  setShowEditCompanyModal(false);
                  setEditingCompany(null);
                }}
              >
                <X className="insurer-companies-modal-close-icon" />
              </button>
            </div>
            <div className="insurer-companies-modal-body">
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Company Name</label>
                <input
                  type="text"
                  className="insurer-companies-form-input"
                  value={editingCompany.name}
                  onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Paybill Number</label>
                <input
                  type="text"
                  className="insurer-companies-form-input"
                  value={editingCompany.paybillNumber}
                  onChange={(e) => setEditingCompany({...editingCompany, paybillNumber: e.target.value})}
                  placeholder="Enter paybill number"
                />
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Address</label>
                <input
                  type="text"
                  className="insurer-companies-form-input"
                  value={editingCompany.address}
                  onChange={(e) => setEditingCompany({...editingCompany, address: e.target.value})}
                  placeholder="Enter address"
                />
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Mobile</label>
                <input
                  type="text"
                  className="insurer-companies-form-input"
                  value={editingCompany.mobile}
                  onChange={(e) => setEditingCompany({...editingCompany, mobile: e.target.value})}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Email</label>
                <input
                  type="email"
                  className="insurer-companies-form-input"
                  value={editingCompany.email}
                  onChange={(e) => setEditingCompany({...editingCompany, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="insurer-companies-modal-footer">
              <button 
                className="insurer-companies-btn secondary"
                onClick={() => {
                  setShowEditCompanyModal(false);
                  setEditingCompany(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="insurer-companies-btn primary"
                onClick={handleEditCompany}
              >
                Update Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="insurer-companies-modal-overlay">
          <div className="insurer-companies-modal">
            <div className="insurer-companies-modal-header">
              <h2 className="insurer-companies-modal-title">Upload Document</h2>
              <button 
                className="insurer-companies-modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                <X className="insurer-companies-modal-close-icon" />
              </button>
            </div>
            <div className="insurer-companies-modal-body">
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Select Company</label>
                <select
                  className="insurer-companies-form-select"
                  value={newFile.companyId}
                  onChange={(e) => setNewFile({...newFile, companyId: e.target.value})}
                >
                  <option value="">Choose a company...</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Select File</label>
                <input
                  type="file"
                  className="insurer-companies-form-file"
                  onChange={(e) => setNewFile({...newFile, file: e.target.files[0]})}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>
              <div className="insurer-companies-form-group">
                <label className="insurer-companies-form-label">Description</label>
                <textarea
                  className="insurer-companies-form-textarea"
                  value={newFile.description}
                  onChange={(e) => setNewFile({...newFile, description: e.target.value})}
                  placeholder="Enter document description"
                  rows="3"
                />
              </div>
            </div>
            <div className="insurer-companies-modal-footer">
              <button 
                className="insurer-companies-btn secondary"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button 
                className="insurer-companies-btn primary"
                onClick={handleFileUpload}
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && selectedCompany && (
        <div className="insurer-companies-modal-overlay">
          <div className="insurer-companies-modal large">
            <div className="insurer-companies-modal-header">
              <h2 className="insurer-companies-modal-title">
                Documents - {selectedCompany.name}
              </h2>
              <button 
                className="insurer-companies-modal-close"
                onClick={() => setShowDocumentsModal(false)}
              >
                <X className="insurer-companies-modal-close-icon" />
              </button>
            </div>
            <div className="insurer-companies-modal-body">
              <div className="insurer-companies-documents-table-container">
                <table className="insurer-companies-documents-table">
                  <thead className="insurer-companies-documents-table-head">
                    <tr className="insurer-companies-documents-table-row">
                      <th className="insurer-companies-documents-table-header">File Name</th>
                      <th className="insurer-companies-documents-table-header">Size</th>
                      <th className="insurer-companies-documents-table-header">Description</th>
                      <th className="insurer-companies-documents-table-header">Date</th>
                      <th className="insurer-companies-documents-table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="insurer-companies-documents-table-body">
                    {getCompanyDocuments(selectedCompany.id).map((doc) => (
                      <tr key={doc.id} className="insurer-companies-documents-table-row">
                        <td className="insurer-companies-documents-table-cell">
                          <div className="insurer-companies-file-info">
                            <FileText className="insurer-companies-file-icon" />
                            <button 
                              className="insurer-companies-file-name-link"
                              onClick={() => handleOpenDocument(doc)}
                              title={doc.isGoogleDrive ? "Open in Google Drive" : "Open file"}
                            >
                              {doc.fileName}
                            </button>
                            {doc.isGoogleDrive && (
                              <span className="insurer-companies-google-drive-badge">Drive</span>
                            )}
                          </div>
                        </td>
                        <td className="insurer-companies-documents-table-cell">
                          <span className="insurer-companies-file-size">{doc.size}</span>
                        </td>
                        <td className="insurer-companies-documents-table-cell">
                          <span className="insurer-companies-file-description">{doc.description}</span>
                        </td>
                        <td className="insurer-companies-documents-table-cell">
                          <span className="insurer-companies-file-date">{doc.date}</span>
                        </td>
                        <td className="insurer-companies-documents-table-cell">
                          <div className="insurer-companies-document-actions">
                            <button className="insurer-companies-document-action-btn download">
                              <Download className="insurer-companies-document-action-icon" />
                            </button>
                            <button 
                              className="insurer-companies-document-action-btn delete"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="insurer-companies-document-action-icon" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="insurer-companies-modal-footer">
              <button 
                className="insurer-companies-btn secondary"
                onClick={() => setShowDocumentsModal(false)}
              >
                Close
              </button>
              <button 
                className="insurer-companies-btn primary"
                onClick={() => {
                  setShowDocumentsModal(false);
                  setShowUploadModal(true);
                  setNewFile({...newFile, companyId: selectedCompany.id});
                }}
              >
                Add New Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsurerCompanies;
