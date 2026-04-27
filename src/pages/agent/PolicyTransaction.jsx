import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Trash2, Plus, Save, Calendar, DollarSign, FileText, User, Shield, Car, Heart, Briefcase, Home, AlertCircle, CheckCircle, Clock, Upload, Download } from 'lucide-react';
import apiService from '../../services/api';
import './PolicyTransaction.css';

const PolicyTransaction = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientPopup, setShowClientPopup] = useState(false);
  const [showExtraPremiumsPopup, setShowExtraPremiumsPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('premiums');
  const [category, setCategory] = useState('Motor'); // Pre-select Motor by default
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Medical Insurance States
  const [medicalData, setMedicalData] = useState({
    memberNo: '',
    beneficiary: '',
    ageBand: ''
  });

  // Non-Motor Insurance States
  const [nonMotorData, setNonMotorData] = useState({
    cover: '',
    mode: '',
    modeValue: ''
  });

  // Motor Insurance States
  const [motorData, setMotorData] = useState({
    regNo: '',
    make: '',
    premium: ''
  });
  const [motorTransactions, setMotorTransactions] = useState([]);
  const [medicalTransactions, setMedicalTransactions] = useState([]);
  const [nonMotorTransactions, setNonMotorTransactions] = useState([]);
  
  // Left Panel States
  const [policyData, setPolicyData] = useState({
    insurerCompany: '',
    policy: '',
    product: '',
    dateFrom: new Date().toISOString().split('T')[0], // Today
    dateTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // One year from today
    policyValue: '',
    premiumRate: '',
    remark: ''
  });
  
  // Levy States
  const [levies, setLevies] = useState({});

  // Data states
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [clientsData, productsData] = await Promise.all([
          apiService.getClients(),
          apiService.getProducts()
        ]);
        setClients(clientsData.data || clientsData);
        setProducts(productsData.data || productsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Dropdown options — will be populated from API or kept as empty arrays
  const [insurerCompanies] = useState([]);

  const allPolicies = [];

  const allProducts = products;

  // Filtered options based on category
  const filteredCompanies = category 
    ? insurerCompanies.filter(company => company.categories.includes(category))
    : insurerCompanies;

  const filteredPolicies = category && policyData.insurerCompany
    ? allPolicies.filter(policy => 
        policy.category === category && 
        policy.companyId === parseInt(insurerCompanies.find(c => c.name === policyData.insurerCompany)?.id)
      )
    : (category ? allPolicies.filter(policy => policy.category === category) : []);

  const filteredProducts = category && policyData.policy
    ? allProducts.filter(product => 
        product.category === category && 
        product.policyId === parseInt(allPolicies.find(p => p.name === policyData.policy)?.id)
      )
    : (category ? allProducts.filter(product => product.category === category) : []);

  const [beneficiaryOptions] = useState([]);
  const [ageBandOptions] = useState([]);
  const [nonMotorCoverOptions] = useState([]);
  const [nonMotorModeOptions] = useState([]);

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    (client.client_name && client.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.id_number && client.id_number.includes(searchTerm)) ||
    (client.mobile && client.mobile.includes(searchTerm))
  ).slice(0, 3);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowClientPopup(value.length > 0);
  };

  // Handle client selection
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setSearchTerm(''); // Clear search after selection
    setShowClientPopup(false);
  };

  // Handle remove selected customer
  const handleRemoveCustomer = () => {
    setSelectedClient(null);
    setSearchTerm('');
    setShowClientPopup(false);
  };

  // Extra premiums and levies (editable)
  const [extraPremiums, setExtraPremiums] = useState([
    { id: 1, description: 'Driver Protection Cover', rate: '2.5%', amount: 0 },
    { id: 2, description: 'Passenger Liability Cover', rate: '1.8%', amount: 0 },
    { id: 3, description: 'Roadside Assistance', rate: '0.5%', amount: 0 },
    { id: 4, description: 'Windshield Cover', rate: '1.2%', amount: 0 }
  ]);
  const [extraLevies, setExtraLevies] = useState([
    { id: 1, description: 'Stamp Duty', rate: 'Fixed', amount: 50 },
    { id: 2, description: 'Policy Administration Fee', rate: 'Fixed', amount: 100 },
    { id: 3, description: 'Environmental Levy', rate: '0.3%', amount: 0 },
    { id: 4, description: 'Training Levy', rate: '0.2%', amount: 0 }
  ]);

  // Calculate total premium when policy value, premium rate, or levies change
  useEffect(() => {
    if (policyData.policyValue && policyData.premiumRate) {
      const basicPremium = parseFloat(policyData.policyValue) * (parseFloat(policyData.premiumRate) / 100);
      
      // Calculate total extra premiums
      const totalExtraPremiums = extraPremiums.reduce((sum, premium) => {
        if (premium.rate.includes('%')) {
          const rate = parseFloat(premium.rate.replace('%', ''));
          return sum + (basicPremium * rate / 100);
        }
        return sum + premium.amount;
      }, 0);
      
      // Calculate total extra levies
      const totalExtraLevies = extraLevies.reduce((sum, levy) => {
        if (levy.rate.includes('%')) {
          const rate = parseFloat(levy.rate.replace('%', ''));
          return sum + (basicPremium * rate / 100);
        }
        return sum + levy.amount;
      }, 0);
      
      const totalLeviesAndTaxes = totalExtraPremiums + totalExtraLevies;
      const totalPremium = basicPremium + totalLeviesAndTaxes;
      
      setLevies(prev => ({
        ...prev,
        totalLevies: totalLeviesAndTaxes,
        basicPremium: basicPremium,
        totalPremium: totalPremium
      }));
    }
  }, [policyData.policyValue, policyData.premiumRate, extraPremiums, extraLevies]);

  // Recalculate when extra premiums or levies are updated
  useEffect(() => {
    if (policyData.policyValue && policyData.premiumRate) {
      const basicPremium = parseFloat(policyData.policyValue) * (parseFloat(policyData.premiumRate) / 100);
      
      // Calculate total extra premiums
      const totalExtraPremiums = extraPremiums.reduce((sum, premium) => {
        if (premium.rate.includes('%')) {
          const rate = parseFloat(premium.rate.replace('%', ''));
          return sum + (basicPremium * rate / 100);
        }
        return sum + premium.amount;
      }, 0);
      
      // Calculate total extra levies
      const totalExtraLevies = extraLevies.reduce((sum, levy) => {
        if (levy.rate.includes('%')) {
          const rate = parseFloat(levy.rate.replace('%', ''));
          return sum + (basicPremium * rate / 100);
        }
        return sum + levy.amount;
      }, 0);
      
      const totalLeviesAndTaxes = totalExtraPremiums + totalExtraLevies;
      const totalPremium = basicPremium + totalLeviesAndTaxes;
      
      setLevies(prev => ({
        ...prev,
        totalLevies: totalLeviesAndTaxes,
        basicPremium: basicPremium,
        totalPremium: totalPremium
      }));
    }
  }, [extraPremiums, extraLevies]);

  // Handle motor data insertion
  const handleMotorInsert = () => {
    if (motorData.regNo && motorData.make && motorData.premium) {
      const newTransaction = {
        id: Date.now(),
        regNo: motorData.regNo,
        make: motorData.make,
        model: 'Toyota', // Default model, should be added to form
        motorUse: 'Private', // Default use, should be added to form
        bodyType: 'Saloon', // Default body type, should be added to form
        motorValue: '500000', // Default value, should be added to form
        premium: motorData.premium
      };
      setMotorTransactions([...motorTransactions, newTransaction]);
      setMotorData({ regNo: '', make: '', premium: '' });
    }
  };

  // Handle medical data insertion
  const handleMedicalInsert = () => {
    if (medicalData.memberNo && medicalData.beneficiary && medicalData.ageBand) {
      const newTransaction = {
        id: Date.now(),
        memberNo: medicalData.memberNo,
        name: selectedClient?.name || 'Client Name',
        beneficiary: medicalData.beneficiary,
        ageBand: medicalData.ageBand,
        coverLimits: '1000000', // Default limit, should be calculated
        premium: '15000' // Default premium, should be calculated
      };
      setMedicalTransactions([...medicalTransactions, newTransaction]);
      setMedicalData({ memberNo: '', beneficiary: '', ageBand: '' });
    }
  };

  // Handle non-motor data insertion
  const handleNonMotorInsert = () => {
    if (nonMotorData.cover && nonMotorData.mode && nonMotorData.modeValue) {
      const newTransaction = {
        id: Date.now(),
        cover: nonMotorData.cover,
        mode: nonMotorData.mode,
        modeValue: nonMotorData.modeValue,
        premium: '25000' // Default premium, should be calculated
      };
      setNonMotorTransactions([...nonMotorTransactions, newTransaction]);
      setNonMotorData({ cover: '', mode: '', modeValue: '' });
    }
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    // Reset policy data when category changes
    setPolicyData({
      insurerCompany: '',
      policy: '',
      product: '',
      dateFrom: new Date().toISOString().split('T')[0],
      dateTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      policyValue: '',
      premiumRate: '',
      remark: ''
    });
    // Reset all form data when category changes
    setMotorData({ regNo: '', make: '', premium: '' });
    setMedicalData({ memberNo: '', beneficiary: '', ageBand: '' });
    setNonMotorData({ cover: '', mode: '', modeValue: '' });
    // Reset levies when category changes
    setLevies({ totalLevies: 0, basicPremium: 0, totalPremium: 0 });
  };

  // Handle Enter key press for auto-insert
  const handleKeyPress = (e, category) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      switch (category) {
        case 'Motor':
          handleMotorInsert();
          break;
        case 'Accidental and Medical':
          handleMedicalInsert();
          break;
        case 'Non-Motor':
          handleNonMotorInsert();
          break;
        default:
          break;
      }
    }
  };

  // Handle save transaction
  const handleSaveTransaction = async () => {
    // Validate required fields
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }
    if (!policyData.insurerCompany || !policyData.product) {
      alert('Please fill in all required policy details');
      return;
    }
    if (!policyData.policyValue || !policyData.premiumRate) {
      alert('Please enter policy value and premium rate');
      return;
    }

    const categoryMap = {
      'Motor': 'motor',
      'Accidental and Medical': 'medical',
      'Non-Motor': 'non_motor'
    };

    // Build transaction data matching backend model
    const transactionData = {
      client_name: selectedClient.client_name || selectedClient.name,
      category: categoryMap[category] || 'motor',
      product: policyData.product,
      insurer: policyData.insurerCompany,
      amount: levies.totalPremium || 0,
      transaction_date: policyData.dateFrom,
      notes: policyData.remark || '',
      status: 'Active',
    };

    try {
      const result = await apiService.createTransaction(transactionData);
      if (result && result.success !== false) {
        alert('Transaction saved successfully!');
      } else {
        alert(result?.message || 'Failed to save transaction');
        return;
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Error saving transaction. Please try again.');
      return;
    }

    // Reset form
    setSelectedClient(null);
    setCategory('Motor');
    setPolicyData({
      insurerCompany: '',
      policy: '',
      product: '',
      dateFrom: new Date().toISOString().split('T')[0],
      dateTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      policyValue: '',
      premiumRate: '',
      remark: ''
    });
    setMotorTransactions([]);
    setMedicalTransactions([]);
    setNonMotorTransactions([]);
    setMotorData({ regNo: '', make: '', premium: '' });
    setMedicalData({ memberNo: '', beneficiary: '', ageBand: '' });
    setNonMotorData({ cover: '', mode: '', modeValue: '' });
    setLevies({ totalLevies: 0, basicPremium: 0, totalPremium: 0 });
  };

  const categoryOptions = [
    { value: 'Motor', label: 'Motor' },
    { value: 'Non-Motor', label: 'Non-Motor' },
    { value: 'Accidental and Medical', label: 'Accidental and Medical' }
  ];

  return (
    <div className="policy-transaction-container">
      {/* Header */}
      <div className="policy-transaction-header">
        <div className="policy-transaction-header-content">
          <div className="policy-transaction-header-left">
            <h1 className="policy-transaction-title">Policy Transaction</h1>
            <p className="policy-transaction-subtitle">Calculate pricing and create new policy transaction</p>
          </div>
        </div>
      </div>

      
      {/* Main Content */}
      <div className="policy-transaction-main-content">
          <div className="policy-transaction-content-grid">
            {/* Left Panel */}
            <div className="policy-transaction-left-panel">
              <div className="policy-transaction-panel-section">
                <h3 className="policy-transaction-panel-title">Policy Details</h3>
                
                <div className="policy-transaction-form-group">
                  <label className="policy-transaction-form-label">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="policy-transaction-form-select"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="policy-transaction-form-group">
                  <label className="policy-transaction-form-label">Insurer Company *</label>
                  <select
                    value={policyData.insurerCompany}
                    onChange={(e) => setPolicyData({...policyData, insurerCompany: e.target.value})}
                    className="policy-transaction-form-select"
                    disabled={!category}
                  >
                    <option value="">Select Insurer</option>
                    {filteredCompanies.map(company => (
                      <option key={company.id} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="policy-transaction-form-group">
                  <label className="policy-transaction-form-label">Policy *</label>
                  <select
                    value={policyData.policy}
                    onChange={(e) => setPolicyData({...policyData, policy: e.target.value})}
                    className="policy-transaction-form-select"
                    disabled={!category || !policyData.insurerCompany}
                  >
                    <option value="">Select Policy</option>
                    {filteredPolicies.map(policy => (
                      <option key={policy.id} value={policy.name}>
                        {policy.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="policy-transaction-form-group">
                  <label className="policy-transaction-form-label">Product *</label>
                  <select
                    value={policyData.product}
                    onChange={(e) => setPolicyData({...policyData, product: e.target.value})}
                    className="policy-transaction-form-select"
                    disabled={!category || !policyData.policy}
                  >
                    <option value="">Select Product</option>
                    {filteredProducts.map(product => (
                      <option key={product.id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="policy-transaction-form-group">
                  <label className="policy-transaction-form-label">Date From *</label>
                  <input
                    type="date"
                    value={policyData.dateFrom}
                    onChange={(e) => setPolicyData({...policyData, dateFrom: e.target.value})}
                    className="policy-transaction-form-input"
                  />
                </div>

                <div className="policy-transaction-form-group">
                  <label className="policy-transaction-form-label">Date To *</label>
                  <input
                    type="date"
                    value={policyData.dateTo}
                    onChange={(e) => setPolicyData({...policyData, dateTo: e.target.value})}
                    className="policy-transaction-form-input"
                  />
                </div>

                
                <div className="policy-transaction-form-group">
                  <label className="policy-transaction-form-label">Remark</label>
                  <textarea
                    placeholder="Enter remarks"
                    value={policyData.remark}
                    onChange={(e) => setPolicyData({...policyData, remark: e.target.value})}
                    className="policy-transaction-form-textarea"
                    rows="3"
                  />
                </div>

                {/* Insert Button */}
                {category && (
                  <div className="policy-transaction-insert-section">
                    <button 
                      className="policy-transaction-insert-btn"
                      onClick={() => {
                        switch (category) {
                          case 'Motor':
                            handleMotorInsert();
                            break;
                          case 'Accidental and Medical':
                            handleMedicalInsert();
                            break;
                          case 'Non-Motor':
                            handleNonMotorInsert();
                            break;
                          default:
                            break;
                        }
                      }}
                    >
                      Insert {category} Transaction
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div className="policy-transaction-right-panel">
              {/* Search Client */}
              <div className="policy-transaction-search-group">
                <label className="policy-transaction-search-label">Search Client</label>
                <div className="policy-transaction-search-wrapper">
                  <Search className="policy-transaction-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name, ID number, or mobile..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="policy-transaction-search-input"
                  />
                </div>
                {/* Client Popup */}
                {showClientPopup && filteredClients.length > 0 && (
                  <div className="policy-transaction-client-popup">
                    {filteredClients.map(client => (
                      <div 
                        key={client.id} 
                        className="policy-transaction-client-option"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="policy-transaction-client-option-name">{client.client_name}</div>
                        <div className="policy-transaction-client-option-details">
                          ID: {client.id_number} | {client.mobile}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Customer Info */}
              {selectedClient && (
                <div className="policy-transaction-customer-selected">
                  <div className="policy-transaction-customer-header">
                    <h3 className="policy-transaction-customer-title">Customer Selected</h3>
                    <button 
                      className="policy-transaction-remove-customer-btn"
                      onClick={handleRemoveCustomer}
                      title="Remove customer"
                    >
                      <X className="policy-transaction-remove-icon" />
                    </button>
                  </div>
                  <div className="policy-transaction-customer-info">
                    <div className="policy-transaction-customer-row">
                      <div className="policy-transaction-customer-item">
                        <span className="policy-transaction-customer-label">Name:</span>
                        <span className="policy-transaction-customer-value">{selectedClient.client_name}</span>
                      </div>
                      <div className="policy-transaction-customer-item">
                        <span className="policy-transaction-customer-label">ID:</span>
                        <span className="policy-transaction-customer-value">{selectedClient.id_number}</span>
                      </div>
                      <div className="policy-transaction-customer-item">
                        <span className="policy-transaction-customer-label">Mobile:</span>
                        <span className="policy-transaction-customer-value">{selectedClient.mobile}</span>
                      </div>
                      <div className="policy-transaction-customer-item">
                        <span className="policy-transaction-customer-label">Email:</span>
                        <span className="policy-transaction-customer-value">{selectedClient.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category-specific forms */}
              {category === 'Motor' && (
                <div className="policy-transaction-category-form">
                  <h3 className="policy-transaction-form-title">Motor Insurance Details</h3>
                  
                  <div className="policy-transaction-form-row">
                    <div className="policy-transaction-form-group">
                      <label className="policy-transaction-form-label">Reg No. *</label>
                      <input
                        type="text"
                        placeholder="Enter registration number"
                        value={motorData.regNo}
                        onChange={(e) => setMotorData({...motorData, regNo: e.target.value})}
                        onKeyPress={(e) => handleKeyPress(e, 'Motor')}
                        className="policy-transaction-form-input"
                      />
                    </div>
                    
                    <div className="policy-transaction-form-group">
                      <label className="policy-transaction-form-label">Make *</label>
                      <input
                        type="text"
                        placeholder="Enter vehicle make"
                        value={motorData.make}
                        onChange={(e) => setMotorData({...motorData, make: e.target.value})}
                        onKeyPress={(e) => handleKeyPress(e, 'Motor')}
                        className="policy-transaction-form-input"
                      />
                    </div>
                    
                    <div className="policy-transaction-form-group">
                      <label className="policy-transaction-form-label">Premium *</label>
                      <input
                        type="number"
                        placeholder="Enter premium"
                        value={motorData.premium}
                        onChange={(e) => setMotorData({...motorData, premium: e.target.value})}
                        onKeyPress={(e) => handleKeyPress(e, 'Motor')}
                        className="policy-transaction-form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'Motor' && (
                <div className="policy-transaction-table-container">
                  <h4 className="policy-transaction-table-title">Motor Transactions</h4>
                  <table className="policy-transaction-small-table">
                    <thead>
                      <tr>
                        <th>REG NO.</th>
                        <th>VEHICLE MAKE</th>
                        <th>VEHICLE MODEL</th>
                        <th>MOTOR USE</th>
                        <th>BODY TYPE</th>
                        <th>MOTOR VALUE</th>
                        <th>PREMIUM</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {motorTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="policy-transaction-empty-table">
                            No motor transactions added yet. Fill the form above and press Enter or click Insert.
                          </td>
                        </tr>
                      ) : (
                        motorTransactions.map(transaction => (
                          <tr key={transaction.id}>
                            <td>{transaction.regNo}</td>
                            <td>{transaction.make}</td>
                            <td>{transaction.model}</td>
                            <td>{transaction.motorUse}</td>
                            <td>{transaction.bodyType}</td>
                            <td>{transaction.motorValue}</td>
                            <td>{transaction.premium}</td>
                            <td>
                              <button className="policy-transaction-action-btn">
                                <Trash2 className="policy-transaction-action-icon" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {category === 'Accidental and Medical' && (
                <div className="policy-transaction-category-form">
                  <h3 className="policy-transaction-form-title">Accidental and Medical Details</h3>
                  
                  <div className="policy-transaction-form-row">
                    <div className="policy-transaction-form-group">
                      <label className="policy-transaction-form-label">Member No. *</label>
                      <input
                        type="text"
                        placeholder="Enter member number"
                        value={medicalData.memberNo}
                        onChange={(e) => setMedicalData({...medicalData, memberNo: e.target.value})}
                        onKeyPress={(e) => handleKeyPress(e, 'Accidental and Medical')}
                        className="policy-transaction-form-input"
                      />
                    </div>
                    
                    <div className="policy-transaction-form-group">
                      <label className="policy-transaction-form-label">Beneficiary *</label>
                      <select
                        value={medicalData.beneficiary}
                        onChange={(e) => setMedicalData({...medicalData, beneficiary: e.target.value})}
                        className="policy-transaction-form-select"
                      >
                        <option value="">Select Beneficiary</option>
                        {beneficiaryOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="policy-transaction-form-group">
                      <label className="policy-transaction-form-label">Age Band *</label>
                      <select
                        value={medicalData.ageBand}
                        onChange={(e) => setMedicalData({...medicalData, ageBand: e.target.value})}
                        className="policy-transaction-form-select"
                      >
                        <option value="">Select Age Band</option>
                        {ageBandOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {category === 'Accidental and Medical' && (
                <div className="policy-transaction-table-container">
                  <h4 className="policy-transaction-table-title">Medical Transactions</h4>
                  <table className="policy-transaction-small-table">
                    <thead>
                      <tr>
                        <th>MB NO.</th>
                        <th>NAME</th>
                        <th>BENEFICIARY</th>
                        <th>AGE BAND</th>
                        <th>COVER LIMITS</th>
                        <th>PREMIUM</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicalTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="policy-transaction-empty-table">
                            No medical transactions added yet. Fill the form above and press Enter or click Insert.
                          </td>
                        </tr>
                      ) : (
                        medicalTransactions.map(transaction => (
                          <tr key={transaction.id}>
                            <td>{transaction.memberNo}</td>
                            <td>{transaction.name}</td>
                            <td>{transaction.beneficiary}</td>
                            <td>{transaction.ageBand}</td>
                            <td>{transaction.coverLimits}</td>
                            <td>{transaction.premium}</td>
                            <td>
                              <button className="policy-transaction-action-btn">
                                <Trash2 className="policy-transaction-action-icon" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {category === 'Non-Motor' && (
                <div className="policy-transaction-category-form">
                  <h3 className="policy-transaction-form-title">Non-Motor Insurance Details</h3>
                  
                  <div className="policy-transaction-form-row">
                    <div className="policy-transaction-form-group">
                      <label className="policy-transaction-form-label">Non-Motor Cover *</label>
                      <select
                        value={nonMotorData.cover}
                        onChange={(e) => setNonMotorData({...nonMotorData, cover: e.target.value})}
                        className="policy-transaction-form-select"
                      >
                        <option value="">Select Cover</option>
                        {nonMotorCoverOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="policy-transaction-form-group">
                      <label className="policy-transaction-form-label">Mode *</label>
                      <select
                        value={nonMotorData.mode}
                        onChange={(e) => setNonMotorData({...nonMotorData, mode: e.target.value})}
                        className="policy-transaction-form-select"
                      >
                        <option value="">Select Mode</option>
                        {nonMotorModeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    {nonMotorData.mode && (
                      <div className="policy-transaction-form-group">
                        <label className="policy-transaction-form-label">
                          {nonMotorData.mode === 'rate' ? 'Rate (%) *' : 
                           nonMotorData.mode === 'annual premium' ? 'Annual Premium *' : 
                           'Calculation Value *'}
                        </label>
                        <input
                          type="number"
                          placeholder={`Enter ${nonMotorData.mode}`}
                          value={nonMotorData.modeValue}
                          onChange={(e) => setNonMotorData({...nonMotorData, modeValue: e.target.value})}
                          onKeyPress={(e) => handleKeyPress(e, 'Non-Motor')}
                          className="policy-transaction-form-input"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {category === 'Non-Motor' && (
                <div className="policy-transaction-table-container">
                  <h4 className="policy-transaction-table-title">Non-Motor Transactions</h4>
                  <table className="policy-transaction-small-table">
                    <thead>
                      <tr>
                        <th>COVER</th>
                        <th>MODE</th>
                        <th>VALUE</th>
                        <th>PREMIUM</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nonMotorTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="policy-transaction-empty-table">
                            No non-motor transactions added yet. Fill the form above and press Enter or click Insert.
                          </td>
                        </tr>
                      ) : (
                        nonMotorTransactions.map(transaction => (
                          <tr key={transaction.id}>
                            <td>{transaction.cover}</td>
                            <td>{transaction.mode}</td>
                            <td>{transaction.modeValue}</td>
                            <td>{transaction.premium}</td>
                            <td>
                              <button className="policy-transaction-action-btn">
                                <Trash2 className="policy-transaction-action-icon" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Policy Value and Rate Section */}
              <div className="policy-transaction-policy-value-section">
                <h3 className="policy-transaction-policy-value-title">Policy Details</h3>
                <div className="policy-transaction-policy-value-grid">
                  <div className="policy-transaction-policy-value-item">
                    <label className="policy-transaction-policy-value-label">Policy Value *</label>
                    <input
                      type="number"
                      placeholder="Enter policy value"
                      value={policyData.policyValue}
                      onChange={(e) => setPolicyData({...policyData, policyValue: e.target.value})}
                      className="policy-transaction-policy-value-input"
                    />
                  </div>
                  <div className="policy-transaction-policy-value-item">
                    <label className="policy-transaction-policy-value-label">Premium Rate (%) *</label>
                    <input
                      type="number"
                      placeholder="Enter premium rate"
                      value={policyData.premiumRate}
                      onChange={(e) => setPolicyData({...policyData, premiumRate: e.target.value})}
                      className="policy-transaction-policy-value-input"
                    />
                  </div>
                </div>
              </div>

              {/* Levies and Premiums Section */}
              <div className="policy-transaction-levies-section">
                <h3 
                  className="policy-transaction-levies-title clickable"
                  onClick={() => setShowExtraPremiumsPopup(true)}
                >
                  Levies and Extra Premiums
                </h3>
                <div className="policy-transaction-levies-grid">
                  <div className="policy-transaction-levy-item">
                    <label className="policy-transaction-levy-label">TOTAL LEVIES / TAXES</label>
                    <input
                      type="number"
                      value={levies.totalLevies}
                      readOnly
                      className="policy-transaction-levy-input readonly"
                    />
                  </div>
                  <div className="policy-transaction-levy-item">
                    <label className="policy-transaction-levy-label">BASIC PREMIUM</label>
                    <input
                      type="number"
                      value={levies.basicPremium}
                      readOnly
                      className="policy-transaction-levy-input readonly"
                    />
                  </div>
                  <div className="policy-transaction-levy-item">
                    <label className="policy-transaction-levy-label">TOTAL PREMIUM</label>
                    <input
                      type="number"
                      value={levies.totalPremium}
                      readOnly
                      className="policy-transaction-levy-input readonly"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Extra Premiums Popup */}
      {showExtraPremiumsPopup && (
        <div className="policy-transaction-popup-overlay">
          <div className="policy-transaction-popup">
            <div className="policy-transaction-popup-header">
              <h2 className="policy-transaction-popup-title">Extra Premiums & Levies</h2>
              <button 
                className="policy-transaction-popup-close-btn"
                onClick={() => setShowExtraPremiumsPopup(false)}
              >
                <X className="policy-transaction-popup-close-icon" />
              </button>
            </div>

            {/* Tabs */}
            <div className="policy-transaction-popup-tabs">
              <button
                className={`policy-transaction-tab-btn ${activeTab === 'premiums' ? 'active' : ''}`}
                onClick={() => setActiveTab('premiums')}
              >
                Premiums
              </button>
              <button
                className={`policy-transaction-tab-btn ${activeTab === 'levies' ? 'active' : ''}`}
                onClick={() => setActiveTab('levies')}
              >
                Levies / Taxes
              </button>
            </div>

            {/* Tab Content */}
            <div className="policy-transaction-popup-content">
              {activeTab === 'premiums' && (
                <div className="policy-transaction-table-container">
                  <table className="policy-transaction-popup-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extraPremiums.map((premium) => (
                        <tr key={premium.id}>
                          <td>{premium.description}</td>
                          <td>{premium.rate}</td>
                          <td>
                            <input
                              type="number"
                              value={premium.amount}
                              onChange={(e) => {
                                const updated = extraPremiums.map(p =>
                                  p.id === premium.id ? {...p, amount: parseFloat(e.target.value) || 0} : p
                                );
                                setExtraPremiums(updated);
                              }}
                              className="policy-transaction-popup-input"
                            />
                          </td>
                          <td>
                            <button className="policy-transaction-popup-action-btn">
                              <Plus className="policy-transaction-popup-action-icon" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'levies' && (
                <div className="policy-transaction-table-container">
                  <table className="policy-transaction-popup-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extraLevies.map((levy) => (
                        <tr key={levy.id}>
                          <td>{levy.description}</td>
                          <td>{levy.rate}</td>
                          <td>
                            <input
                              type="number"
                              value={levy.amount}
                              onChange={(e) => {
                                const updated = extraLevies.map(l =>
                                  l.id === levy.id ? {...l, amount: parseFloat(e.target.value) || 0} : l
                                );
                                setExtraLevies(updated);
                              }}
                              className="policy-transaction-popup-input"
                            />
                          </td>
                          <td>
                            <button className="policy-transaction-popup-action-btn">
                              <Plus className="policy-transaction-popup-action-icon" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save/Update Button */}
      <div className="policy-transaction-save-section">
        <button 
          className="policy-transaction-save-btn"
          onClick={handleSaveTransaction}
          disabled={!selectedClient || !policyData.insurerCompany || !policyData.policy}
        >
          Save Transaction
        </button>
      </div>
    </div>
  );
};

export default PolicyTransaction;
