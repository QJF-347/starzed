import React, { useState, useEffect } from 'react';
import { Search, Trash2, X } from 'lucide-react';
import apiService from '../../services/api';
import './PolicyRenewal.css';

const PolicyRenewal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientPopup, setShowClientPopup] = useState(false);
  const [category, setCategory] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);

  // Renewal States
  const [renewalData, setRenewalData] = useState({
    insurerCompany: '',
    policy: '',
    product: '',
    previousPolicyNumber: '',
    dateFrom: new Date().toISOString().split('T')[0], // Today
    dateTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // One year from today
    previousPremium: '',
    newPremium: '',
    renewalRate: '',
    remark: ''
  });

  // Motor Renewal States
  const [motorRenewals, setMotorRenewals] = useState([]);
  const [motorData, setMotorData] = useState({
    regNo: '',
    make: '',
    model: '',
    motorUse: '',
    bodyType: '',
    motorValue: '',
    premium: ''
  });

  // Medical Renewal States
  const [medicalRenewals, setMedicalRenewals] = useState([]);
  const [medicalData, setMedicalData] = useState({
    memberNo: '',
    name: '',
    beneficiary: '',
    ageBand: '',
    coverLimits: '',
    premium: ''
  });

  // Non-Motor Renewal States
  const [nonMotorRenewals, setNonMotorRenewals] = useState([]);
  const [nonMotorData, setNonMotorData] = useState({
    cover: '',
    mode: '',
    modeValue: '',
    premium: ''
  });

  // Levy States
  const [levies, setLevies] = useState({
    totalLevies: 0,
    basicPremium: 0,
    totalPremium: 0
  });

  // Extra premiums and levies
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

  const [showExtraPremiumsPopup, setShowExtraPremiumsPopup] = useState(false);

  // Data states
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [clientPolicies, setClientPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const motorUses = ['Private', 'Commercial', 'Public Service', 'Agricultural'];
  const bodyTypes = ['Saloon', 'SUV', 'Pickup', 'Van', 'Truck', 'Motorcycle', 'Bus'];
  const beneficiaries = ['Self', 'Spouse', 'Children', 'Parents', 'Group'];
  const ageBands = ['0-18', '19-35', '36-50', '51-65', '65+'];
  const nonMotorCovers = ['Fire', 'Burglary', 'Theft', 'Accident', 'Marine'];
  const modes = ['Annual', 'Semi-Annual', 'Quarterly', 'Monthly'];

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [clientsData, productsData, companiesData] = await Promise.all([
          apiService.getClients(),
          apiService.getProducts(),
          apiService.getCompanies()
        ]);

        const clientsList = clientsData.success ? clientsData.data : (Array.isArray(clientsData) ? clientsData : []);
        const productsList = productsData.success ? productsData.data : (Array.isArray(productsData) ? productsData : []);
        const companiesList = companiesData.success ? companiesData.data : (Array.isArray(companiesData) ? companiesData : []);

        setClients(clientsList);
        setProducts(productsList);
        setCompanies(companiesList);
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
          const result = await apiService.getClientPolicies();
          const policiesList = result.success ? result.data : (Array.isArray(result) ? result : []);
          // Filter policies by selected client if the API supports it
          setClientPolicies(policiesList);
        } catch (error) {
          console.error('Error loading client policies:', error);
        }
      };
      loadClientPolicies();
    }
  }, [selectedClient]);

  // Filter dropdowns based on selections
  const filteredCompanies = category
    ? companies.filter(company => {
        const cat = category.toLowerCase();
        return company.name.toLowerCase().includes(cat) || cat === 'motor' || cat === 'non-motor' || cat === 'accidental and medical';
      })
    : companies;

  // Filter products by the selected insurer company name
  const filteredProducts = renewalData.insurerCompany
    ? products.filter(product => {
        const companyName = companies.find(c => c.id === renewalData.insurerCompany)?.name || '';
        return !companyName || product.name?.toLowerCase().includes(companyName.split(' ')[0].toLowerCase());
      })
    : [];

  const filteredClients = clients.filter(client =>
    (client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.idNumber && client.idNumber.includes(searchTerm)) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  // Calculate total premium when renewal data, extra premiums, or levies change
  useEffect(() => {
    if (renewalData.previousPremium) {
      const basicPremium = parseFloat(renewalData.previousPremium);

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

      // Auto-fill new premium with calculated total
      setRenewalData(prev => ({
        ...prev,
        newPremium: totalPremium.toString(),
        renewalRate: ((totalPremium - basicPremium) / basicPremium * 100).toFixed(2)
      }));
    }
  }, [renewalData.previousPremium, extraPremiums, extraLevies]);

  // Recalculate when extra premiums or levies are updated
  useEffect(() => {
    if (renewalData.previousPremium) {
      const basicPremium = parseFloat(renewalData.previousPremium);

      const totalExtraPremiums = extraPremiums.reduce((sum, premium) => {
        if (premium.rate.includes('%')) {
          const rate = parseFloat(premium.rate.replace('%', ''));
          return sum + (basicPremium * rate / 100);
        }
        return sum + premium.amount;
      }, 0);

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

      setRenewalData(prev => ({
        ...prev,
        newPremium: totalPremium.toString(),
        renewalRate: ((totalPremium - basicPremium) / basicPremium * 100).toFixed(2)
      }));
    }
  }, [extraPremiums, extraLevies]);

  // Handle client selection
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setShowClientPopup(false);
    setSelectedTransaction(null);
  };

  // Handle transaction selection
  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionPopup(false);

    const company = companies.find(c => c.name === transaction.insurer || c.name === transaction.insurerCompany);

    setRenewalData({
      insurerCompany: company?.id || '',
      policy: transaction.policy_number || transaction.policy || '',
      product: transaction.product || '',
      previousPolicyNumber: transaction.policyNumber || transaction.policy_number || '',
      dateFrom: new Date().toISOString().split('T')[0],
      dateTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      previousPremium: transaction.premium || '',
      newPremium: '',
      renewalRate: '',
      remark: ''
    });

    setCategory(transaction.category || '');

    if (transaction.category === 'Motor') {
      setMotorData({
        regNo: transaction.regNo || '',
        make: transaction.make || '',
        model: '',
        motorUse: '',
        bodyType: transaction.bodyType || '',
        motorValue: transaction.motorValue || '',
        premium: ''
      });
    } else if (transaction.category === 'Accidental and Medical') {
      setMedicalData({
        memberNo: transaction.memberNo || '',
        name: transaction.clientName || '',
        beneficiary: transaction.beneficiary || '',
        ageBand: transaction.ageBand || '',
        coverLimits: transaction.coverLimits || '',
        premium: ''
      });
    } else if (transaction.category === 'Non-Motor') {
      setNonMotorData({
        cover: transaction.cover || '',
        mode: transaction.mode || '',
        modeValue: transaction.modeValue || '',
        premium: ''
      });
    }

    if (!selectedClient) {
      const client = clients.find(c => c.id === transaction.clientId);
      if (client) {
        setSelectedClient(client);
      }
    }
  };

  const handleRemoveCustomer = () => {
    setSelectedClient(null);
    setShowClientPopup(false);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);

    setMotorData({ regNo: '', make: '', model: '', motorUse: '', bodyType: '', motorValue: '', premium: '' });
    setMedicalData({ memberNo: '', name: '', beneficiary: '', ageBand: '', coverLimits: '', premium: '' });
    setNonMotorData({ cover: '', mode: '', modeValue: '', premium: '' });
  };

  // Handle save renewal - persist to backend
  const handleSaveRenewal = async () => {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }
    if (!renewalData.insurerCompany) {
      alert('Please select an insurer company');
      return;
    }
    if (!renewalData.previousPolicyNumber) {
      alert('Please enter previous policy number');
      return;
    }

    const company = companies.find(c => c.id === renewalData.insurerCompany);

    const renewalPayload = {
      category: category ? category.toLowerCase().replace(/\s+/g, '_') : '',
      policy_number: renewalData.previousPolicyNumber,
      client_name: selectedClient.name || selectedClient.clientName || '',
      product: renewalData.product || renewalData.policy || '',
      insurer: company?.name || '',
      start_date: renewalData.dateFrom || null,
      expiry_date: renewalData.dateTo || null,
      premium: parseFloat(renewalData.newPremium || renewalData.previousPremium || 0),
      status: 'Active',
      notes: renewalData.remark || ''
    };

    try {
      const result = await apiService.createRenewal(renewalPayload);
      if (result.success) {
        alert(selectedTransaction ? 'Renewal updated successfully!' : 'Renewal saved successfully!');

        if (!selectedTransaction) {
          setSelectedClient(null);
          setSelectedTransaction(null);
          setCategory('');
          setRenewalData({
            insurerCompany: '',
            policy: '',
            product: '',
            previousPolicyNumber: '',
            dateFrom: new Date().toISOString().split('T')[0],
            dateTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            previousPremium: '',
            newPremium: '',
            renewalRate: '',
            remark: ''
          });
          setMotorRenewals([]);
          setMedicalRenewals([]);
          setNonMotorRenewals([]);
          setMotorData({ regNo: '', make: '', model: '', motorUse: '', bodyType: '', motorValue: '', premium: '' });
          setMedicalData({ memberNo: '', name: '', beneficiary: '', ageBand: '', coverLimits: '', premium: '' });
          setNonMotorData({ cover: '', mode: '', modeValue: '', premium: '' });
          setLevies({ totalLevies: 0, basicPremium: 0, totalPremium: 0 });
        }
      } else {
        alert('Failed to save renewal: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving renewal:', error);
      alert('Error saving renewal. Please try again.');
    }
  };

  // Calculate total premium when renewal value or rate changes
  useEffect(() => {
    if (renewalData.newPremium && renewalData.renewalRate) {
      const basicPremium = parseFloat(renewalData.newPremium) * (parseFloat(renewalData.renewalRate) / 100);
      const totalPremium = basicPremium + levies.totalLevies;
      setLevies(prev => ({
        ...prev,
        basicPremium: basicPremium,
        totalPremium: totalPremium
      }));
    }
  }, [renewalData.newPremium, renewalData.renewalRate, levies.totalLevies]);

  const handleMotorRenewalInsert = () => {
    if (!motorData.regNo || !motorData.make || !motorData.model || !motorData.premium) {
      alert('Please fill all required motor renewal fields');
      return;
    }

    const newRenewal = {
      id: Date.now(),
      regNo: motorData.regNo,
      make: motorData.make,
      model: motorData.model,
      motorUse: motorData.motorUse,
      bodyType: motorData.bodyType,
      motorValue: motorData.motorValue,
      premium: motorData.premium
    };

    setMotorRenewals([...motorRenewals, newRenewal]);
    setMotorData({
      regNo: '',
      make: '',
      model: '',
      motorUse: '',
      bodyType: '',
      motorValue: '',
      premium: ''
    });
  };

  const handleMedicalRenewalInsert = () => {
    if (!medicalData.memberNo || !medicalData.name || !medicalData.premium) {
      alert('Please fill all required medical renewal fields');
      return;
    }

    const newRenewal = {
      id: Date.now(),
      memberNo: medicalData.memberNo,
      name: medicalData.name,
      beneficiary: medicalData.beneficiary,
      ageBand: medicalData.ageBand,
      coverLimits: medicalData.coverLimits,
      premium: medicalData.premium
    };

    setMedicalRenewals([...medicalRenewals, newRenewal]);
    setMedicalData({
      memberNo: '',
      name: '',
      beneficiary: '',
      ageBand: '',
      coverLimits: '',
      premium: ''
    });
  };

  const handleNonMotorRenewalInsert = () => {
    if (!nonMotorData.cover || !nonMotorData.premium) {
      alert('Please fill all required non-motor renewal fields');
      return;
    }

    const newRenewal = {
      id: Date.now(),
      cover: nonMotorData.cover,
      mode: nonMotorData.mode,
      modeValue: nonMotorData.modeValue,
      premium: nonMotorData.premium
    };

    setNonMotorRenewals([...nonMotorRenewals, newRenewal]);
    setNonMotorData({
      cover: '',
      mode: '',
      modeValue: '',
      premium: ''
    });
  };

  const handleDeleteMotorRenewal = (id) => {
    setMotorRenewals(prev => prev.filter(r => r.id !== id));
  };

  const handleDeleteMedicalRenewal = (id) => {
    setMedicalRenewals(prev => prev.filter(r => r.id !== id));
  };

  const handleDeleteNonMotorRenewal = (id) => {
    setNonMotorRenewals(prev => prev.filter(r => r.id !== id));
  };

  const handleKeyPress = (e, category) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      switch(category) {
        case 'Motor':
          handleMotorRenewalInsert();
          break;
        case 'Accidental and Medical':
          handleMedicalRenewalInsert();
          break;
        case 'Non-Motor':
          handleNonMotorRenewalInsert();
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="policy-renewal-container">
      {/* Header */}
      <div className="policy-renewal-header">
        <div className="policy-renewal-header-content">
          <div className="policy-renewal-header-left">
            <h1 className="policy-renewal-title">Policy Renewal</h1>
            <p className="policy-renewal-subtitle">Renew existing policies and calculate new premiums</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="policy-renewal-main-content">
        <div className="policy-renewal-content-grid">
          {/* Left Panel */}
          <div className="policy-renewal-left-panel">
            <div className="policy-renewal-panel-section">
              <h3 className="policy-renewal-panel-title">Renewal Details</h3>

              <div className="policy-renewal-form-group">
                <label className="policy-renewal-form-label">Category *</label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="policy-renewal-form-select"
                >
                  <option value="">Select Category</option>
                  <option value="Motor">Motor</option>
                  <option value="Accidental and Medical">Accidental and Medical</option>
                  <option value="Non-Motor">Non-Motor</option>
                </select>
              </div>

              <div className="policy-renewal-form-group">
                <label className="policy-renewal-form-label">Insurer Company *</label>
                <select
                  value={renewalData.insurerCompany}
                  onChange={(e) => setRenewalData({...renewalData, insurerCompany: e.target.value})}
                  className="policy-renewal-form-select"
                  disabled={!category}
                >
                  <option value="">Select Company</option>
                  {filteredCompanies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>

              <div className="policy-renewal-form-group">
                <label className="policy-renewal-form-label">Policy / Product</label>
                <select
                  value={renewalData.policy}
                  onChange={(e) => setRenewalData({...renewalData, policy: e.target.value})}
                  className="policy-renewal-form-select"
                >
                  <option value="">Select Policy</option>
                  {filteredProducts.map(product => (
                    <option key={product.id} value={product.name}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div className="policy-renewal-form-group">
                <label className="policy-renewal-form-label">Previous Policy Number *</label>
                <input
                  type="text"
                  placeholder="Enter previous policy number"
                  value={renewalData.previousPolicyNumber}
                  onChange={(e) => setRenewalData({...renewalData, previousPolicyNumber: e.target.value})}
                  className="policy-renewal-form-input"
                />
              </div>

              <div className="policy-renewal-form-row">
                <div className="policy-renewal-form-group">
                  <label className="policy-renewal-form-label">Date From *</label>
                  <input
                    type="date"
                    value={renewalData.dateFrom}
                    onChange={(e) => setRenewalData({...renewalData, dateFrom: e.target.value})}
                    className="policy-renewal-form-input"
                  />
                </div>

                <div className="policy-renewal-form-group">
                  <label className="policy-renewal-form-label">Date To *</label>
                  <input
                    type="date"
                    value={renewalData.dateTo}
                    onChange={(e) => setRenewalData({...renewalData, dateTo: e.target.value})}
                    className="policy-renewal-form-input"
                  />
                </div>
              </div>

              <div className="policy-renewal-form-group">
                <label className="policy-renewal-form-label">Remark</label>
                <textarea
                  placeholder="Enter renewal remarks"
                  value={renewalData.remark}
                  onChange={(e) => setRenewalData({...renewalData, remark: e.target.value})}
                  className="policy-renewal-form-textarea"
                  rows="3"
                />
              </div>

              {/* Levies and Premiums Section */}
              <div className="policy-renewal-levies-section">
                <h3
                  className="policy-renewal-levies-title clickable"
                  onClick={() => setShowExtraPremiumsPopup(true)}
                >
                  Levies and Extra Premiums
                </h3>
                <div className="policy-renewal-levies-grid">
                  <div className="policy-renewal-levy-item">
                    <label className="policy-renewal-levy-label">TOTAL LEVIES / TAXES</label>
                    <input
                      type="number"
                      value={levies.totalLevies}
                      readOnly
                      className="policy-renewal-levy-input readonly"
                    />
                  </div>
                  <div className="policy-renewal-levy-item">
                    <label className="policy-renewal-levy-label">BASIC PREMIUM</label>
                    <input
                      type="number"
                      value={levies.basicPremium}
                      readOnly
                      className="policy-renewal-levy-input readonly"
                    />
                  </div>
                  <div className="policy-renewal-levy-item">
                    <label className="policy-renewal-levy-label">TOTAL PREMIUM</label>
                    <input
                      type="number"
                      value={levies.totalPremium}
                      readOnly
                      className="policy-renewal-levy-input readonly"
                    />
                  </div>
                </div>
              </div>

              {category && (
                <div className="policy-renewal-insert-section">
                  <button
                    className="policy-renewal-insert-btn"
                    onClick={() => {
                      switch(category) {
                        case 'Motor': handleMotorRenewalInsert(); break;
                        case 'Accidental and Medical': handleMedicalRenewalInsert(); break;
                        case 'Non-Motor': handleNonMotorRenewalInsert(); break;
                        default: break;
                      }
                    }}
                  >
                    Insert {category} Renewal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="policy-renewal-right-panel">
            {/* Client Search */}
            <div className="policy-renewal-search-group">
              <label className="policy-renewal-search-label">Select Client</label>
              <div className="policy-renewal-search-wrapper">
                <Search className="policy-renewal-search-icon" />
                <input
                  type="text"
                  placeholder={selectedClient ? selectedClient.name : "Search client by name, ID or phone..."}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!showClientPopup) setShowClientPopup(true);
                  }}
                  onFocus={() => setShowClientPopup(true)}
                  className="policy-renewal-search-input"
                />
              </div>
              {showClientPopup && (
                <div className="policy-renewal-client-popup">
                  {filteredClients.length === 0 ? (
                    <div className="policy-renewal-client-option">
                      No clients found
                    </div>
                  ) : (
                    filteredClients.map(client => (
                      <div
                        key={client.id}
                        className="policy-renewal-client-option"
                        onClick={() => {
                          handleClientSelect(client);
                          setSearchTerm('');
                        }}
                      >
                        <div className="policy-renewal-client-option-name">
                          {client.name}
                        </div>
                        <div className="policy-renewal-client-option-details">
                          {client.idNumber && `ID: ${client.idNumber}`}
                          {client.phone && ` | ${client.phone}`}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Search Previous Transaction */}
            <div className="policy-renewal-search-group">
              <label className="policy-renewal-search-label">Search Previous Transaction</label>
              <div className="policy-renewal-search-wrapper">
                <Search className="policy-renewal-search-icon" />
                <input
                  type="text"
                  placeholder="Search by policy number or client name..."
                  onFocus={() => setShowTransactionPopup(true)}
                  className="policy-renewal-search-input"
                />
                {showTransactionPopup && (
                  <div className="policy-renewal-client-popup">
                    {clientPolicies.length === 0 ? (
                      <div className="policy-renewal-client-option">
                        No previous policies found
                      </div>
                    ) : (
                      clientPolicies.map(policy => (
                        <div
                          key={policy.id}
                          className="policy-renewal-client-option"
                          onClick={() => handleTransactionSelect(policy)}
                        >
                          <div className="policy-renewal-client-option-name">
                            {policy.policyNumber || policy.policy_number} - {policy.clientName || policy.client_name}
                          </div>
                          <div className="policy-renewal-client-option-details">
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
              <div className="policy-renewal-customer-selected">
                <div className="policy-renewal-customer-header">
                  <h3 className="policy-renewal-customer-title">Customer Selected</h3>
                  <button
                    className="policy-renewal-remove-customer-btn"
                    onClick={handleRemoveCustomer}
                    title="Remove customer"
                  >
                    <X className="policy-renewal-remove-icon" />
                  </button>
                </div>
                <div className="policy-renewal-customer-info">
                  <div className="policy-renewal-customer-row">
                    <div className="policy-renewal-customer-item">
                      <span className="policy-renewal-customer-label">Name:</span>
                      <span className="policy-renewal-customer-value">{selectedClient.name}</span>
                    </div>
                    <div className="policy-renewal-customer-item">
                      <span className="policy-renewal-customer-label">ID:</span>
                      <span className="policy-renewal-customer-value">{selectedClient.idNumber}</span>
                    </div>
                    <div className="policy-renewal-customer-item">
                      <span className="policy-renewal-customer-label">Mobile:</span>
                      <span className="policy-renewal-customer-value">{selectedClient.mobile || selectedClient.phone}</span>
                    </div>
                    <div className="policy-renewal-customer-item">
                      <span className="policy-renewal-customer-label">Email:</span>
                      <span className="policy-renewal-customer-value">{selectedClient.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category-specific forms */}
            {category === 'Motor' && (
              <div className="policy-renewal-category-form">
                <h3 className="policy-renewal-form-title">Motor Insurance Renewal</h3>

                <div className="policy-renewal-form-row">
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Registration No *</label>
                    <input
                      type="text"
                      placeholder="Enter registration number"
                      value={motorData.regNo}
                      onChange={(e) => setMotorData({...motorData, regNo: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'Motor')}
                      className="policy-renewal-form-input"
                    />
                  </div>
                </div>

                <div className="policy-renewal-form-row">
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Body Type *</label>
                    <select
                      value={motorData.bodyType}
                      onChange={(e) => setMotorData({...motorData, bodyType: e.target.value})}
                      className="policy-renewal-form-select"
                    >
                      <option value="">Select body type</option>
                      {bodyTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Motor Value *</label>
                    <input
                      type="number"
                      placeholder="Enter motor value"
                      value={motorData.motorValue}
                      onChange={(e) => setMotorData({...motorData, motorValue: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'Motor')}
                      className="policy-renewal-form-input"
                    />
                  </div>
                </div>

                <div className="policy-renewal-form-row">
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Premium *</label>
                    <input
                      type="number"
                      placeholder="Enter premium"
                      value={motorData.premium}
                      onChange={(e) => setMotorData({...motorData, premium: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'Motor')}
                      className="policy-renewal-form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {category === 'Accidental and Medical' && (
              <div className="policy-renewal-category-form">
                <h3 className="policy-renewal-form-title">Medical Insurance Renewal</h3>

                <div className="policy-renewal-form-row">
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Member No. *</label>
                    <input
                      type="text"
                      placeholder="Enter member number"
                      value={medicalData.memberNo}
                      onChange={(e) => setMedicalData({...medicalData, memberNo: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'Accidental and Medical')}
                      className="policy-renewal-form-input"
                    />
                  </div>
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Name *</label>
                    <input
                      type="text"
                      placeholder="Enter member name"
                      value={medicalData.name}
                      onChange={(e) => setMedicalData({...medicalData, name: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'Accidental and Medical')}
                      className="policy-renewal-form-input"
                    />
                  </div>
                </div>

                <div className="policy-renewal-form-row">
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Beneficiary</label>
                    <select
                      value={medicalData.beneficiary}
                      onChange={(e) => setMedicalData({...medicalData, beneficiary: e.target.value})}
                      className="policy-renewal-form-select"
                    >
                      <option value="">Select Beneficiary</option>
                      {beneficiaries.map(beneficiary => (
                        <option key={beneficiary} value={beneficiary}>{beneficiary}</option>
                      ))}
                    </select>
                  </div>
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Age Band</label>
                    <select
                      value={medicalData.ageBand}
                      onChange={(e) => setMedicalData({...medicalData, ageBand: e.target.value})}
                      className="policy-renewal-form-select"
                    >
                      <option value="">Select Age Band</option>
                      {ageBands.map(band => (
                        <option key={band} value={band}>{band}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="policy-renewal-form-row">
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Cover Limits</label>
                    <input
                      type="text"
                      placeholder="Enter cover limits"
                      value={medicalData.coverLimits}
                      onChange={(e) => setMedicalData({...medicalData, coverLimits: e.target.value})}
                      className="policy-renewal-form-input"
                    />
                  </div>
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Premium *</label>
                    <input
                      type="number"
                      placeholder="Enter premium"
                      value={medicalData.premium}
                      onChange={(e) => setMedicalData({...medicalData, premium: e.target.value})}
                      className="policy-renewal-form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {category === 'Non-Motor' && (
              <div className="policy-renewal-category-form">
                <h3 className="policy-renewal-form-title">Non-Motor Insurance Renewal</h3>

                <div className="policy-renewal-form-row">
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Non-Motor Cover *</label>
                    <select
                      value={nonMotorData.cover}
                      onChange={(e) => setNonMotorData({...nonMotorData, cover: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'Non-Motor')}
                      className="policy-renewal-form-select"
                    >
                      <option value="">Select Cover</option>
                      {nonMotorCovers.map(cover => (
                        <option key={cover} value={cover}>{cover}</option>
                      ))}
                    </select>
                  </div>
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Mode</label>
                    <select
                      value={nonMotorData.mode}
                      onChange={(e) => setNonMotorData({...nonMotorData, mode: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'Non-Motor')}
                      className="policy-renewal-form-select"
                    >
                      <option value="">Select Mode</option>
                      {modes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {nonMotorData.mode && (
                  <div className="policy-renewal-form-row">
                    <div className="policy-renewal-form-group">
                      <label className="policy-renewal-form-label">Mode Value</label>
                      <input
                        type="text"
                        placeholder="Enter mode value"
                        value={nonMotorData.modeValue}
                        onChange={(e) => setNonMotorData({...nonMotorData, modeValue: e.target.value})}
                        onKeyPress={(e) => handleKeyPress(e, 'Non-Motor')}
                        className="policy-renewal-form-input"
                      />
                    </div>
                  </div>
                )}

                <div className="policy-renewal-form-row">
                  <div className="policy-renewal-form-group">
                    <label className="policy-renewal-form-label">Premium *</label>
                    <input
                      type="number"
                      placeholder="Enter premium"
                      value={nonMotorData.premium}
                      onChange={(e) => setNonMotorData({...nonMotorData, premium: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, 'Non-Motor')}
                      className="policy-renewal-form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Renewal Tables */}
            {category === 'Motor' && (
              <div className="policy-renewal-table-container">
                <h4 className="policy-renewal-table-title">Motor Renewals</h4>
                <table className="policy-renewal-small-table">
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
                    {motorRenewals.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="policy-renewal-empty-table">
                          No motor renewals added yet. Fill the form above and press Enter or click Insert.
                        </td>
                      </tr>
                    ) : (
                      motorRenewals.map(renewal => (
                        <tr key={renewal.id}>
                          <td>{renewal.regNo}</td>
                          <td>{renewal.make}</td>
                          <td>{renewal.bodyType}</td>
                          <td>{renewal.motorValue}</td>
                          <td>{renewal.premium}</td>
                          <td>
                            <button
                              className="policy-renewal-action-btn"
                              onClick={() => handleDeleteMotorRenewal(renewal.id)}
                            >
                              <Trash2 className="policy-renewal-action-icon" />
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
              <div className="policy-renewal-table-container">
                <h4 className="policy-renewal-table-title">Medical Renewals</h4>
                <table className="policy-renewal-small-table">
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
                    {medicalRenewals.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="policy-renewal-empty-table">
                          No medical renewals added yet. Fill the form above and press Enter or click Insert.
                        </td>
                      </tr>
                    ) : (
                      medicalRenewals.map(renewal => (
                        <tr key={renewal.id}>
                          <td>{renewal.memberNo}</td>
                          <td>{renewal.name}</td>
                          <td>{renewal.beneficiary}</td>
                          <td>{renewal.ageBand}</td>
                          <td>{renewal.coverLimits}</td>
                          <td>{renewal.premium}</td>
                          <td>
                            <button
                              className="policy-renewal-action-btn"
                              onClick={() => handleDeleteMedicalRenewal(renewal.id)}
                            >
                              <Trash2 className="policy-renewal-action-icon" />
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
              <div className="policy-renewal-table-container">
                <h4 className="policy-renewal-table-title">Non-Motor Renewals</h4>
                <table className="policy-renewal-small-table">
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
                    {nonMotorRenewals.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="policy-renewal-empty-table">
                          No non-motor renewals added yet. Fill the form above and press Enter or click Insert.
                        </td>
                      </tr>
                    ) : (
                      nonMotorRenewals.map(renewal => (
                        <tr key={renewal.id}>
                          <td>{renewal.cover}</td>
                          <td>{renewal.mode}</td>
                          <td>{renewal.modeValue}</td>
                          <td>{renewal.premium}</td>
                          <td>
                            <button
                              className="policy-renewal-action-btn"
                              onClick={() => handleDeleteNonMotorRenewal(renewal.id)}
                            >
                              <Trash2 className="policy-renewal-action-icon" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Renewal Value and Rate Section */}
            <div className="policy-renewal-renewal-value-section">
              <h3 className="policy-renewal-renewal-value-title">Renewal Details</h3>
              <div className="policy-renewal-renewal-value-grid">
                <div className="policy-renewal-renewal-value-item">
                  <label className="policy-renewal-renewal-value-label">Previous Premium *</label>
                  <input
                    type="number"
                    placeholder="Enter previous premium"
                    value={renewalData.previousPremium}
                    onChange={(e) => setRenewalData({...renewalData, previousPremium: e.target.value})}
                    className="policy-renewal-renewal-value-input"
                  />
                </div>
                <div className="policy-renewal-renewal-value-item">
                  <label className="policy-renewal-renewal-value-label">New Premium *</label>
                  <input
                    type="number"
                    placeholder="Enter new premium"
                    value={renewalData.newPremium}
                    onChange={(e) => setRenewalData({...renewalData, newPremium: e.target.value})}
                    className="policy-renewal-renewal-value-input"
                  />
                </div>
                <div className="policy-renewal-renewal-value-item">
                  <label className="policy-renewal-renewal-value-label">Renewal Rate (%) *</label>
                  <input
                    type="number"
                    placeholder="Enter renewal rate"
                    value={renewalData.renewalRate}
                    onChange={(e) => setRenewalData({...renewalData, renewalRate: e.target.value})}
                    className="policy-renewal-renewal-value-input"
                  />
                </div>
              </div>
            </div>

            {/* Save/Update Button */}
            <div className="policy-renewal-save-section">
              <button
                className="policy-renewal-save-btn"
                onClick={handleSaveRenewal}
                disabled={!selectedClient || !renewalData.insurerCompany || !renewalData.previousPolicyNumber}
              >
                {selectedTransaction ? 'Update Renewal' : 'Save Renewal'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Premiums and Levies Popup */}
      {showExtraPremiumsPopup && (
        <div className="policy-renewal-modal-overlay">
          <div className="policy-renewal-levies-modal">
            <div className="policy-renewal-levies-modal-header">
              <h2 className="policy-renewal-levies-modal-title">Extra Premiums and Levies</h2>
              <button
                className="policy-renewal-levies-modal-close"
                onClick={() => setShowExtraPremiumsPopup(false)}
              >
                <X className="policy-renewal-levies-modal-close-icon" />
              </button>
            </div>
            <div className="policy-renewal-levies-modal-content">
              <div className="policy-renewal-levies-modal-section">
                <h3 className="policy-renewal-levies-modal-section-title">Extra Premiums</h3>
                <div className="policy-renewal-levies-modal-list">
                  {extraPremiums.map(premium => (
                    <div key={premium.id} className="policy-renewal-levies-modal-item">
                      <div className="policy-renewal-levies-modal-item-info">
                        <div className="policy-renewal-levies-modal-item-description">{premium.description}</div>
                        <div className="policy-renewal-levies-modal-item-rate">{premium.rate}</div>
                      </div>
                      <input
                        type="number"
                        value={premium.amount}
                        onChange={(e) => {
                          const updatedPremiums = extraPremiums.map(p =>
                            p.id === premium.id ? {...p, amount: parseFloat(e.target.value) || 0} : p
                          );
                          setExtraPremiums(updatedPremiums);
                        }}
                        className="policy-renewal-levies-modal-item-input"
                        placeholder="Amount"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="policy-renewal-levies-modal-section">
                <h3 className="policy-renewal-levies-modal-section-title">Extra Levies/Taxes</h3>
                <div className="policy-renewal-levies-modal-list">
                  {extraLevies.map(levy => (
                    <div key={levy.id} className="policy-renewal-levies-modal-item">
                      <div className="policy-renewal-levies-modal-item-info">
                        <div className="policy-renewal-levies-modal-item-description">{levy.description}</div>
                        <div className="policy-renewal-levies-modal-item-rate">{levy.rate}</div>
                      </div>
                      <input
                        type="number"
                        value={levy.amount}
                        onChange={(e) => {
                          const updatedLevies = extraLevies.map(l =>
                            l.id === levy.id ? {...l, amount: parseFloat(e.target.value) || 0} : l
                          );
                          setExtraLevies(updatedLevies);
                        }}
                        className="policy-renewal-levies-modal-item-input"
                        placeholder="Amount"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyRenewal;