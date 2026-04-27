import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, FileSpreadsheet, X, User, Calendar, DollarSign, Shield, Car, Heart, Briefcase, ChevronDown, RefreshCw, Save, Filter, Download } from 'lucide-react';
import './PolicyEndorsement.css';

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

const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
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

const PolicyEndorsement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientPopup, setShowClientPopup] = useState(false);
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [endorsementType, setEndorsementType] = useState('');
  const [endorsementReason, setEndorsementReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Endorsement States
  const [endorsementData, setEndorsementData] = useState({
    insurerCompany: 'Britam Insurance', // Pre-select first company
    policy: 'Comprehensive Motor Insurance', // Pre-select first policy
    product: 'Private Car', // Pre-select first product
    policyNumber: '',
    endorsementType: 'addition', // Pre-select first type
    endorsementReason: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    changes: '',
    previousPremium: '25000', // Default premium from first transaction
    newPremium: '',
    premiumDifference: '',
    remark: '',
    // Additional details
    endorsementDate: new Date().toISOString().split('T')[0],
    processedBy: 'John Kamau', // Current user
    approvedBy: 'Jane Smith', // Manager who approves
    priority: 'Normal', // Priority level
    status: 'Draft' // Current status
  });
  
  // Motor Endorsement States
  const [motorEndorsements, setMotorEndorsements] = useState([
    {
      id: 1,
      policyNumber: 'POL001',
      regNo: 'KAB 123X',
      make: 'Toyota',
      bodyType: 'Saloon',
      motorValue: '500000',
      premium: '25000',
      endorsementType: 'Addition',
      endorsementReason: 'Added comprehensive cover',
      effectiveDate: '2024-01-15',
      status: 'Active'
    },
    {
      id: 2,
      policyNumber: 'POL002',
      regNo: 'KBC 456Y',
      make: 'Isuzu',
      bodyType: 'Truck',
      motorValue: '800000',
      premium: '35000',
      endorsementType: 'Alteration',
      endorsementReason: 'Changed vehicle details',
      effectiveDate: '2024-02-10',
      status: 'Active'
    }
  ]);
  
  // Medical Endorsement States
  const [medicalEndorsements, setMedicalEndorsements] = useState([
    {
      id: 1,
      policyNumber: 'POL003',
      memberNo: 'MEM001',
      beneficiary: 'Self',
      ageBand: '18-35',
      coverLimits: '500000',
      premium: '15000',
      endorsementType: 'Addition',
      endorsementReason: 'Added dental cover',
      effectiveDate: '2024-01-20',
      status: 'Active'
    },
    {
      id: 2,
      policyNumber: 'POL004',
      memberNo: 'MEM002',
      beneficiary: 'Family',
      ageBand: '36-50',
      coverLimits: '1000000',
      premium: '25000',
      endorsementType: 'Alteration',
      endorsementReason: 'Updated beneficiary details',
      effectiveDate: '2024-02-15',
      status: 'Active'
    }
  ]);
  
  // Non-Motor Endorsement States
  const [nonMotorEndorsements, setNonMotorEndorsements] = useState([
    {
      id: 1,
      policyNumber: 'POL005',
      cover: 'Fire & Theft',
      mode: 'Annually',
      modeValue: '2000000',
      premium: '12000',
      endorsementType: 'Addition',
      endorsementReason: 'Added theft protection',
      effectiveDate: '2024-01-25',
      status: 'Active'
    },
    {
      id: 2,
      policyNumber: 'POL006',
      cover: 'Business Package',
      mode: 'Semi-Annual',
      modeValue: '5000000',
      premium: '18000',
      endorsementType: 'Alteration',
      endorsementReason: 'Updated business coverage',
      effectiveDate: '2024-03-01',
      status: 'Active'
    }
  ]);

  // Data states
  const [clients, setClients] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [clientPolicies, setClientPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [clientsData, productsData] = await Promise.all([
          fetchClients(),
          fetchProducts()
        ]);
        setClients(clientsData);
        setProductsData(productsData);
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

  // Mock data for dropdowns with category filtering
  const [insurerCompanies] = useState([
    { id: 1, name: 'Britam Insurance', categories: ['Motor', 'Non-Motor', 'Accidental and Medical'] },
    { id: 2, name: 'Jubilee Insurance', categories: ['Motor', 'Accidental and Medical'] },
    { id: 3, name: 'APA Insurance', categories: ['Motor', 'Non-Motor', 'Accidental and Medical'] },
    { id: 4, name: 'UAP Insurance', categories: ['Motor', 'Non-Motor'] },
    { id: 5, name: 'CIC Insurance', categories: ['Non-Motor', 'Accidental and Medical'] },
    { id: 6, name: 'GA Insurance', categories: ['Motor', 'Non-Motor'] },
    { id: 7, name: 'Madison Insurance', categories: ['Motor', 'Non-Motor', 'Accidental and Medical'] },
    { id: 8, name: 'ICEA Lion', categories: ['Motor', 'Non-Motor'] },
    { id: 9, name: 'Heritage Insurance', categories: ['Motor', 'Non-Motor', 'Accidental and Medical'] },
    { id: 10, name: 'Kenya Orient', categories: ['Motor', 'Non-Motor'] }
  ]);

  const [policies] = useState([
    { id: 1, name: 'Comprehensive Motor Insurance', policyId: 1, category: 'Motor' },
    { id: 2, name: 'Third Party Motor Insurance', policyId: 1, category: 'Motor' },
    { id: 3, name: 'Health Insurance', policyId: 3, category: 'Accidental and Medical' },
    { id: 4, name: 'Life Insurance', policyId: 3, category: 'Accidental and Medical' },
    { id: 5, name: 'Home Insurance', policyId: 5, category: 'Non-Motor' },
    { id: 6, name: 'Travel Insurance', policyId: 5, category: 'Non-Motor' },
    { id: 7, name: 'Personal Accident', policyId: 3, category: 'Accidental and Medical' },
    { id: 8, name: 'Domestic Package Insurance', policyId: 5, category: 'Non-Motor' },
    { id: 9, name: 'Business Package Insurance', policyId: 5, category: 'Non-Motor' },
    { id: 10, name: 'Industrial Package Insurance', policyId: 5, category: 'Non-Motor' }
  ]);

  const [products] = useState([
    { id: 1, name: 'Private Car', policyId: 1, category: 'Motor' },
    { id: 2, name: 'Commercial Vehicle', policyId: 2, category: 'Motor' },
    { id: 3, name: 'Motorcycle', policyId: 1, category: 'Motor' },
    { id: 4, name: 'Individual Cover', policyId: 3, category: 'Accidental and Medical' },
    { id: 5, name: 'Family Cover', policyId: 3, category: 'Accidental and Medical' },
    { id: 6, name: 'Group Personal Accident', policyId: 3, category: 'Accidental and Medical' },
    { id: 7, name: 'Inpatient Medical Cover', policyId: 6, category: 'Accidental and Medical' },
    { id: 8, name: 'Outpatient Medical Cover', policyId: 6, category: 'Accidental and Medical' },
    { id: 9, name: 'Domestic Package', policyId: 5, category: 'Non-Motor' },
    { id: 10, name: 'Business Package', policyId: 5, category: 'Non-Motor' },
    { id: 11, name: 'Industrial Package', policyId: 5, category: 'Non-Motor' }
  ]);

  // Endorsement types
  const endorsementTypes = [
    { value: 'addition', label: 'Addition (Add Cover)' },
    { value: 'alteration', label: 'Alteration (Change Details)' },
    { value: 'deletion', label: 'Deletion (Remove Cover)' },
    { value: 'correction', label: 'Correction (Fix Error)' },
    { value: 'reinstatement', label: 'Reinstatement (Restore Policy)' },
    { value: 'transfer', label: 'Transfer (Change Ownership)' },
    { value: 'cancellation', label: 'Cancellation (Terminate Policy)' }
  ];

  const bodyTypes = ['Saloon', 'SUV', 'Pickup', 'Van', 'Truck', 'Motorcycle', 'Bus'];
  const beneficiaries = ['Self', 'Spouse', 'Children', 'Parents', 'Group'];
  const ageBands = ['0-18', '19-35', '36-50', '51-65', '65+'];
  const nonMotorCovers = ['Fire', 'Burglary', 'Theft', 'Accident', 'Marine'];
  const modes = ['Annual', 'Semi-Annual', 'Quarterly', 'Monthly'];

  // Filter dropdowns based on selections
  const filteredPolicies = endorsementData.policy 
    ? productsData.filter(product => product.policyId === parseInt(endorsementData.policy))
    : [];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.idNumber && client.idNumber.includes(searchTerm)) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  // Handle search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowClientPopup(value.length > 0);
  };

  // Handle client selection
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setSearchTerm('');
    setShowClientPopup(false);
    setSelectedTransaction(null);
  };

  // Handle transaction selection
  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionPopup(false);
    
    // Pre-fill endorsement data based on selected transaction
    setEndorsementData({
      insurerCompany: transaction.insurerCompany,
      policy: transaction.policy,
      product: transaction.product,
      policyNumber: transaction.policyNumber,
      endorsementType: '',
      endorsementReason: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      changes: '',
      previousPremium: transaction.premium,
      newPremium: '',
      premiumDifference: '',
      remark: ''
    });
    
    // Set category based on transaction
    const category = transaction.category;
    
    // Pre-fill category-specific data
    if (category === 'Motor') {
      setMotorData({
        regNo: transaction.regNo || '',
        make: transaction.make || '',
        bodyType: transaction.bodyType || '',
        motorValue: transaction.motorValue || '',
        premium: transaction.premium || ''
      });
    } else if (category === 'Accidental and Medical') {
      setMedicalData({
        memberNo: transaction.memberNo || '',
        beneficiary: transaction.beneficiary || '',
        ageBand: transaction.ageBand || '',
        coverLimits: transaction.coverLimits || '',
        premium: transaction.premium || ''
      });
    } else if (category === 'Non-Motor') {
      setNonMotorData({
        cover: transaction.cover || '',
        mode: transaction.mode || '',
        modeValue: transaction.modeValue || '',
        premium: transaction.premium || ''
      });
    }
    
    // Set selected client if not already set
    if (!selectedClient) {
      const client = clients.find(c => c.id === transaction.clientId);
      if (client) {
        setSelectedClient(client);
      }
    }
  };

  // Handle endorsement type change
  const handleEndorsementTypeChange = (e) => {
    const type = e.target.value;
    setEndorsementType(type);
    setEndorsementData({...endorsementData, endorsementType: type});
  };

  // Handle remove selected customer
  const handleRemoveCustomer = () => {
    setSelectedClient(null);
    setSelectedTransaction(null);
    setSearchTerm('');
    setShowClientPopup(false);
    setEndorsementData({
      insurerCompany: '',
      policy: '',
      product: '',
      policyNumber: '',
      endorsementType: '',
      endorsementReason: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      changes: '',
      previousPremium: '',
      newPremium: '',
      premiumDifference: '',
      remark: ''
    });
  };

  // Handle motor data insertion
  const handleMotorInsert = () => {
    if (motorData.regNo && motorData.make && motorData.premium) {
      const newEndorsement = {
        id: Date.now(),
        regNo: motorData.regNo,
        make: motorData.make,
        bodyType: motorData.bodyType,
        motorValue: motorData.motorValue,
        premium: motorData.premium,
        changeType: 'Motor Change'
      };
      setMotorEndorsements([...motorEndorsements, newEndorsement]);
      setMotorData({ regNo: '', make: '', bodyType: '', motorValue: '', premium: '' });
    }
  };

  // Handle medical data insertion
  const handleMedicalInsert = () => {
    if (medicalData.memberNo && medicalData.beneficiary && medicalData.ageBand) {
      const newEndorsement = {
        id: Date.now(),
        memberNo: medicalData.memberNo,
        beneficiary: medicalData.beneficiary,
        ageBand: medicalData.ageBand,
        coverLimits: medicalData.coverLimits,
        premium: medicalData.premium,
        changeType: 'Medical Change'
      };
      setMedicalEndorsements([...medicalEndorsements, newEndorsement]);
      setMedicalData({ memberNo: '', beneficiary: '', ageBand: '', coverLimits: '', premium: '' });
    }
  };

  // Handle non-motor data insertion
  const handleNonMotorInsert = () => {
    if (nonMotorData.cover && nonMotorData.mode && nonMotorData.modeValue) {
      const newEndorsement = {
        id: Date.now(),
        cover: nonMotorData.cover,
        mode: nonMotorData.mode,
        modeValue: nonMotorData.modeValue,
        premium: nonMotorData.premium,
        changeType: 'Non-Motor Change'
      };
      setNonMotorEndorsements([...nonMotorEndorsements, newEndorsement]);
      setNonMotorData({ cover: '', mode: '', modeValue: '', premium: '' });
    }
  };

  // Handle delete functions
  const handleDeleteMotorEndorsement = (id) => {
    setMotorEndorsements(motorEndorsements.filter(item => item.id !== id));
  };

  const handleDeleteMedicalEndorsement = (id) => {
    setMedicalEndorsements(medicalEndorsements.filter(item => item.id !== id));
  };

  const handleDeleteNonMotorEndorsement = (id) => {
    setNonMotorEndorsements(nonMotorEndorsements.filter(item => item.id !== id));
  };

  // Handle save endorsement
  const handleSaveEndorsement = () => {
    // Validate required fields
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }
    if (!endorsementData.insurerCompany || !endorsementData.policy || !endorsementData.product) {
      alert('Please fill in all required policy details');
      return;
    }
    if (!endorsementData.policyNumber) {
      alert('Please enter policy number');
      return;
    }
    if (!endorsementData.endorsementType) {
      alert('Please select endorsement type');
      return;
    }
    if (!endorsementData.endorsementReason) {
      alert('Please enter endorsement reason');
      return;
    }

    // Prepare endorsement data for saving
    const endorsementToSave = {
      id: Date.now(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      ...endorsementData,
      motorEndorsements: motorEndorsements,
      medicalEndorsements: medicalEndorsements,
      nonMotorEndorsements: nonMotorEndorsements,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Processed'
    };

    // Here you would normally save to database
    console.log('Saving endorsement:', endorsementToSave);
    
    // Show success message
    alert('Endorsement processed successfully!');
    
    // Reset form
    setSelectedClient(null);
    setSelectedTransaction(null);
    setEndorsementType('');
    setEndorsementReason('');
    setEndorsementData({
      insurerCompany: '',
      policy: '',
      product: '',
      policyNumber: '',
      endorsementType: '',
      endorsementReason: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      changes: '',
      previousPremium: '',
      newPremium: '',
      premiumDifference: '',
      remark: ''
    });
    setMotorEndorsements([]);
    setMedicalEndorsements([]);
    setNonMotorEndorsements([]);
    setMotorData({ regNo: '', make: '', bodyType: '', motorValue: '', premium: '' });
    setMedicalData({ memberNo: '', beneficiary: '', ageBand: '', coverLimits: '', premium: '' });
    setNonMotorData({ cover: '', mode: '', modeValue: '', premium: '' });
  };

  // Calculate premium difference when new premium changes
  useEffect(() => {
    if (endorsementData.newPremium && endorsementData.previousPremium) {
      const difference = parseFloat(endorsementData.newPremium) - parseFloat(endorsementData.previousPremium);
      setEndorsementData(prev => ({
        ...prev,
        premiumDifference: difference
      }));
    }
  }, [endorsementData.newPremium, endorsementData.previousPremium]);

  return (
    <div className="policy-endorsement-container">
      {/* Header */}
      <div className="policy-endorsement-header">
        <div className="policy-endorsement-header-content">
          <div className="policy-endorsement-header-left">
            <h1 className="policy-endorsement-title">Policy Endorsement</h1>
            <p className="policy-endorsement-subtitle">Make changes to existing policies and transactions</p>
          </div>
          <div className="policy-endorsement-header-actions">
            <button className="policy-endorsement-btn policy-endorsement-btn-outline">
              <RefreshCw className="icon" />
              Refresh
            </button>
            <button className="policy-endorsement-btn policy-endorsement-btn-primary">
              <Save className="icon" />
              Save Endorsement
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="policy-endorsement-filters">
        <div className="policy-endorsement-search">
          <Search className="policy-endorsement-search-icon" />
          <input
            type="text"
            placeholder="Search endorsements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="policy-endorsement-search-input"
          />
        </div>
        <button className="policy-endorsement-filter-btn">
          <Filter className="policy-endorsement-filter-icon" />
          Filters
        </button>
        <button className="policy-endorsement-export-btn">
          <Download className="policy-endorsement-export-icon" />
          Export
        </button>
      </div>

      {/* Main Content */}
      <div className="policy-endorsement-main-content">
        <div className="policy-endorsement-content-grid">
          {/* Left Panel */}
          <div className="policy-endorsement-left-panel">
            <div className="policy-endorsement-panel-section">
              <h3 className="policy-endorsement-panel-title">Policy Details</h3>
              <div className="policy-endorsement-form-row">
                <div className="policy-endorsement-form-group">
                  <label className="policy-endorsement-form-label">Insurer Company *</label>
                  <select
                    value={endorsementData.insurerCompany}
                    onChange={(e) => setEndorsementData({...endorsementData, insurerCompany: e.target.value})}
                    className="policy-endorsement-form-select"
                  >
                    <option value="">Select insurer company</option>
                    {insurerCompanies.filter(company => 
                      (selectedTransaction && company.categories.includes(selectedTransaction.category)) || !selectedTransaction
                    ).map(company => (
                      <option key={company.id} value={company.name}>{company.name}</option>
                    ))}
                  </select>
                </div>
                <div className="policy-endorsement-form-group">
                  <label className="policy-endorsement-form-label">Policy *</label>
                  <select
                    value={endorsementData.policy}
                    onChange={(e) => setEndorsementData({...endorsementData, policy: e.target.value})}
                    className="policy-endorsement-form-select"
                  >
                    <option value="">Select policy</option>
                    {policies.filter(policy => 
                      insurerCompanies.find(company => company.name === endorsementData.insurerCompany)?.categories.includes(policy.category)
                    ).map(policy => (
                      <option key={policy.id} value={policy.name}>{policy.name}</option>
                    ))}
                  </select>
                </div>
                <div className="policy-endorsement-form-group">
                  <label className="policy-endorsement-form-label">Product *</label>
                  <select
                    value={endorsementData.product}
                    onChange={(e) => setEndorsementData({...endorsementData, product: e.target.value})}
                    className="policy-endorsement-form-select"
                  >
                    <option value="">Select product</option>
                    {filteredPolicies.map(product => (
                      <option key={product.id} value={product.name}>{product.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="policy-endorsement-panel-section">
                <h3 className="policy-endorsement-panel-title">Endorsement Details</h3>
                <div className="policy-endorsement-form-row">
                  <div className="policy-endorsement-form-group">
                    <label className="policy-endorsement-form-label">Policy Number *</label>
                    <input
                      type="text"
                      placeholder="Enter policy number"
                      value={endorsementData.policyNumber}
                      onChange={(e) => setEndorsementData({...endorsementData, policyNumber: e.target.value})}
                      className="policy-endorsement-form-input"
                    />
                  </div>
                  <div className="policy-endorsement-form-group">
                    <label className="policy-endorsement-form-label">Endorsement Type *</label>
                    <select
                      value={endorsementData.endorsementType}
                      onChange={handleEndorsementTypeChange}
                      className="policy-endorsement-form-select"
                    >
                      <option value="">Select endorsement type</option>
                      {endorsementTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="policy-endorsement-form-row">
                  <div className="policy-endorsement-form-group">
                    <label className="policy-endorsement-form-label">Endorsement Reason *</label>
                    <textarea
                      placeholder="Describe the reason for this endorsement"
                      value={endorsementData.endorsementReason}
                      onChange={(e) => setEndorsementData({...endorsementData, endorsementReason: e.target.value})}
                      className="policy-endorsement-form-textarea"
                      rows="3"
                    />
                  </div>
                  <div className="policy-endorsement-form-group">
                    <label className="policy-endorsement-form-label">Effective Date *</label>
                    <input
                      type="date"
                      value={endorsementData.effectiveDate}
                      onChange={(e) => setEndorsementData({...endorsementData, effectiveDate: e.target.value})}
                      className="policy-endorsement-form-input"
                    />
                  </div>
                </div>

                <div className="policy-endorsement-form-row three-columns">
                  <div className="policy-endorsement-form-group">
                    <label className="policy-endorsement-form-label">Previous Premium</label>
                    <input
                      type="number"
                      value={endorsementData.previousPremium}
                      readOnly
                      className="policy-endorsement-form-input readonly"
                    />
                  </div>
                  <div className="policy-endorsement-form-group">
                    <label className="policy-endorsement-form-label">New Premium</label>
                    <input
                      type="number"
                      placeholder="Enter new premium amount"
                      value={endorsementData.newPremium}
                      onChange={(e) => setEndorsementData({...endorsementData, newPremium: e.target.value})}
                      className="policy-endorsement-form-input"
                    />
                  </div>
                  <div className="policy-endorsement-form-group">
                    <label className="policy-endorsement-form-label">Premium Difference</label>
                    <input
                      type="number"
                      value={endorsementData.premiumDifference}
                      readOnly
                      className={`policy-endorsement-form-input readonly ${endorsementData.premiumDifference > 0 ? 'positive' : 'negative'}`}
                    />
                  </div>
                </div>
                
                <div className="policy-endorsement-panel-section">
                  <h3 className="policy-endorsement-panel-title">Additional Information</h3>
                  <div className="policy-endorsement-form-row">
                    <div className="policy-endorsement-form-group">
                      <label className="policy-endorsement-form-label">Priority</label>
                      <select
                        value={endorsementData.priority}
                        onChange={(e) => setEndorsementData({...endorsementData, priority: e.target.value})}
                        className="policy-endorsement-form-select"
                      >
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="policy-endorsement-form-group">
                      <label className="policy-endorsement-form-label">Status</label>
                      <select
                        value={endorsementData.status}
                        onChange={(e) => setEndorsementData({...endorsementData, status: e.target.value})}
                        className="policy-endorsement-form-select"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending Approval</option>
                        <option value="Approved">Approved</option>
                        <option value="Processed">Processed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                
                <div className="policy-endorsement-panel-section">
                  <h3 className="policy-endorsement-panel-title">Additional Information</h3>
                  <div className="policy-endorsement-form-row">
                    <div className="policy-endorsement-form-group">
                      <label className="policy-endorsement-form-label">Endorsement Date</label>
                      <input
                        type="date"
                        value={endorsementData.endorsementDate}
                        onChange={(e) => setEndorsementData({...endorsementData, endorsementDate: e.target.value})}
                        className="policy-endorsement-form-input"
                      />
                    </div>
                    <div className="policy-endorsement-form-group">
                      <label className="policy-endorsement-form-label">Processed By</label>
                      <input
                        type="text"
                        placeholder="Who processed this endorsement"
                        value={endorsementData.processedBy}
                        onChange={(e) => setEndorsementData({...endorsementData, processedBy: e.target.value})}
                        className="policy-endorsement-form-input"
                      />
                    </div>
                    <div className="policy-endorsement-form-group">
                      <label className="policy-endorsement-form-label">Approved By</label>
                      <input
                        type="text"
                        placeholder="Who approved this endorsement"
                        value={endorsementData.approvedBy}
                        onChange={(e) => setEndorsementData({...endorsementData, approvedBy: e.target.value})}
                        className="policy-endorsement-form-input"
                      />
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
                
        <div className="policy-endorsement-panel-section">
          <h3 className="policy-endorsement-panel-title">Additional Information</h3>
          <div className="policy-endorsement-form-row">
            <div className="policy-endorsement-form-group">
              <label className="policy-endorsement-form-label">Endorsement Date</label>
              <input
                type="date"
                value={endorsementData.endorsementDate}
                onChange={(e) => setEndorsementData({...endorsementData, endorsementDate: e.target.value})}
                className="policy-endorsement-form-input"
              />
            </div>
            <div className="policy-endorsement-form-group">
              <label className="policy-endorsement-form-label">Processed By</label>
              <input
                type="text"
                placeholder="Who processed this endorsement"
                value={endorsementData.processedBy}
                onChange={(e) => setEndorsementData({...endorsementData, processedBy: e.target.value})}
                className="policy-endorsement-form-input"
              />
            </div>
            <div className="policy-endorsement-form-group">
              <label className="policy-endorsement-form-label">Approved By</label>
              <input
                type="text"
                placeholder="Who approved this endorsement"
                value={endorsementData.approvedBy}
                onChange={(e) => setEndorsementData({...endorsementData, approvedBy: e.target.value})}
                className="policy-endorsement-form-input"
              />
            </div>
          </div>
        </div>
      </div>

          {/* Right Panel */}
          <div className="policy-endorsement-right-panel">
            {/* Search Client */}
            <div className="policy-endorsement-search-group">
              <label className="policy-endorsement-search-label">Search Client</label>
              <div className="policy-endorsement-search-wrapper">
                <Search className="policy-endorsement-search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or phone..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowClientPopup(true)}
                  className="policy-endorsement-search-input"
                />
                {showClientPopup && (
                  <div className="policy-endorsement-client-popup">
                    {filteredClients.length === 0 ? (
                      <div className="policy-endorsement-client-option">
                        No clients found
                      </div>
                    ) : (
                      filteredClients.map(client => (
                        <div
                          key={client.id}
                          className="policy-endorsement-client-option"
                          onClick={() => handleClientSelect(client)}
                        >
                          <div className="policy-endorsement-client-option-name">{client.name}</div>
                          <div className="policy-endorsement-client-option-details">
                            ID: {client.idNumber} | Mobile: {client.mobile}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Search Previous Transaction */}
            <div className="policy-endorsement-search-group">
              <label className="policy-endorsement-search-label">Search Previous Transaction</label>
              <div className="policy-endorsement-search-wrapper">
                <Search className="policy-endorsement-search-icon" />
                <input
                  type="text"
                  placeholder="Search by policy number or client name..."
                  onFocus={() => setShowTransactionPopup(true)}
                  className="policy-endorsement-search-input"
                />
                {showTransactionPopup && (
                  <div className="policy-endorsement-client-popup">
                    {clientPolicies.length === 0 ? (
                      <div className="policy-endorsement-client-option">
                        No previous policies found
                      </div>
                    ) : (
                      clientPolicies.map(policy => (
                        <div
                          key={policy.id}
                          className="policy-endorsement-client-option"
                          onClick={() => handleTransactionSelect(policy)}
                        >
                          <div className="policy-endorsement-client-option-name">
                            {policy.policyNumber} - {policy.clientName}
                          </div>
                          <div className="policy-endorsement-client-option-details">
                            {policy.category} | {policy.product} | Premium: {policy.premium}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Customer Info */}
            {selectedClient && (
              <div className="policy-endorsement-customer-selected">
                <div className="policy-endorsement-customer-header">
                  <h3 className="policy-endorsement-customer-title">Customer Selected</h3>
                  <button 
                    className="policy-endorsement-remove-customer-btn"
                    onClick={handleRemoveCustomer}
                  >
                    <X className="policy-endorsement-remove-icon" />
                  </button>
                </div>
                <div className="policy-endorsement-customer-info">
                  <div className="policy-endorsement-customer-row">
                    <div className="policy-endorsement-customer-item">
                      <span className="policy-endorsement-customer-label">Name:</span>
                      <span className="policy-endorsement-customer-value">{selectedClient.name}</span>
                    </div>
                    <div className="policy-endorsement-customer-item">
                      <span className="policy-endorsement-customer-label">ID:</span>
                      <span className="policy-endorsement-customer-value">{selectedClient.idNumber}</span>
                    </div>
                    <div className="policy-endorsement-customer-item">
                      <span className="policy-endorsement-customer-label">Mobile:</span>
                      <span className="policy-endorsement-customer-value">{selectedClient.mobile}</span>
                    </div>
                    <div className="policy-endorsement-customer-item">
                      <span className="policy-endorsement-customer-label">Email:</span>
                      <span className="policy-endorsement-customer-value">{selectedClient.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Transaction Info */}
            {selectedTransaction && (
              <div className="policy-endorsement-transaction-selected">
                <div className="policy-endorsement-transaction-header">
                  <h3 className="policy-endorsement-transaction-title">Current Policy</h3>
                </div>
                <div className="policy-endorsement-transaction-info">
                  <div className="policy-endorsement-transaction-row">
                    <span className="policy-endorsement-transaction-label">Policy Number:</span>
                    <span className="policy-endorsement-transaction-value">{selectedTransaction.policyNumber}</span>
                  </div>
                  <div className="policy-endorsement-transaction-row">
                    <span className="policy-endorsement-transaction-label">Current Premium:</span>
                    <span className="policy-endorsement-transaction-value">{selectedTransaction.premium}</span>
                  </div>
                  <div className="policy-endorsement-transaction-row">
                    <span className="policy-endorsement-transaction-label">Category:</span>
                    <span className="policy-endorsement-transaction-value">{selectedTransaction.category}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Category-specific forms */}
            {selectedTransaction && (
              <>
                {selectedTransaction.category === 'Motor' && (
                  <div className="policy-endorsement-category-form">
                    <h3 className="policy-endorsement-form-title">Motor Changes</h3>
                    
                    <div className="policy-endorsement-form-row">
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Registration No *</label>
                        <input
                          type="text"
                          placeholder="Enter registration number"
                          value={motorData.regNo}
                          onChange={(e) => setMotorData({...motorData, regNo: e.target.value})}
                          className="policy-endorsement-form-input"
                        />
                      </div>
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Vehicle Make *</label>
                        <input
                          type="text"
                          placeholder="Enter vehicle make"
                          value={motorData.make}
                          onChange={(e) => setMotorData({...motorData, make: e.target.value})}
                          className="policy-endorsement-form-input"
                        />
                      </div>
                    </div>
                    
                    <div className="policy-endorsement-form-row">
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Body Type *</label>
                        <select
                          value={motorData.bodyType}
                          onChange={(e) => setMotorData({...motorData, bodyType: e.target.value})}
                          className="policy-endorsement-form-select"
                        >
                          <option value="">Select body type</option>
                          {bodyTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Motor Value *</label>
                        <input
                          type="number"
                          placeholder="Enter motor value"
                          value={motorData.motorValue}
                          onChange={(e) => setMotorData({...motorData, motorValue: e.target.value})}
                          className="policy-endorsement-form-input"
                        />
                      </div>
                    </div>

                    <div className="policy-endorsement-insert-section">
                      <button 
                        className="policy-endorsement-insert-btn"
                        onClick={handleMotorInsert}
                      >
                        <Plus className="policy-endorsement-insert-icon" />
                        Add Change
                      </button>
                    </div>

                    {/* Motor Endorsements Table */}
                    <div className="policy-endorsement-table-container">
                      <h4 className="policy-endorsement-table-title">Motor Changes</h4>
                      <table className="policy-endorsement-small-table">
                        <thead>
                          <tr>
                            <th>REG NO.</th>
                            <th>VEHICLE MAKE</th>
                            <th>BODY TYPE</th>
                            <th>MOTOR VALUE</th>
                            <th>PREMIUM</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {motorEndorsements.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="policy-endorsement-empty-table">
                                No motor changes added yet. Fill the form above and click Add Change.
                              </td>
                            </tr>
                          ) : (
                            motorEndorsements.map(endorsement => (
                              <tr key={endorsement.id}>
                                <td>{endorsement.regNo}</td>
                                <td>{endorsement.make}</td>
                                <td>{endorsement.bodyType}</td>
                                <td>{endorsement.motorValue}</td>
                                <td>{endorsement.premium}</td>
                                <td>
                                  <button 
                                    className="policy-endorsement-action-btn"
                                    onClick={() => handleDeleteMotorEndorsement(endorsement.id)}
                                  >
                                    <Trash2 className="policy-endorsement-action-icon" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedTransaction.category === 'Accidental and Medical' && (
                  <div className="policy-endorsement-category-form">
                    <h3 className="policy-endorsement-form-title">Medical Changes</h3>
                    
                    <div className="policy-endorsement-form-row">
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Member No *</label>
                        <input
                          type="text"
                          placeholder="Enter member number"
                          value={medicalData.memberNo}
                          onChange={(e) => setMedicalData({...medicalData, memberNo: e.target.value})}
                          className="policy-endorsement-form-input"
                        />
                      </div>
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Beneficiary *</label>
                        <select
                          value={medicalData.beneficiary}
                          onChange={(e) => setMedicalData({...medicalData, beneficiary: e.target.value})}
                          className="policy-endorsement-form-select"
                        >
                          <option value="">Select beneficiary</option>
                          {beneficiaries.map((beneficiary, index) => (
                            <option key={index} value={beneficiary}>{beneficiary}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="policy-endorsement-form-row">
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Age Band *</label>
                        <select
                          value={medicalData.ageBand}
                          onChange={(e) => setMedicalData({...medicalData, ageBand: e.target.value})}
                          className="policy-endorsement-form-select"
                        >
                          <option value="">Select age band</option>
                          {ageBands.map((band, index) => (
                            <option key={index} value={band}>{band}</option>
                          ))}
                        </select>
                      </div>
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Cover Limits *</label>
                        <input
                          type="text"
                          placeholder="Enter cover limits"
                          value={medicalData.coverLimits}
                          onChange={(e) => setMedicalData({...medicalData, coverLimits: e.target.value})}
                          className="policy-endorsement-form-input"
                        />
                      </div>
                    </div>

                    <div className="policy-endorsement-insert-section">
                      <button 
                        className="policy-endorsement-insert-btn"
                        onClick={handleMedicalInsert}
                      >
                        <Plus className="policy-endorsement-insert-icon" />
                        Add Change
                      </button>
                    </div>

                    {/* Medical Endorsements Table */}
                    <div className="policy-endorsement-table-container">
                      <h4 className="policy-endorsement-table-title">Medical Changes</h4>
                      <table className="policy-endorsement-small-table">
                        <thead>
                          <tr>
                            <th>MEMBER NO.</th>
                            <th>BENEFICIARY</th>
                            <th>AGE BAND</th>
                            <th>COVER LIMITS</th>
                            <th>PREMIUM</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medicalEndorsements.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="policy-endorsement-empty-table">
                                No medical changes added yet. Fill the form above and click Add Change.
                              </td>
                            </tr>
                          ) : (
                            medicalEndorsements.map(endorsement => (
                              <tr key={endorsement.id}>
                                <td>{endorsement.memberNo}</td>
                                <td>{endorsement.beneficiary}</td>
                                <td>{endorsement.ageBand}</td>
                                <td>{endorsement.coverLimits}</td>
                                <td>{endorsement.premium}</td>
                                <td>
                                  <button 
                                    className="policy-endorsement-action-btn"
                                    onClick={() => handleDeleteMedicalEndorsement(endorsement.id)}
                                  >
                                    <Trash2 className="policy-endorsement-action-icon" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedTransaction.category === 'Non-Motor' && (
                  <div className="policy-endorsement-category-form">
                    <h3 className="policy-endorsement-form-title">Non-Motor Changes</h3>
                    
                    <div className="policy-endorsement-form-row">
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Cover *</label>
                        <select
                          value={nonMotorData.cover}
                          onChange={(e) => setNonMotorData({...nonMotorData, cover: e.target.value})}
                          className="policy-endorsement-form-select"
                        >
                          <option value="">Select cover type</option>
                          {nonMotorCovers.map((cover, index) => (
                            <option key={index} value={cover}>{cover}</option>
                          ))}
                        </select>
                      </div>
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Mode *</label>
                        <select
                          value={nonMotorData.mode}
                          onChange={(e) => setNonMotorData({...nonMotorData, mode: e.target.value})}
                          className="policy-endorsement-form-select"
                        >
                          <option value="">Select mode</option>
                          {modes.map((mode, index) => (
                            <option key={index} value={mode}>{mode}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="policy-endorsement-form-row single-column">
                      <div className="policy-endorsement-form-group">
                        <label className="policy-endorsement-form-label">Mode Value *</label>
                        <input
                          type="number"
                          placeholder="Enter mode value"
                          value={nonMotorData.modeValue}
                          onChange={(e) => setNonMotorData({...nonMotorData, modeValue: e.target.value})}
                          className="policy-endorsement-form-input"
                        />
                      </div>
                    </div>

                    <div className="policy-endorsement-insert-section">
                      <button 
                        className="policy-endorsement-insert-btn"
                        onClick={handleNonMotorInsert}
                      >
                        <Plus className="policy-endorsement-insert-icon" />
                        Add Change
                      </button>
                    </div>

                    {/* Non-Motor Endorsements Table */}
                    <div className="policy-endorsement-table-container">
                      <h4 className="policy-endorsement-table-title">Non-Motor Changes</h4>
                      <table className="policy-endorsement-small-table">
                        <thead>
                          <tr>
                            <th>COVER</th>
                            <th>MODE</th>
                            <th>MODE VALUE</th>
                            <th>PREMIUM</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nonMotorEndorsements.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="policy-endorsement-empty-table">
                                No non-motor changes added yet. Fill the form above and click Add Change.
                              </td>
                            </tr>
                          ) : (
                            nonMotorEndorsements.map(endorsement => (
                              <tr key={endorsement.id}>
                                <td>{endorsement.cover}</td>
                                <td>{endorsement.mode}</td>
                                <td>{endorsement.modeValue}</td>
                                <td>{endorsement.premium}</td>
                                <td>
                                  <button 
                                    className="policy-endorsement-action-btn"
                                    onClick={() => handleDeleteNonMotorEndorsement(endorsement.id)}
                                  >
                                    <Trash2 className="policy-endorsement-action-icon" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Remarks Section */}
            <div className="policy-endorsement-remarks-section">
              <div className="policy-endorsement-form-group">
                <label className="policy-endorsement-form-label">Remarks</label>
                <textarea
                  placeholder="Enter any additional remarks or notes"
                  value={endorsementData.remark}
                  onChange={(e) => setEndorsementData({...endorsementData, remark: e.target.value})}
                  className="policy-endorsement-form-textarea"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save/Update Button */}
      <div className="policy-endorsement-save-section">
        <button 
          className="policy-endorsement-save-btn"
          onClick={handleSaveEndorsement}
          disabled={!selectedClient || !endorsementData.insurerCompany || !endorsementData.policy || !endorsementData.endorsementType || !endorsementData.endorsementReason}
        >
          <Save className="policy-endorsement-save-icon" />
          Process Endorsement
        </button>
      </div>
    </div>
  );
};

export default PolicyEndorsement;
