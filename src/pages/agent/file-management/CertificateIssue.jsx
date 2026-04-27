import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileCheck, X, User, Phone, MapPin, Mail, Shield, FileText, Calendar, AlertCircle, DollarSign, Download, Plus, Eye, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import './CertificateIssue.css';

// API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const fetchClients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

const fetchClientPolicies = async (clientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}/policies`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching client policies:', error);
    return [];
  }
};

const CertificateIssue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientPopup, setShowClientPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [category, setCategory] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [issuedCertificate, setIssuedCertificate] = useState(null);
  
  // Form states for different categories
  const [motorData, setMotorData] = useState({
    regNo: '',
    make: '',
    model: '',
    bodyType: '',
    year: '',
    color: '',
    engineNo: '',
    chassisNo: ''
  });
  
  const [medicalData, setMedicalData] = useState({
    memberNo: '',
    beneficiary: '',
    ageBand: '',
    coverType: '',
    sumAssured: ''
  });
  
  const [nonMotorData, setNonMotorData] = useState({
    itemDescription: '',
    itemValue: '',
    location: '',
    riskType: ''
  });

  // Data states
  const [clients, setClients] = useState([]);
  const [clientPolicies, setClientPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const clientsData = await fetchClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Load client policies when client is selected
  useEffect(() => {
    if (selectedClient) {
      const loadClientPolicies = async () => {
        try {
          const policies = await fetchClientPolicies(selectedClient.id);
          setClientPolicies(policies);
        } catch (error) {
          console.error('Error loading client policies:', error);
        }
      };
      loadClientPolicies();
    }
  }, [selectedClient]);

  // Filter clients based on search
  const filteredClients = Array.isArray(clients) ? clients.filter(client =>
    client && 
    typeof client === 'object' && (
      (client.client_name && typeof client.client_name === 'string' && client.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.mobile && typeof client.mobile === 'string' && client.mobile.includes(searchTerm)) ||
      (client.email && typeof client.email === 'string' && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.town && typeof client.town === 'string' && client.town.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  ) : [];

  // Get policies for selected client
  const policies = selectedClient 
    ? Array.isArray(clientPolicies) ? clientPolicies.filter(policy => 
        policy && 
        typeof policy === 'object' && 
        policy.clientId === selectedClient.id
      ) : []
    : [];

  // Handle search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowClientPopup(value.length > 0);
  };

  // Handle client selection
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setSearchTerm(client.client_name);
    setShowClientPopup(false);
    setSelectedPolicy(null); // Reset policy when client changes
    setCategory(''); // Reset category
  };

  // Handle policy selection
  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    setCategory(policy.cover_type);
  };

  // Handle complete process
  const handleCompleteProcess = () => {
    if (!selectedClient || !selectedPolicy) {
      alert('Please select a client and policy first');
      return;
    }

    // Validate category-specific fields
    let isValid = true;
    let errorMessage = '';

    if (category === 'Motor') {
      if (!motorData.regNo || !motorData.make || !motorData.model) {
        isValid = false;
        errorMessage = 'Please fill in all required motor vehicle details';
      }
    } else if (category === 'Accidental and Medical') {
      if (!medicalData.memberNo || !medicalData.beneficiary || !medicalData.coverType) {
        isValid = false;
        errorMessage = 'Please fill in all required medical details';
      }
    } else if (category === 'Non-Motor') {
      if (!nonMotorData.itemDescription || !nonMotorData.itemValue) {
        isValid = false;
        errorMessage = 'Please fill in all required non-motor details';
      }
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    // Process certificate issuance
    const certificateData = {
      id: Date.now(),
      certificateNo: `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      client: selectedClient,
      policy: selectedPolicy,
      category: category,
      details: category === 'Motor' ? motorData : 
               category === 'Accidental and Medical' ? medicalData : 
               nonMotorData,
      issuedDate: new Date().toISOString().split('T')[0],
      status: 'Issued'
    };

    console.log('Certificate issued:', certificateData);
    setIssuedCertificate(certificateData);
    setShowSuccessModal(true);
  };

  // Reset form
  const handleReset = () => {
    setSearchTerm('');
    setSelectedClient(null);
    setSelectedPolicy(null);
    setCategory('');
    setMotorData({
      regNo: '',
      make: '',
      model: '',
      bodyType: '',
      year: '',
      color: '',
      engineNo: '',
      chassisNo: ''
    });
    setMedicalData({
      memberNo: '',
      beneficiary: '',
      ageBand: '',
      coverType: '',
      sumAssured: ''
    });
    setNonMotorData({
      itemDescription: '',
      itemValue: '',
      location: '',
      riskType: ''
    });
    setShowClientPopup(false);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return '#10b981';
      case 'Expiring Soon': return '#f59e0b';
      case 'Expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active': return <CheckCircle size={16} color={getStatusColor(status)} />;
      case 'Expiring Soon': return <Clock size={16} color={getStatusColor(status)} />;
      case 'Expired': return <AlertCircle size={16} color={getStatusColor(status)} />;
      default: return <AlertCircle size={16} color={getStatusColor(status)} />;
    }
  };

  return (
    <div className="certificate-issue-container">
      {/* Header */}
      <div className="certificate-issue-header">
        <div className="certificate-issue-header-content">
          <div className="certificate-issue-header-left">
            <h1 className="certificate-issue-title">Issue Certificate</h1>
            <p className="certificate-issue-subtitle">Generate certificates for client policies</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="certificate-issue-main-content">
        {/* Left Panel - Form */}
        <div className="certificate-issue-left-panel">
          {/* Client Search */}
          <div className="certificate-issue-section">
            <h3 className="certificate-issue-section-title">Search Client</h3>
            <div className="certificate-issue-search-wrapper">
              <Search className="certificate-issue-search-icon" />
              <input
                type="text"
                placeholder="Search by name, mobile, email, or town..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowClientPopup(searchTerm.length > 0)}
                className="certificate-issue-search-input"
              />
              {showClientPopup && filteredClients.length > 0 && (
                <div className="certificate-issue-client-popup">
                  {filteredClients.map(client => (
                    <div
                      key={client.id}
                      className="certificate-issue-client-option"
                      onClick={() => handleClientSelect(client)}
                    >
                      <div className="certificate-issue-client-name">{client.client_name}</div>
                      <div className="certificate-issue-client-details">
                        {client.mobile} | {client.town}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Policy Selection */}
          {selectedClient && (
            <div className="certificate-issue-section">
              <h3 className="certificate-issue-section-title">Select Policy</h3>
              <div className="certificate-issue-policies-grid">
                {clientPolicies.map(policy => (
                  <div
                    key={policy.id}
                    className={`certificate-issue-policy-card ${selectedPolicy?.id === policy.id ? 'selected' : ''}`}
                    onClick={() => handlePolicySelect(policy)}
                  >
                    <div className="certificate-issue-policy-header">
                      <div className="certificate-issue-policy-number">{policy.policy_number}</div>
                      <div className="certificate-issue-policy-status">
                        {getStatusIcon(policy.status)}
                        <span style={{ color: getStatusColor(policy.status) }}>{policy.status}</span>
                      </div>
                    </div>
                    <div className="certificate-issue-policy-details">
                      <div className="certificate-issue-policy-insurer">{policy.policy_type}</div>
                      <div className="certificate-issue-policy-coverage">{policy.cover_type}</div>
                      <div className="certificate-issue-policy-category">{policy.policy_type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category-specific Details */}
          {selectedPolicy && (
            <div className="certificate-issue-section">
              <h3 className="certificate-issue-section-title">
                {category === 'Motor' && 'Motor Vehicle Details'}
                {category === 'Accidental and Medical' && 'Medical Cover Details'}
                {category === 'Non-Motor' && 'Non-Motor Item Details'}
              </h3>

              {category === 'Motor' && (
                <div className="certificate-issue-form-grid">
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Registration No *</label>
                    <input
                      type="text"
                      placeholder="Enter registration number"
                      value={motorData.regNo}
                      onChange={(e) => setMotorData({...motorData, regNo: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Make *</label>
                    <input
                      type="text"
                      placeholder="Enter vehicle make"
                      value={motorData.make}
                      onChange={(e) => setMotorData({...motorData, make: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Model *</label>
                    <input
                      type="text"
                      placeholder="Enter vehicle model"
                      value={motorData.model}
                      onChange={(e) => setMotorData({...motorData, model: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Body Type</label>
                    <select
                      value={motorData.bodyType}
                      onChange={(e) => setMotorData({...motorData, bodyType: e.target.value})}
                      className="certificate-issue-form-select"
                    >
                      <option value="">Select body type</option>
                      <option value="Saloon">Saloon</option>
                      <option value="SUV">SUV</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Van">Van</option>
                      <option value="Truck">Truck</option>
                      <option value="Motorcycle">Motorcycle</option>
                    </select>
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Year</label>
                    <input
                      type="number"
                      placeholder="Enter year of manufacture"
                      value={motorData.year}
                      onChange={(e) => setMotorData({...motorData, year: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Color</label>
                    <input
                      type="text"
                      placeholder="Enter vehicle color"
                      value={motorData.color}
                      onChange={(e) => setMotorData({...motorData, color: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Engine Number</label>
                    <input
                      type="text"
                      placeholder="Enter engine number"
                      value={motorData.engineNo}
                      onChange={(e) => setMotorData({...motorData, engineNo: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Chassis Number</label>
                    <input
                      type="text"
                      placeholder="Enter chassis number"
                      value={motorData.chassisNo}
                      onChange={(e) => setMotorData({...motorData, chassisNo: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                </div>
              )}

              {category === 'Accidental and Medical' && (
                <div className="certificate-issue-form-grid">
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Member No *</label>
                    <input
                      type="text"
                      placeholder="Enter member number"
                      value={medicalData.memberNo}
                      onChange={(e) => setMedicalData({...medicalData, memberNo: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Beneficiary *</label>
                    <input
                      type="text"
                      placeholder="Enter beneficiary name"
                      value={medicalData.beneficiary}
                      onChange={(e) => setMedicalData({...medicalData, beneficiary: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Age Band</label>
                    <select
                      value={medicalData.ageBand}
                      onChange={(e) => setMedicalData({...medicalData, ageBand: e.target.value})}
                      className="certificate-issue-form-select"
                    >
                      <option value="">Select age band</option>
                      <option value="0-18">0-18 years</option>
                      <option value="19-25">19-25 years</option>
                      <option value="26-35">26-35 years</option>
                      <option value="36-45">36-45 years</option>
                      <option value="46-55">46-55 years</option>
                      <option value="56-65">56-65 years</option>
                      <option value="65+">65+ years</option>
                    </select>
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Cover Type *</label>
                    <select
                      value={medicalData.coverType}
                      onChange={(e) => setMedicalData({...medicalData, coverType: e.target.value})}
                      className="certificate-issue-form-select"
                    >
                      <option value="">Select cover type</option>
                      <option value="Individual">Individual</option>
                      <option value="Family">Family</option>
                      <option value="Group">Group</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Sum Assured</label>
                    <input
                      type="number"
                      placeholder="Enter sum assured amount"
                      value={medicalData.sumAssured}
                      onChange={(e) => setMedicalData({...medicalData, sumAssured: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                </div>
              )}

              {category === 'Non-Motor' && (
                <div className="certificate-issue-form-grid">
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Item Description *</label>
                    <input
                      type="text"
                      placeholder="Enter item description"
                      value={nonMotorData.itemDescription}
                      onChange={(e) => setNonMotorData({...nonMotorData, itemDescription: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Item Value *</label>
                    <input
                      type="number"
                      placeholder="Enter item value"
                      value={nonMotorData.itemValue}
                      onChange={(e) => setNonMotorData({...nonMotorData, itemValue: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Location</label>
                    <input
                      type="text"
                      placeholder="Enter item location"
                      value={nonMotorData.location}
                      onChange={(e) => setNonMotorData({...nonMotorData, location: e.target.value})}
                      className="certificate-issue-form-input"
                    />
                  </div>
                  <div className="certificate-issue-form-group">
                    <label className="certificate-issue-form-label">Risk Type</label>
                    <select
                      value={nonMotorData.riskType}
                      onChange={(e) => setNonMotorData({...nonMotorData, riskType: e.target.value})}
                      className="certificate-issue-form-select"
                    >
                      <option value="">Select risk type</option>
                      <option value="Fire">Fire</option>
                      <option value="Burglary">Burglary</option>
                      <option value="Theft">Theft</option>
                      <option value="All Risks">All Risks</option>
                      <option value="Marine">Marine</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="certificate-issue-actions">
                <button
                  className="certificate-issue-btn certificate-issue-btn-primary"
                  onClick={handleCompleteProcess}
                >
                  <FileCheck className="certificate-issue-btn-icon" />
                  Complete Process
                </button>
                <button
                  className="certificate-issue-btn certificate-issue-btn-secondary"
                  onClick={handleReset}
                >
                  <X className="certificate-issue-btn-icon" />
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Details */}
        {selectedClient && selectedPolicy && (
          <div className="certificate-issue-right-panel">
            <div className="certificate-issue-details-card">
              <h3 className="certificate-issue-details-title">Certificate Details</h3>
              
              {/* Client Info */}
              <div className="certificate-issue-details-section">
                <h4 className="certificate-issue-details-subtitle">Client Info</h4>
                <div className="certificate-issue-details-grid">
                  <div className="certificate-issue-detail-item">
                    <User className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Name</span>
                      <span className="certificate-issue-detail-value">{selectedClient.client_name}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <Phone className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Mobile</span>
                      <span className="certificate-issue-detail-value">{selectedClient.mobile}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <MapPin className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Town</span>
                      <span className="certificate-issue-detail-value">{selectedClient.town}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <Mail className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Mail</span>
                      <span className="certificate-issue-detail-value">{selectedClient.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Policy Info */}
              <div className="certificate-issue-details-section">
                <h4 className="certificate-issue-details-subtitle">Selected Policy Info</h4>
                <div className="certificate-issue-details-grid">
                  <div className="certificate-issue-detail-item">
                    <Shield className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Insurer</span>
                      <span className="certificate-issue-detail-value">{selectedPolicy.policy_type}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <FileText className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Policy No.</span>
                      <span className="certificate-issue-detail-value">{selectedPolicy.policy_number}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <Shield className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Coverage/Risk</span>
                      <span className="certificate-issue-detail-value">{selectedPolicy.cover_type}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <Calendar className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Policy Date</span>
                      <span className="certificate-issue-detail-value">{selectedPolicy.start_date}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <AlertCircle className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Expiry Date</span>
                      <span className="certificate-issue-detail-value">{selectedPolicy.expiry_date}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <DollarSign className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Total Premium</span>
                      <span className="certificate-issue-detail-value">KES {(selectedPolicy.premium_amount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <DollarSign className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Total Paid</span>
                      <span className="certificate-issue-detail-value">KES {((selectedPolicy.premium_amount - selectedPolicy.premium_balance) || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    <DollarSign className="certificate-issue-detail-icon" />
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Total Balance</span>
                      <span className="certificate-issue-detail-value" style={{ 
                        color: (selectedPolicy.premium_balance || 0) > 0 ? '#ef4444' : '#10b981'
                      }}>
                        KES {(selectedPolicy.premium_balance || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="certificate-issue-detail-item">
                    {getStatusIcon(selectedPolicy.status)}
                    <div className="certificate-issue-detail-content">
                      <span className="certificate-issue-detail-label">Policy Status</span>
                      <span className="certificate-issue-detail-value" style={{ color: getStatusColor(selectedPolicy.status) }}>
                        {selectedPolicy.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && issuedCertificate && (
        <div className="certificate-issue-modal-overlay">
          <div className="certificate-issue-modal">
            <div className="certificate-issue-modal-header">
              <h2 className="certificate-issue-modal-title">Certificate Issued Successfully!</h2>
              <button 
                className="certificate-issue-modal-close"
                onClick={() => setShowSuccessModal(false)}
              >
                <X className="certificate-issue-modal-close-icon" />
              </button>
            </div>
            <div className="certificate-issue-modal-body">
              <div className="certificate-issue-success-content">
                <div className="certificate-issue-success-icon">
                  <FileCheck size={48} color="#10b981" />
                </div>
                <h3 className="certificate-issue-success-title">Certificate Generated</h3>
                <div className="certificate-issue-certificate-display">
                  <div className="certificate-issue-certificate-number">{issuedCertificate.certificateNo}</div>
                  <div className="certificate-issue-certificate-badge">Issued</div>
                </div>
                <div className="certificate-issue-success-details">
                  <div className="certificate-issue-success-item">
                    <span className="certificate-issue-success-label">Client:</span>
                    <span className="certificate-issue-success-value">{issuedCertificate.client.client_name}</span>
                  </div>
                  <div className="certificate-issue-success-item">
                    <span className="certificate-issue-success-label">Policy:</span>
                    <span className="certificate-issue-success-value">{issuedCertificate.policy.policy_number}</span>
                  </div>
                  <div className="certificate-issue-success-item">
                    <span className="certificate-issue-success-label">Category:</span>
                    <span className="certificate-issue-success-value">{issuedCertificate.category}</span>
                  </div>
                  <div className="certificate-issue-success-item">
                    <span className="certificate-issue-success-label">Date:</span>
                    <span className="certificate-issue-success-value">{issuedCertificate.issuedDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="certificate-issue-modal-footer">
              <button 
                className="certificate-issue-btn certificate-issue-btn-primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  handleReset();
                }}
              >
                Issue Another Certificate
              </button>
              <button 
                className="certificate-issue-btn certificate-issue-btn-secondary"
                onClick={() => setShowSuccessModal(false)}
              >
                View Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateIssue;
