import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Plus, Eye, Edit, Trash2, FileSpreadsheet, X, User,
  ArrowLeft, Phone, Mail, MapPin, CreditCard, Upload, FolderOpen
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Pagination from '../../components/Pagination';
import '../../components/Pagination.css';
import './AgentTableEnhancements.css';
import './Clients.css';
import apiService from '../../services/api';

const Clients = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [newFile, setNewFile] = useState({
    clientId: '',
    file: null,
    description: ''
  });
  const [newClient, setNewClient] = useState({
    clientName: '',
    businessName: '',
    idNumber: '',
    mobile: '',
    kraPin: '',
    email: '',
    town: '',
    address: '',
    dateOfBirth: ''
  });

  const fileInputRef = useRef(null);
  const itemsPerPage = 100;

  // Helper: fetch clients from API
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getClients();
      let clientsData = response.success ? response.data : [];

      if (!Array.isArray(clientsData)) {
        console.error('API response data is not an array:', clientsData);
        clientsData = [];
      }

      const mappedClients = clientsData.map(client => ({
        id: client.id,
        clientName: client.client_name || client.name || '',
        businessName: client.business_name || 'Individual',
        idNumber: client.id_number || '',
        mobile: client.mobile || client.phone || '',
        kraPin: client.kra_pin || '',
        email: client.email || '',
        town: client.town || '',
        address: client.address || '',
        dateOfBirth: client.date_of_birth || '',
        createdAt: client.created_at,
        updatedAt: client.updated_at
      }));

      setClients(mappedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return (Array.isArray(clients) ? clients : []).filter(client =>
      (client.clientName || '').toLowerCase().includes(searchLower) ||
      (client.businessName || '').toLowerCase().includes(searchLower) ||
      (client.idNumber || '').includes(searchTerm) ||
      (client.mobile || '').includes(searchTerm) ||
      (client.kraPin || '').toLowerCase().includes(searchLower) ||
      (client.email || '').toLowerCase().includes(searchLower) ||
      (client.town || '').toLowerCase().includes(searchLower) ||
      (client.address || '').toLowerCase().includes(searchLower)
    );
  }, [clients, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Add client (with backend fallback)
  const handleAddClient = async () => {
    if (!newClient.clientName?.trim()) {
      alert('Please fill in at least Client Name.');
      return;
    }

    const clientData = {
      client_name: newClient.clientName,
      business_name: newClient.businessName || 'Individual',
      id_number: newClient.idNumber,
      mobile: newClient.mobile,
      kra_pin: newClient.kraPin,
      email: newClient.email,
      town: newClient.town,
      address: newClient.address,
      date_of_birth: newClient.dateOfBirth || null
    };

    try {
      // Check backend availability
      const testResponse = await fetch('/api/clients', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (testResponse.ok) {
        const response = await apiService.createClient(clientData);
        if (response.success) {
          await fetchClients();
          resetNewClientForm();
          setShowAddModal(false);
          alert('Client successfully added to database!');
        } else {
          throw new Error(response.message || 'Failed to add client');
        }
      } else {
        throw new Error('Backend not available');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      // Fallback to local
      const localClient = {
        id: `local_${Date.now()}`,
        clientName: newClient.clientName,
        businessName: newClient.businessName || 'Individual',
        idNumber: newClient.idNumber,
        mobile: newClient.mobile,
        kraPin: newClient.kraPin,
        email: newClient.email,
        town: newClient.town,
        address: newClient.address,
        dateOfBirth: newClient.dateOfBirth
      };
      setClients(prev => [...prev, localClient]);
      resetNewClientForm();
      setShowAddModal(false);
      alert(`Client added locally. ${error.message ? `Database unavailable: ${error.message}` : 'Working in offline mode.'}`);
    }
  };

  const resetNewClientForm = () => {
    setNewClient({
      clientName: '', businessName: '', idNumber: '', mobile: '',
      kraPin: '', email: '', town: '', address: '', dateOfBirth: ''
    });
  };

  // Edit client
  const handleEditClient = async () => {
    if (!editingClient?.clientName?.trim()) {
      alert('Please fill in at least Client Name.');
      return;
    }

    const clientData = {
      client_name: editingClient.clientName,
      business_name: editingClient.businessName || 'Individual',
      id_number: editingClient.idNumber,
      mobile: editingClient.mobile,
      kra_pin: editingClient.kraPin,
      email: editingClient.email,
      town: editingClient.town,
      address: editingClient.address,
      date_of_birth: editingClient.dateOfBirth || null
    };

    try {
      const response = await apiService.updateClient(editingClient.id, clientData);
      if (response.success) {
        await fetchClients();
        setEditingClient(null);
        setShowEditModal(false);
        alert('Client successfully updated in database!');
      } else {
        throw new Error(response.message || 'Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      setClients(prev => prev.map(client => client.id === editingClient.id ? editingClient : client));
      setEditingClient(null);
      setShowEditModal(false);
      alert(`Client updated locally. Database error: ${error.message}`);
    }
  };

  const openEditModal = (client) => {
    setEditingClient({ ...client });
    setShowEditModal(true);
  };

  const openViewModal = (client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  };

  const fetchClientDocuments = async (clientId) => {
    try {
      const res = await fetch(`${apiService.baseURL}/clients/${clientId}/documents/`).then(r => r.json());
      if (res && res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((d) => ({
          id: d.id,
          clientId: d.client,
          fileName: d.file_name,
          size: d.file_size ? `${(d.file_size / (1024 * 1024)).toFixed(2)} MB` : '',
          description: d.description || '',
          date: d.uploaded_at ? d.uploaded_at.split('T')[0] : '',
          googleDriveUrl: d.google_drive_url,
          googleDriveFileId: d.google_drive_file_id,
          uploadedAt: d.uploaded_at,
          isGoogleDrive: true,
        }));
        setDocuments(mapped);
      }
    } catch (e) {
      // Keep existing local state if backend fetch fails
      console.error('Error fetching client documents:', e);
    }
  };

  // Delete client
  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const response = await apiService.deleteClient(clientId);
      if (response.success) {
        await fetchClients();
        alert('Client successfully deleted from database!');
      } else {
        throw new Error(response.message || 'Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      setClients(prev => prev.filter(client => client.id !== clientId));
      alert(`Client deleted locally. Database error: ${error.message}`);
    }
  };

  // Document upload functions
  const handleDocumentUpload = async () => {
    if (!newFile.clientId || !newFile.file) {
      alert('Please select a client and file.');
      return;
    }

    try {
      // Try Google Drive upload first
      const formData = new FormData();
      formData.append('file', newFile.file);
      formData.append('client_id', newFile.clientId);
      
      // Find client name
      const client = clients.find(c => c.id === newFile.clientId);
      const clientName = client ? client.clientName : 'Unknown Client';
      formData.append('client_name', clientName);
      
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
          clientId: newFile.clientId,
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
        fetchClientDocuments(newFile.clientId);
        setNewFile({ clientId: '', file: null, description: '' });
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
        return;
      }
      
      // Fallback to local upload if Google Drive fails
      try {
        const response = await apiService.uploadFile(newFile.file);
        
        if (response.success) {
          const document = {
            id: documents.length + 1,
            clientId: newFile.clientId,
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
          setNewFile({ clientId: '', file: null, description: '' });
          setShowUploadModal(false);
          alert('Document uploaded locally (Google Drive unavailable).');
        } else {
          throw new Error(response.message || 'Local upload failed');
        }
      } catch (localError) {
        // Final fallback to local state
        const document = {
          id: documents.length + 1,
          clientId: newFile.clientId,
          fileName: newFile.file.name,
          size: `${(newFile.file.size / (1024 * 1024)).toFixed(2)} MB`,
          description: newFile.description,
          date: new Date().toISOString().split('T')[0],
          uploadedAt: new Date().toISOString(),
          local: true
        };
        
        setDocuments([...documents, document]);
        setNewFile({ clientId: '', file: null, description: '' });
        setShowUploadModal(false);
        alert(`Document saved locally. Backend unavailable: ${localError.message}`);
      }
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

  const getClientDocuments = (clientId) => {
    return documents.filter(doc => doc.clientId === clientId);
  };

  // Excel import
  const handleFileUpload = async (event) => {
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
      alert(`Invalid file type. Please select a valid Excel file (.xlsx or .xls)`);
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
        if (jsonData.length > 0 && !jsonData[0].hasOwnProperty('Client Name') && !jsonData[0].hasOwnProperty('clientName')) {
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
          jsonData = rawRows
            .map(row => {
              if (Array.isArray(row) && row.length >= 1) {
                return {
                  clientName: row[0] ? row[0].toString().trim() : '',
                  businessName: (row[1] ? row[1].toString().trim() : 'Individual') || 'Individual',
                  idNumber: row[2] ? row[2].toString().trim() : '',
                  mobile: row[3] ? row[3].toString().trim() : '',
                  kraPin: row[4] ? row[4].toString().trim() : '',
                  email: row[5] ? row[5].toString().trim() : '',
                  town: row[6] ? row[6].toString().trim() : '',
                  address: row[7] ? row[7].toString().trim() : '',
                  dateOfBirth: row[8] ? row[8].toString().trim() : ''
                };
              }
              return null;
            })
            .filter(row => row !== null);
        }

        const importedClients = jsonData
          .filter(row => row.clientName && row.clientName.toString().trim() !== '')
          .map(row => ({
            client_name: row.clientName.toString().trim(),
            business_name: (row.businessName || 'Individual').toString().trim() || 'Individual',
            id_number: (row.idNumber || '').toString().trim(),
            mobile: (row.mobile || '').toString().trim(),
            kra_pin: (row.kraPin || '').toString().trim(),
            email: (row.email || '').toString().trim(),
            town: (row.town || '').toString().trim(),
            address: (row.address || '').toString().trim(),
            dateOfBirth: (row.dateOfBirth || '').toString().trim()
          }));

        if (importedClients.length === 0) {
          alert('No valid client data found in Excel file. Please check the file format and ensure client names are provided.');
          return;
        }

        // Try backend bulk import, fallback to local
        try {
          const testResponse = await fetch('/api/clients', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
          if (testResponse.ok) {
            const response = await apiService.bulkImportClients(importedClients);
            if (response.success) {
              await fetchClients();
              alert(`Successfully imported ${importedClients.length} clients to the database!`);
              return;
            } else {
              throw new Error(response.message || 'Import failed');
            }
          } else {
            throw new Error('Backend not responding correctly');
          }
        } catch (dbError) {
          console.error('Database import failed:', dbError);
          const localClients = importedClients.map((client, idx) => ({
            ...client,
            id: `local_${Date.now()}_${idx}`
          }));
          setClients(prev => [...prev, ...localClients]);
          alert(`Successfully imported ${importedClients.length} clients locally. ${dbError.message ? `Database unavailable: ${dbError.message}` : 'Working in offline mode.'}`);
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please check the file format and try again.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  // Export to CSV
  const exportToExcel = () => {
    const data = clients.map(client => ({
      'Client Name': client.clientName,
      'Business Name': client.businessName,
      'ID No': client.idNumber,
      'Mobile': client.mobile,
      'KRA P.I.N': client.kraPin,
      'Email': client.email,
      'Town': client.town,
      'Address': client.address,
      'Date of Birth': client.dateOfBirth || ''
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render helper for empty state
  const renderEmptyState = () => (
    <div className="clients-empty-state">
      <User size={48} opacity={0.5} />
      <p className="clients-empty-title">
        {searchTerm ? 'No clients found matching your search' : 'No clients yet'}
      </p>
      <p className="clients-empty-subtitle">
        {searchTerm ? 'Try adjusting your search terms' : 'Add your first client or import from Excel'}
      </p>
      {!searchTerm && (
        <button className="clients-btn primary" onClick={() => setShowAddModal(true)}>
          <Plus className="clients-btn-icon" />
          Add First Client
        </button>
      )}
    </div>
  );

  return (
    <div className="clients-container">
      {/* Header */}
      <div className="clients-header">
        <div className="clients-header-content">
          <div className="clients-header-left">
            <h1 className="clients-title">Clients</h1>
            <p className="clients-subtitle">Manage client information and contact details</p>
          </div>
          <div className="clients-header-actions">
            <button className="clients-btn" onClick={triggerFileUpload}>
              <Upload className="clients-btn-icon" />
              Import Excel
            </button>
            <button className="clients-btn" onClick={exportToExcel}>
              <FileSpreadsheet className="clients-btn-icon" />
              Export to Excel
            </button>
            <button className="clients-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus className="clients-btn-icon" />
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="clients-search-section">
        <div className="clients-search-wrapper">
          <Search className="clients-search-icon" />
          <input
            type="text"
            placeholder="Search by client name, business name, ID, mobile, email, town, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clients-search-input"
          />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
      />

      {/* Clients Table */}
      <div className="clients-table-container">
        <div className="clients-table-wrapper">
          {loading ? (
            <div className="clients-loading">Loading clients...</div>
          ) : paginatedClients.length === 0 ? (
            renderEmptyState()
          ) : (
            <table className="clients-table">
              <thead className="clients-table-head">
                <tr>
                  <th style={{ width: '120px' }}>Client Name</th>
                  <th style={{ width: '120px' }}>Business Name</th>
                  <th style={{ width: '100px' }}>ID No</th>
                  <th style={{ width: '110px' }}>Mobile</th>
                  <th style={{ width: '100px' }}>KRA P.I.N</th>
                  <th style={{ width: '140px' }}>Email</th>
                  <th style={{ width: '90px' }}>Town</th>
                  <th style={{ width: '150px' }}>Address</th>
                  <th style={{ width: '110px' }}>Date of Birth</th>
                  <th style={{ width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client.id}>
                    <td data-label="Client Name">{client.clientName}</td>
                    <td data-label="Business Name">{client.businessName}</td>
                    <td data-label="ID No">{client.idNumber || '-'}</td>
                    <td data-label="Mobile">{client.mobile}</td>
                    <td data-label="KRA P.I.N">{client.kraPin || '-'}</td>
                    <td data-label="Email">{client.email}</td>
                    <td data-label="Town">{client.town || '-'}</td>
                    <td data-label="Address">{client.address || '-'}</td>
                    <td data-label="Date of Birth">{client.dateOfBirth || '-'}</td>
                    <td data-label="Actions">
                      <div className="clients-actions">
                        <button className="clients-action-btn view" onClick={() => openViewModal(client)}>
                          <Eye className="clients-action-icon" />
                        </button>
                        <button className="clients-action-btn edit" onClick={() => openEditModal(client)}>
                          <Edit className="clients-action-icon" />
                        </button>
                        <button className="clients-action-btn documents" onClick={() => {
                          setSelectedClient(client);
                          setShowDocumentsModal(true);
                          fetchClientDocuments(client.id);
                        }}>
                          <FolderOpen className="clients-action-icon" />
                        </button>
                        <button className="clients-action-btn delete" onClick={() => handleDeleteClient(client.id)}>
                          <Trash2 className="clients-action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && paginatedClients.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredClients.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <Modal title="Add New Client" onClose={() => setShowAddModal(false)}>
          <ClientForm client={newClient} onChange={setNewClient} />
          <ModalFooter onCancel={() => setShowAddModal(false)} onConfirm={handleAddClient} />
        </Modal>
      )}

      {/* Edit Client Modal */}
      {showEditModal && editingClient && (
        <Modal title="Edit Client" onClose={() => { setShowEditModal(false); setEditingClient(null); }}>
          <ClientForm client={editingClient} onChange={setEditingClient} />
          <ModalFooter onCancel={() => { setShowEditModal(false); setEditingClient(null); }} onConfirm={handleEditClient} />
        </Modal>
      )}

      {/* View Client Modal */}
      {showViewModal && selectedClient && (
        <Modal title="Client Details" onClose={() => { setShowViewModal(false); setSelectedClient(null); }}>
          <div className="clients-view-group">
            <label className="clients-view-label">Client Name</label>
            <p className="clients-view-value">{selectedClient.clientName}</p>
          </div>
          <div className="clients-view-group">
            <label className="clients-view-label">Business Name</label>
            <p className="clients-view-value">{selectedClient.businessName}</p>
          </div>
          <div className="clients-view-group">
            <label className="clients-view-label">ID Number</label>
            <p className="clients-view-value">{selectedClient.idNumber || '-'}</p>
          </div>
          <div className="clients-view-group">
            <label className="clients-view-label">Mobile Number</label>
            <p className="clients-view-value">{selectedClient.mobile}</p>
          </div>
          <div className="clients-view-group">
            <label className="clients-view-label">KRA P.I.N</label>
            <p className="clients-view-value">{selectedClient.kraPin || '-'}</p>
          </div>
          <div className="clients-view-group">
            <label className="clients-view-label">Email</label>
            <p className="clients-view-value">{selectedClient.email}</p>
          </div>
          <div className="clients-view-group">
            <label className="clients-view-label">Town</label>
            <p className="clients-view-value">{selectedClient.town || '-'}</p>
          </div>
          <div className="clients-view-group">
            <label className="clients-view-label">Address</label>
            <p className="clients-view-value">{selectedClient.address || '-'}</p>
          </div>
          <div className="clients-view-group">
            <label className="clients-view-label">Date of Birth</label>
            <p className="clients-view-value">{selectedClient.dateOfBirth || '-'}</p>
          </div>
          <ModalFooter onCancel={() => { setShowViewModal(false); setSelectedClient(null); }} singleButton />
        </Modal>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && selectedClient && (
        <Modal title={`Documents - ${selectedClient.clientName}`} onClose={() => { setShowDocumentsModal(false); setSelectedClient(null); }}>
          <div className="clients-documents-content">
            <div className="clients-documents-header">
              <button 
                className="clients-btn primary"
                onClick={() => {
                  setShowUploadModal(true);
                  setNewFile({...newFile, clientId: selectedClient.id});
                }}
              >
                <Upload className="clients-btn-icon" />
                Upload Document
              </button>
            </div>
            
            {getClientDocuments(selectedClient.id).length === 0 ? (
              <div className="clients-empty-state">
                <FolderOpen size={48} className="clients-empty-icon" />
                <p>No documents uploaded for this client</p>
              </div>
            ) : (
              <div className="clients-documents-list">
                {getClientDocuments(selectedClient.id).map((doc) => (
                  <div key={doc.id} className="clients-document-item">
                    <div className="clients-document-info">
                      <FileSpreadsheet className="clients-document-icon" />
                      <div className="clients-document-details">
                        <button 
                          className="clients-document-name-link"
                          onClick={() => handleOpenDocument(doc)}
                          title={doc.isGoogleDrive ? "Open in Google Drive" : "Open file"}
                        >
                          {doc.fileName}
                        </button>
                        {doc.isGoogleDrive && (
                          <span className="clients-google-drive-badge">Drive</span>
                        )}
                        <p className="clients-document-description">{doc.description}</p>
                        <p className="clients-document-meta">{doc.size} - {doc.date}</p>
                      </div>
                    </div>
                    <button 
                      className="clients-action-btn delete"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 className="clients-action-icon" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ModalFooter onCancel={() => { setShowDocumentsModal(false); setSelectedClient(null); }} singleButton />
        </Modal>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <Modal title="Upload Document" onClose={() => setShowUploadModal(false)}>
          <div className="clients-form-group">
            <label className="clients-form-label">Client</label>
            <select
              className="clients-form-select"
              value={newFile.clientId}
              onChange={(e) => setNewFile({...newFile, clientId: e.target.value})}
              required
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.clientName}</option>
              ))}
            </select>
          </div>
          
          <div className="clients-form-group">
            <label className="clients-form-label">Select File</label>
            <input
              type="file"
              className="clients-form-file"
              onChange={(e) => setNewFile({...newFile, file: e.target.files[0]})}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              required
            />
          </div>
          
          <div className="clients-form-group">
            <label className="clients-form-label">Description (optional)</label>
            <textarea
              className="clients-form-textarea"
              value={newFile.description}
              onChange={(e) => setNewFile({...newFile, description: e.target.value})}
              placeholder="Enter document description"
              rows="3"
            />
          </div>
          
          <ModalFooter
            onCancel={() => setShowUploadModal(false)}
            onConfirm={handleDocumentUpload}
            saveText="Upload Document"
          />
        </Modal>
      )}
    </div>
  );
};

// Helper components for DRY code
const Modal = ({ title, onClose, children }) => (
  <div className="clients-modal-overlay">
    <div className="clients-modal">
      <div className="clients-modal-header">
        <h2 className="clients-modal-title">{title}</h2>
        <button className="clients-modal-close" onClick={onClose}>
          <X className="clients-modal-close-icon" />
        </button>
      </div>
      <div className="clients-modal-body">{children}</div>
    </div>
  </div>
);

const ClientForm = ({ client, onChange }) => {
  const handleChange = (field, value) => onChange({ ...client, [field]: value });
  return (
    <>
      <div className="clients-form-group">
        <label className="clients-form-label">Client Name</label>
        <input type="text" className="clients-form-input" value={client.clientName} onChange={(e) => handleChange('clientName', e.target.value)} placeholder="Enter client full name" />
      </div>
      <div className="clients-form-group">
        <label className="clients-form-label">Business Name <span className="clients-form-optional">(Optional - defaults to "Individual")</span></label>
        <input type="text" className="clients-form-input" value={client.businessName} onChange={(e) => handleChange('businessName', e.target.value)} placeholder="Enter business name" />
      </div>
      <div className="clients-form-group">
        <label className="clients-form-label">ID Number</label>
        <input type="text" className="clients-form-input" value={client.idNumber} onChange={(e) => handleChange('idNumber', e.target.value)} placeholder="Enter ID number" />
      </div>
      <div className="clients-form-group">
        <label className="clients-form-label">Mobile Number</label>
        <input type="text" className="clients-form-input" value={client.mobile} onChange={(e) => handleChange('mobile', e.target.value)} placeholder="Enter mobile number" />
      </div>
      <div className="clients-form-group">
        <label className="clients-form-label">KRA P.I.N</label>
        <input type="text" className="clients-form-input" value={client.kraPin} onChange={(e) => handleChange('kraPin', e.target.value)} placeholder="Enter KRA PIN" />
      </div>
      <div className="clients-form-group">
        <label className="clients-form-label">Email</label>
        <input type="email" className="clients-form-input" value={client.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Enter email address" />
      </div>
      <div className="clients-form-group">
        <label className="clients-form-label">Town</label>
        <input type="text" className="clients-form-input" value={client.town} onChange={(e) => handleChange('town', e.target.value)} placeholder="Enter town" />
      </div>
      <div className="clients-form-group">
        <label className="clients-form-label">Address</label>
        <textarea className="clients-form-textarea" value={client.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Enter postal address" rows="3" />
      </div>
      <div className="clients-form-group">
        <label className="clients-form-label">Date of Birth <span className="clients-form-optional">(Optional)</span></label>
        <input type="date" className="clients-form-input" value={client.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
      </div>
    </>
  );
};

const ModalFooter = ({ onCancel, onConfirm, singleButton = false, saveText }) => (
  <div className="clients-modal-footer">
    {!singleButton && (
      <button className="clients-btn secondary" onClick={onCancel}>Cancel</button>
    )}
    <button className="clients-btn primary" onClick={onConfirm}>
      {singleButton ? 'Close' : (saveText || 'Save')}
    </button>
  </div>
);

export default Clients;