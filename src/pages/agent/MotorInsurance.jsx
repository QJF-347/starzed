import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Trash2, FileSpreadsheet, X, User, ArrowLeft, Phone, Mail, MapPin, CreditCard, Car, CheckCircle, AlertTriangle, Clock, FileText, Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import Pagination from '../../components/Pagination';
import '../../components/Pagination.css';
import apiService from '../../services/api';
import './MotorInsurance.css';

const MotorInsurance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const [motorVehicles, setMotorVehicles] = useState([]);

  // Map backend snake_case to frontend camelCase
  const normalizeVehicle = (v) => ({
    id: v.id,
    clientName: v.client_name || '',
    regNo: v.registration_number || '',
    motorMake: v.make || '',
    model: v.model || '',
    use: v.use || '',
    bodyType: v.body_type || '',
    status: v.status || 'active',
    documents: []
  });

  // Map frontend camelCase to backend snake_case for API calls
  const toBackendVehicle = (v) => ({
    registration_number: v.regNo || v.registration_number,
    client_name: v.clientName || v.client_name,
    make: v.motorMake || v.make,
    model: v.model,
    year: v.year || null,
    engine_number: v.engine_number || '',
    chassis_number: v.chassis_number || '',
    status: v.status || 'active',
  });

  // Load vehicles from API on mount
  useEffect(() => {
    apiService.getMotorVehicles()
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setMotorVehicles(res.data);
        }
      })
      .catch(() => {
        // API unavailable — stay with empty local state
      });
  }, []);

  const bodyTypes = [
    'Sedan',
    'SUV',
    'Pickup',
    'Hatchback',
    'Coupe',
    'Convertible',
    'Van',
    'Truck',
    'Bus',
    'Motorcycle'
  ];

  const useOptions = [
    'Private',
    'Commercial',
    'Own Use',
    'Hire Purchase',
    'Leased',
    'Government',
    'Diplomatic',
    'Company'
  ];

  const motorMakes = [
    'Toyota', 'Nissan', 'Mercedes-Benz', 'Honda', 'Ford', 'Mitsubishi',
    'Subaru', 'Isuzu', 'Mazda', 'BMW', 'Audi', 'Volkswagen', 'Hyundai',
    'Kia', 'Land Rover', 'Jaguar', 'Volvo', 'Porsche', 'Lexus', 'Infiniti'
  ];

  const [newVehicle, setNewVehicle] = useState({
    clientName: '',
    regNo: '',
    motorMake: '',
    model: '',
    use: '',
    bodyType: '',
    documents: []
  });

  // Document management state
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedVehicleDocuments, setSelectedVehicleDocuments] = useState([]);
  const [selectedVehicleForDocs, setSelectedVehicleForDocs] = useState(null);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'Logbook',
    size: '0 MB'
  });

  const documentTypes = [
    'Logbook',
    'Insurance',
    'Inspection',
    'Registration',
    'Title Deed',
    'Other'
  ];

  const normalizedVehicles = motorVehicles.map(normalizeVehicle);

  const filteredVehicles = normalizedVehicles.filter(vehicle =>
    vehicle.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.motorMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.use.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.bodyType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddVehicle = async () => {
    if (newVehicle.clientName && newVehicle.regNo && newVehicle.motorMake && newVehicle.model && newVehicle.use && newVehicle.bodyType) {
      try {
        const response = await apiService.createMotorVehicle(toBackendVehicle(newVehicle));
        if (response.success) {
          const updatedVehicles = await apiService.getMotorVehicles();
          setMotorVehicles(updatedVehicles.data || []);
        } else {
          throw new Error('API failed');
        }
      } catch {
        // Fallback to local state
        const vehicle = {
          id: motorVehicles.length + 1,
          ...newVehicle
        };
        setMotorVehicles([...motorVehicles, vehicle]);
      }
      setNewVehicle({ clientName: '', regNo: '', motorMake: '', model: '', use: '', bodyType: '', documents: [] });
      setShowAddModal(false);
    }
  };

  const handleEditVehicle = async () => {
    if (editingVehicle && editingVehicle.clientName && editingVehicle.regNo && editingVehicle.motorMake && editingVehicle.model && editingVehicle.use && editingVehicle.bodyType) {
      try {
        const response = await apiService.updateMotorVehicle(editingVehicle.id, toBackendVehicle(editingVehicle));
        if (response.success) {
          const updatedVehicles = await apiService.getMotorVehicles();
          setMotorVehicles(updatedVehicles.data || []);
        } else {
          throw new Error('API failed');
        }
      } catch {
        // Fallback to local state
        setMotorVehicles(motorVehicles.map(vehicle =>
          vehicle.id === editingVehicle.id ? editingVehicle : vehicle
        ));
      }
      setEditingVehicle(null);
      setShowEditModal(false);
    }
  };

  // Document management functions
  const openDocumentsModal = (vehicle) => {
    setSelectedVehicleDocuments(vehicle.documents || []);
    setSelectedVehicleForDocs(vehicle);
    setShowDocumentsModal(true);
  };

  const handleAddDocument = () => {
    if (newDocument.name && selectedVehicleForDocs) {
      const doc = {
        id: Date.now(),
        name: newDocument.name,
        type: newDocument.type,
        size: newDocument.size,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      const updatedVehicles = motorVehicles.map(vehicle => {
        if (vehicle.id === selectedVehicleForDocs.id) {
          return {
            ...vehicle,
            documents: [...(vehicle.documents || []), doc]
          };
        }
        return vehicle;
      });
      
      setMotorVehicles(updatedVehicles);
      setSelectedVehicleDocuments([...selectedVehicleDocuments, doc]);
      setNewDocument({ name: '', type: 'Logbook', size: '0 MB' });
      setShowAddDocumentModal(false);
    }
  };

  const handleEditDocument = () => {
    if (editingDocument && selectedVehicleForDocs) {
      const updatedVehicles = motorVehicles.map(vehicle => {
        if (vehicle.id === selectedVehicleForDocs.id) {
          return {
            ...vehicle,
            documents: vehicle.documents.map(doc => 
              doc.id === editingDocument.id ? editingDocument : doc
            )
          };
        }
        return vehicle;
      });
      
      setMotorVehicles(updatedVehicles);
      setSelectedVehicleDocuments(selectedVehicleDocuments.map(doc => 
        doc.id === editingDocument.id ? editingDocument : doc
      ));
      setEditingDocument(null);
      setShowAddDocumentModal(false);
    }
  };

  const handleDeleteDocument = (docId) => {
    const updatedVehicles = motorVehicles.map(vehicle => {
      if (vehicle.id === selectedVehicleForDocs.id) {
        return {
          ...vehicle,
          documents: vehicle.documents.filter(doc => doc.id !== docId)
        };
      }
      return vehicle;
    });
    
    setMotorVehicles(updatedVehicles);
    setSelectedVehicleDocuments(selectedVehicleDocuments.filter(doc => doc.id !== docId));
  };

  const handleDownloadDocument = (document) => {
    // Simulate document download
    const link = document.createElement('a');
    link.href = '#';
    link.download = document.name;
    link.click();
  };

  const openEditDocumentModal = (document) => {
    setEditingDocument(document);
    setNewDocument({
      name: document.name,
      type: document.type,
      size: document.size
    });
    setShowAddDocumentModal(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle({...vehicle});
    setShowEditModal(true);
  };

  const openViewModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      const response = await apiService.deleteMotorVehicle(vehicleId);
      if (response.success) {
        const updatedVehicles = await apiService.getMotorVehicles();
        setMotorVehicles(updatedVehicles.data || []);
        return;
      }
    } catch {
      // fallback to local state
    }
    setMotorVehicles(motorVehicles.filter(vehicle => vehicle.id !== vehicleId));
  };

  const exportToExcel = () => {
    // Create a more comprehensive Excel-compatible export
    const data = motorVehicles.map(vehicle => ({
      'Client Name': vehicle.clientName,
      'Registration Number': vehicle.regNo,
      'Motor Make': vehicle.motorMake,
      'Model': vehicle.model,
      'Use': vehicle.use,
      'Body Type': vehicle.bodyType,
      'Documents Count': vehicle.documents ? vehicle.documents.length : 0,
      'Document Types': vehicle.documents && vehicle.documents.length > 0 
        ? vehicle.documents.map(doc => doc.type).join(', ')
        : 'No documents'
    }));

    // Create CSV content with proper formatting
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle commas and quotes in values
        const stringValue = String(value || '').replace(/"/g, '""');
        return stringValue.includes(',') || stringValue.includes('"') 
          ? `"${stringValue}"` 
          : stringValue;
      }).join(',')
    );

    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `motor_vehicles_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

        // Find the registration number column
        const regNoColumnIndex = headers.findIndex(h => 
          h.toLowerCase().includes('reg') || 
          h.toLowerCase().includes('registration')
        );

        if (regNoColumnIndex === -1) {
          errors.push('File must contain a column with "Reg" or "Registration" in the header');
          setImportErrors(errors);
          setImportPreview([]);
          return;
        }

        const parsedVehicles = [];

        for (let i = 0; i < data.length; i++) {
          const values = data[i];
          const regNo = String(values[regNoColumnIndex] ?? '').trim();

          if (!regNo) {
            errors.push(`Row ${i + 2}: Registration number is required`);
            continue;
          }

          // Extract other optional columns
          const clientNameIndex = headers.findIndex(h => h.toLowerCase().includes('client') || h.toLowerCase().includes('name'));
          const makeIndex = headers.findIndex(h => h.toLowerCase().includes('make') || h.toLowerCase().includes('motor'));
          const modelIndex = headers.findIndex(h => h.toLowerCase().includes('model'));
          const useIndex = headers.findIndex(h => h.toLowerCase().includes('use'));
          const bodyTypeIndex = headers.findIndex(h => h.toLowerCase().includes('body') || h.toLowerCase().includes('type'));

          const vehicle = {
            regNo: regNo,
            clientName: clientNameIndex !== -1 && values[clientNameIndex] ? String(values[clientNameIndex]).trim() : 'Unknown Client',
            motorMake: makeIndex !== -1 && values[makeIndex] ? String(values[makeIndex]).trim() : 'Unknown',
            model: modelIndex !== -1 && values[modelIndex] ? String(values[modelIndex]).trim() : 'Unknown',
            use: useIndex !== -1 && values[useIndex] ? String(values[useIndex]).trim() : 'Private',
            bodyType: bodyTypeIndex !== -1 && values[bodyTypeIndex] ? String(values[bodyTypeIndex]).trim() : 'Sedan',
            documents: []
          };

          parsedVehicles.push(vehicle);
        }

        setImportPreview(parsedVehicles);
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

  const handleImportVehicles = async () => {
    if (importPreview.length === 0) return;

    setIsImporting(true);

    try {
      // Map frontend camelCase fields to backend snake_case before sending
      const backendData = importPreview.map(v => toBackendVehicle(v));

      // Try to import via API first
      const response = await apiService.bulkImportMotorVehicles(backendData);

      if (response.success) {
        // Refresh vehicles from API
        const updatedVehicles = await apiService.getMotorVehicles();
        setMotorVehicles(updatedVehicles.data || []);
        
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
        const newVehicles = importPreview.map((vehicle, index) => ({
          id: motorVehicles.length + index + 1,
          ...vehicle
        }));

        setMotorVehicles([...motorVehicles, ...newVehicles]);
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
      const newVehicles = importPreview.map((vehicle, index) => ({
        id: motorVehicles.length + index + 1,
        ...vehicle
      }));

      setMotorVehicles([...motorVehicles, ...newVehicles]);
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
    const sampleContent = 'Registration Number,Client Name,Motor Make,Model,Use,Body Type\n' +
      'KDG 123A,John Doe,Toyota,Corolla,Private,Sedan\n' +
      'KAB 456B,Jane Smith,Nissan,Patrol,Commercial,SUV\n' +
      'KCD 789C,Bob Johnson,Ford,Ranger,Private,Pickup';

    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'motor_vehicles_import_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="motor-insurance-container">
      {/* Header */}
      <div className="motor-header">
        <div className="motor-header-content">
          <div className="motor-header-left">
            <h1 className="motor-title">Motor Vehicles</h1>
            <p className="motor-subtitle">Manage motor vehicle information and details</p>
          </div>
          <div className="motor-header-actions">
            <button className="motor-btn" onClick={() => setShowImportModal(true)}>
              <Upload className="motor-btn-icon" />
              Import Vehicles
            </button>
            <button className="motor-btn" onClick={exportToExcel}>
              <FileSpreadsheet className="motor-btn-icon" />
              Export to Excel
            </button>
            <button className="motor-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus className="motor-btn-icon" />
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="motor-search-section">
        <div className="motor-search-wrapper">
          <Search className="motor-search-icon" />
          <input
            type="text"
            placeholder="Search by client name, reg no, make, model, year, or body type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="motor-search-input"
          />
        </div>
      </div>

      {/* Motor Vehicles Table */}
      <div className="motor-table-container">
        <div className="motor-table-wrapper">
          <table className="motor-table">
            <thead className="motor-table-head">
              <tr className="motor-table-row">
                <th className="motor-table-header">Client Name</th>
                <th className="motor-table-header">Reg No.</th>
                <th className="motor-table-header">Motor Make</th>
                <th className="motor-table-header">Model</th>
                <th className="motor-table-header">Use</th>
                <th className="motor-table-header">Body Type</th>
                <th className="motor-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="motor-table-body">
              {paginatedVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="motor-table-row">
                  <td className="motor-table-cell">
                    <div className="motor-client-info">
                      <div className="motor-client-name client-name-cell">{vehicle.clientName}</div>
                    </div>
                  </td>
                  <td className="motor-table-cell">
                    <div className="motor-reg-info">
                      <div className="motor-reg-no">{vehicle.regNo}</div>
                    </div>
                  </td>
                  <td className="motor-table-cell">
                    <div className="motor-make-info">
                      <div className="motor-make">{vehicle.motorMake}</div>
                    </div>
                  </td>
                  <td className="motor-table-cell">
                    <div className="motor-model-info">
                      <div className="motor-model">{vehicle.model}</div>
                    </div>
                  </td>
                  <td className="motor-table-cell">
                    <div className="motor-used-info">
                      <div className="motor-used">{vehicle.use}</div>
                    </div>
                  </td>
                  <td className="motor-table-cell">
                    <div className="motor-body-info">
                      <span className="motor-body-type">{vehicle.bodyType}</span>
                    </div>
                  </td>
                  <td className="motor-table-cell">
                    <div className="motor-actions">
                      <button className="motor-action-btn view" onClick={() => openViewModal(vehicle)}>
                        <Eye className="motor-action-icon" />
                      </button>
                      <button className="motor-action-btn documents" onClick={() => openDocumentsModal(vehicle)} title="View Documents">
                        <FileText className="motor-action-icon" />
                      </button>
                      <button className="motor-action-btn edit" onClick={() => openEditModal(vehicle)}>
                        <Edit className="motor-action-icon" />
                      </button>
                      <button className="motor-action-btn delete" onClick={() => handleDeleteVehicle(vehicle.id)}>
                        <Trash2 className="motor-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredVehicles.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="motor-modal-overlay">
          <div className="motor-modal">
            <div className="motor-modal-header">
              <h2 className="motor-modal-title">Add New Vehicle</h2>
              <button 
                className="motor-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <X className="motor-modal-close-icon" />
              </button>
            </div>
            <div className="motor-modal-body">
              <div className="motor-form-group">
                <label className="motor-form-label">Client Name</label>
                <input
                  type="text"
                  className="motor-form-input"
                  value={newVehicle.clientName}
                  onChange={(e) => setNewVehicle({...newVehicle, clientName: e.target.value})}
                  placeholder="Enter client full name"
                />
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Registration Number</label>
                <input
                  type="text"
                  className="motor-form-input"
                  value={newVehicle.regNo}
                  onChange={(e) => setNewVehicle({...newVehicle, regNo: e.target.value})}
                  placeholder="Enter registration number (e.g., KDG 123A)"
                />
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Motor Make</label>
                <select
                  className="motor-form-select"
                  value={newVehicle.motorMake}
                  onChange={(e) => setNewVehicle({...newVehicle, motorMake: e.target.value})}
                >
                  <option value="">Select Make</option>
                  {motorMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Model</label>
                <input
                  type="text"
                  className="motor-form-input"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                  placeholder="Enter vehicle model"
                />
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Use</label>
                <select
                  className="motor-form-select"
                  value={newVehicle.use}
                  onChange={(e) => setNewVehicle({...newVehicle, use: e.target.value})}
                >
                  <option value="">Select Use</option>
                  {useOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Body Type</label>
                <select
                  className="motor-form-select"
                  value={newVehicle.bodyType}
                  onChange={(e) => setNewVehicle({...newVehicle, bodyType: e.target.value})}
                >
                  <option value="">Select Body Type</option>
                  {bodyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="motor-modal-footer">
              <button 
                className="motor-btn secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="motor-btn primary"
                onClick={handleAddVehicle}
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && editingVehicle && (
        <div className="motor-modal-overlay">
          <div className="motor-modal">
            <div className="motor-modal-header">
              <h2 className="motor-modal-title">Edit Vehicle</h2>
              <button 
                className="motor-modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingVehicle(null);
                }}
              >
                <X className="motor-modal-close-icon" />
              </button>
            </div>
            <div className="motor-modal-body">
              <div className="motor-form-group">
                <label className="motor-form-label">Client Name</label>
                <input
                  type="text"
                  className="motor-form-input"
                  value={editingVehicle.clientName}
                  onChange={(e) => setEditingVehicle({...editingVehicle, clientName: e.target.value})}
                  placeholder="Enter client full name"
                />
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Registration Number</label>
                <input
                  type="text"
                  className="motor-form-input"
                  value={editingVehicle.regNo}
                  onChange={(e) => setEditingVehicle({...editingVehicle, regNo: e.target.value})}
                  placeholder="Enter registration number (e.g., KDG 123A)"
                />
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Motor Make</label>
                <select
                  className="motor-form-select"
                  value={editingVehicle.motorMake}
                  onChange={(e) => setEditingVehicle({...editingVehicle, motorMake: e.target.value})}
                >
                  <option value="">Select Make</option>
                  {motorMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Model</label>
                <input
                  type="text"
                  className="motor-form-input"
                  value={editingVehicle.model}
                  onChange={(e) => setEditingVehicle({...editingVehicle, model: e.target.value})}
                  placeholder="Enter vehicle model"
                />
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Use</label>
                <select
                  className="motor-form-select"
                  value={editingVehicle.use}
                  onChange={(e) => setEditingVehicle({...editingVehicle, use: e.target.value})}
                >
                  <option value="">Select Use</option>
                  {useOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Body Type</label>
                <select
                  className="motor-form-select"
                  value={editingVehicle.bodyType}
                  onChange={(e) => setEditingVehicle({...editingVehicle, bodyType: e.target.value})}
                >
                  <option value="">Select Body Type</option>
                  {bodyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="motor-modal-footer">
              <button 
                className="motor-btn secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingVehicle(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="motor-btn primary"
                onClick={handleEditVehicle}
              >
                Update Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Vehicle Modal */}
      {showViewModal && selectedVehicle && (
        <div className="motor-modal-overlay">
          <div className="motor-modal">
            <div className="motor-modal-header">
              <h2 className="motor-modal-title">Vehicle Details</h2>
              <button 
                className="motor-modal-close"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedVehicle(null);
                }}
              >
                <X className="motor-modal-close-icon" />
              </button>
            </div>
            <div className="motor-modal-body">
              <div className="motor-view-group">
                <label className="motor-view-label">Client Name</label>
                <p className="motor-view-value">{selectedVehicle.clientName}</p>
              </div>
              <div className="motor-view-group">
                <label className="motor-view-label">Registration Number</label>
                <p className="motor-view-value">{selectedVehicle.regNo}</p>
              </div>
              <div className="motor-view-group">
                <label className="motor-view-label">Motor Make</label>
                <p className="motor-view-value">{selectedVehicle.motorMake}</p>
              </div>
              <div className="motor-view-group">
                <label className="motor-view-label">Model</label>
                <p className="motor-view-value">{selectedVehicle.model}</p>
              </div>
              <div className="motor-view-group">
                <label className="motor-view-label">Use</label>
                <p className="motor-view-value">{selectedVehicle.use}</p>
              </div>
              <div className="motor-view-group">
                <label className="motor-view-label">Body Type</label>
                <p className="motor-view-value">{selectedVehicle.bodyType}</p>
              </div>
            </div>
            <div className="motor-modal-footer">
              <button 
                className="motor-btn secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedVehicle(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div className="motor-modal-overlay">
          <div className="motor-modal" style={{ maxWidth: '800px', width: '90%' }}>
            <div className="motor-modal-header">
              <h2 className="motor-modal-title">
                Documents - {selectedVehicleForDocs?.regNo} ({selectedVehicleForDocs?.clientName})
              </h2>
              <button 
                className="motor-modal-close"
                onClick={() => {
                  setShowDocumentsModal(false);
                  setSelectedVehicleDocuments([]);
                  setSelectedVehicleForDocs(null);
                }}
              >
                <X className="motor-modal-close-icon" />
              </button>
            </div>
            <div className="motor-modal-body">
              <div className="motor-documents-header">
                <button 
                  className="motor-btn primary"
                  onClick={() => {
                    setEditingDocument(null);
                    setNewDocument({ name: '', type: 'Logbook', size: '0 MB' });
                    setShowAddDocumentModal(true);
                  }}
                >
                  <Plus className="motor-btn-icon" />
                  Add Document
                </button>
              </div>
              
              {selectedVehicleDocuments.length === 0 ? (
                <div className="motor-no-documents">
                  <FileText className="motor-no-documents-icon" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                <div className="motor-documents-list">
                  {selectedVehicleDocuments.map((doc) => (
                    <div key={doc.id} className="motor-document-item">
                      <div className="motor-document-info">
                        <div className="motor-document-name">{doc.name}</div>
                        <div className="motor-document-details">
                          <span className="motor-document-type">{doc.type}</span>
                          <span className="motor-document-size">{doc.size}</span>
                          <span className="motor-document-date">{doc.uploadDate}</span>
                        </div>
                      </div>
                      <div className="motor-document-actions">
                        <button 
                          className="motor-action-btn view" 
                          onClick={() => handleDownloadDocument(doc)}
                          title="Download"
                        >
                          <Download className="motor-action-icon" />
                        </button>
                        <button 
                          className="motor-action-btn edit" 
                          onClick={() => openEditDocumentModal(doc)}
                          title="Edit"
                        >
                          <Edit className="motor-action-icon" />
                        </button>
                        <button 
                          className="motor-action-btn delete" 
                          onClick={() => handleDeleteDocument(doc.id)}
                          title="Delete"
                        >
                          <Trash2 className="motor-action-icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="motor-modal-footer">
              <button 
                className="motor-btn secondary"
                onClick={() => {
                  setShowDocumentsModal(false);
                  setSelectedVehicleDocuments([]);
                  setSelectedVehicleForDocs(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Motor Vehicles Modal */}
      {showImportModal && (
        <div className="motor-modal-overlay">
          <div className="motor-modal import-modal">
            <div className="motor-modal-header">
              <h2 className="motor-modal-title">Import Motor Vehicles</h2>
              <button 
                className="motor-modal-close"
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
                <X className="motor-modal-close-icon" />
              </button>
            </div>
            <div className="motor-modal-body">
              <div className="motor-import-instructions">
                <h3>Import Instructions</h3>
                <ul>
                  <li>Only the <strong>Registration Number</strong> column is required</li>
                  <li>Optional columns: Client Name, Motor Make, Model, Use, Body Type</li>
                  <li>File must be in CSV or Excel format (.xlsx, .xls)</li>
                  <li>First row should contain column headers</li>
                </ul>
                <button className="motor-btn secondary" onClick={downloadSampleCSV}>
                  Download Sample CSV
                </button>
              </div>

              <div className="motor-form-group">
                <label className="motor-form-label">Select CSV or Excel File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="motor-form-input"
                />
              </div>

              {importErrors.length > 0 && (
                <div className="motor-import-errors">
                  <h4>Import Errors:</h4>
                  {importErrors.map((error, index) => (
                    <p key={index} className="motor-error-text">{error}</p>
                  ))}
                </div>
              )}

              {importPreview.length > 0 && (
                <div className="motor-import-preview">
                  <h4>Preview ({importPreview.length} vehicles found):</h4>
                  <div className="motor-preview-table">
                    <table className="motor-table">
                      <thead>
                        <tr>
                          <th>Reg No.</th>
                          <th>Client Name</th>
                          <th>Motor Make</th>
                          <th>Model</th>
                          <th>Use</th>
                          <th>Body Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.slice(0, 5).map((vehicle, index) => (
                          <tr key={index}>
                            <td>{vehicle.regNo}</td>
                            <td>{vehicle.clientName}</td>
                            <td>{vehicle.motorMake}</td>
                            <td>{vehicle.model}</td>
                            <td>{vehicle.use}</td>
                            <td>{vehicle.bodyType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 5 && (
                      <p className="motor-preview-more">...and {importPreview.length - 5} more vehicles</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="motor-modal-footer">
              <button 
                className="motor-btn secondary"
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
                className="motor-btn primary"
                onClick={handleImportVehicles}
                disabled={importPreview.length === 0 || isImporting}
              >
                {isImporting ? `Importing ${importPreview.length} Vehicles...` : `Import ${importPreview.length} Vehicles`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Document Modal */}
      {showAddDocumentModal && (
        <div className="motor-modal-overlay">
          <div className="motor-modal">
            <div className="motor-modal-header">
              <h2 className="motor-modal-title">
                {editingDocument ? 'Edit Document' : 'Add New Document'}
              </h2>
              <button 
                className="motor-modal-close"
                onClick={() => {
                  setShowAddDocumentModal(false);
                  setEditingDocument(null);
                  setNewDocument({ name: '', type: 'Logbook', size: '0 MB' });
                }}
              >
                <X className="motor-modal-close-icon" />
              </button>
            </div>
            <div className="motor-modal-body">
              <div className="motor-form-group">
                <label className="motor-form-label">Document Name</label>
                <input
                  type="text"
                  className="motor-form-input"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                  placeholder="Enter document name"
                />
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">Document Type</label>
                <select
                  className="motor-form-select"
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="motor-form-group">
                <label className="motor-form-label">File Size</label>
                <input
                  type="text"
                  className="motor-form-input"
                  value={newDocument.size}
                  onChange={(e) => setNewDocument({...newDocument, size: e.target.value})}
                  placeholder="Enter file size (e.g., 2.3 MB)"
                />
              </div>
            </div>
            <div className="motor-modal-footer">
              <button 
                className="motor-btn secondary"
                onClick={() => {
                  setShowAddDocumentModal(false);
                  setEditingDocument(null);
                  setNewDocument({ name: '', type: 'Logbook', size: '0 MB' });
                }}
              >
                Cancel
              </button>
              <button 
                className="motor-btn primary"
                onClick={editingDocument ? handleEditDocument : handleAddDocument}
              >
                {editingDocument ? 'Update Document' : 'Add Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotorInsurance;
