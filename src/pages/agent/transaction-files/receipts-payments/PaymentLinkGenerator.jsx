import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, Copy, CheckCircle, AlertCircle, Car, Heart, User, Phone, Mail, Calendar, DollarSign, Shield, Send, Search, Building, FileText, ChevronRight, Clock, Users } from 'lucide-react';
import './PaymentLinkGenerator.css';

const normalizeCategory = (cat) => {
  if (!cat) return '';
  const c = cat.toLowerCase();
  if (c.includes('motor') || c.includes('vehicle') || c.includes('car')) return 'motor';
  if (c.includes('medical') || c.includes('health') || c.includes('accidental')) return 'medical';
  if (c.includes('building') || c.includes('property') || c.includes('non-motor')) return 'buildings';
  return c;
};

const PaymentLinkGenerator = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    idNumber: '',
    phoneNumber: ''
  });
  const [policyDetails, setPolicyDetails] = useState({
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    registrationNumber: '',
    vehicleValue: '',
    vehicleColor: '',
    vehicleChassis: '',
    coverType: '',
    coverLimit: '',
    beneficiaryName: '',
    personName: '',
    personAge: '',
    personSex: '',
    preExistingConditions: '',
    buildingType: '',
    buildingLocation: '',
    buildingValue: '',
    buildingYear: '',
    buildingFloors: '',
    buildingConstruction: '',
    buildingOccupancy: ''
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [expiryHours, setExpiryHours] = useState(24);
  const [showSuccess, setShowSuccess] = useState(false);

  // Data states
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter clients client-side when search term changes
  useEffect(() => {
    if (searchTerm.length > 0) {
      const term = searchTerm.toLowerCase();
      const filtered = allClients.filter(c =>
        (c.client_name && c.client_name.toLowerCase().includes(term)) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.mobile && c.mobile.toLowerCase().includes(term)) ||
        (c.id_number && c.id_number.toLowerCase().includes(term))
      );
      setClients(filtered);
    } else {
      setClients(allClients);
    }
  }, [searchTerm, allClients]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_URL || '/api';

      const [clientsRes, policiesRes, companiesRes, productsRes] = await Promise.all([
        fetch(`${API_BASE}/clients/`),
        fetch(`${API_BASE}/clients/policies/`),
        fetch(`${API_BASE}/companies/`),
        fetch(`${API_BASE}/products/`)
      ]);

      const clientsData = await clientsRes.json();
      const policiesData = await policiesRes.json();
      const companiesData = await companiesRes.json();
      const productsData = await productsRes.json();

      if (clientsData.success) {
        setAllClients(clientsData.data || []);
        setClients(clientsData.data || []);
      }
      if (policiesData.success) {
        setAllPolicies(policiesData.data || []);
      }
      if (companiesData.success) {
        setCompanies(companiesData.data || []);
      }
      if (productsData.success) {
        setProducts(productsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setCustomerDetails({
      name: client.client_name || '',
      email: client.email || '',
      idNumber: client.id_number || '',
      phoneNumber: client.mobile || ''
    });
    setSearchTerm(client.client_name);
    // Reset dependent selections
    setSelectedPolicy(null);
    setSelectedCompany(null);
    setSelectedProduct(null);
  };

  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    setSelectedCompany(null);
    setSelectedProduct(null);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setSelectedProduct(null);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setPolicyDetails({
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      registrationNumber: '',
      coverType: '',
      coverLimit: '',
      beneficiaryName: ''
    });
  };

  const generatePaymentLink = async () => {
    if (!selectedClient || !selectedPolicy || !selectedCompany || !selectedProduct) {
      toast.error('Please select client, policy, company, and product');
      return;
    }
    if (!customerDetails.name || !customerDetails.email || !customerDetails.idNumber) {
      toast.error('Please fill in all required customer details');
      return;
    }

    setIsGenerating(true);
    try {
      const linkData = {
        client: selectedClient,
        policy: selectedPolicy,
        company: selectedCompany,
        product: selectedProduct,
        customerDetails,
        policyDetails,
        expiryHours
      };

      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_BASE}/payments/generate-link/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData)
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedLink(data.paymentLink);
        setShowSuccess(true);
        toast.success('Payment link generated successfully!');
      } else {
        throw new Error(data.message || 'Failed to generate payment link');
      }
    } catch (error) {
      console.error('Link generation error:', error);
      toast.error(error.message || 'Failed to generate payment link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      toast.success('Payment link copied to clipboard!');
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (_) {
      toast.error('Failed to copy link');
    }
  };

  const sendEmailWithLink = async () => {
    try {
      const emailData = {
        to: customerDetails.email,
        customerName: customerDetails.name,
        productName: selectedProduct.title,
        productPrice: selectedProduct.premium,
        paymentLink: generatedLink,
        expiryHours
      };

      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_BASE}/payments/send-link-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });

      const data = await response.json();
      if (data.success) {
        setEmailSent(true);
        toast.success('Payment link sent to customer email!');
        setTimeout(() => setEmailSent(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to send email');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send email');
    }
  };

  const resetForm = () => {
    setSelectedClient(null);
    setSelectedPolicy(null);
    setSelectedCompany(null);
    setSelectedProduct(null);
    setCustomerDetails({ name: '', email: '', idNumber: '', phoneNumber: '' });
    setPolicyDetails({ vehicleMake: '', vehicleModel: '', vehicleYear: '', registrationNumber: '', vehicleValue: '', vehicleColor: '', vehicleChassis: '', coverType: '', coverLimit: '', beneficiaryName: '', personName: '', personAge: '', personSex: '', preExistingConditions: '', buildingType: '', buildingLocation: '', buildingValue: '', buildingYear: '', buildingFloors: '', buildingConstruction: '', buildingOccupancy: '' });
    setGeneratedLink('');
    setLinkCopied(false);
    setEmailSent(false);
    setSearchTerm('');
    setShowSuccess(false);
    setClients(allClients);
  };

  const formatPrice = (price) => {
    const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : Number(price);
    if (isNaN(num)) return price || 'KES 0';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(num);
  };

  // Show all policies (not filtered by client)
  const clientPolicies = allPolicies;

  // Show all products (not filtered by company)
  const companyProducts = products;

  if (showSuccess) {
    return (
      <div className="payment-link-generator-container">
        <div className="payment-link-generator-header">
          <h1 className="payment-link-generator-title">
            <Link className="w-8 h-8 mr-3 text-green-600" />
            Payment Link Generated
          </h1>
        </div>
        <div className="step-card success-card">
          <div className="success-content">
            <div className="success-icon">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <div className="generated-link-card">
              <h3>Secure Payment Link</h3>
              <div className="link-display">
                <input type="text" value={generatedLink} readOnly className="link-input" />
                <button onClick={copyToClipboard} className="copy-btn">
                  {linkCopied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="link-info">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <div className="link-info-text">
                  <strong>Link Information:</strong>
                  <ul>
                    <li>• Expires in {expiryHours} hours</li>
                    <li>• Single use only</li>
                    <li>• Secure and encrypted</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={sendEmailWithLink} disabled={emailSent} className="email-btn">
                {emailSent ? <><CheckCircle className="w-4 h-4 mr-2" /> Email Sent</> : <><Mail className="w-4 h-4 mr-2" /> Send Link to Customer</>}
              </button>
              <button onClick={resetForm} className="new-link-btn">
                <Link className="w-4 h-4 mr-2" /> Create New Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-link-generator-container">
      <div className="payment-link-generator-header">
        <h1 className="payment-link-generator-title">
          <Link className="w-8 h-8 mr-3 text-blue-600" />
          Payment Link Generator
        </h1>
        <p className="payment-link-generator-subtitle">
          Select client, policy, company, and product then generate a secure payment link
        </p>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner-lg"></div>
          <p>Loading data...</p>
        </div>
      )}

      <div className="plg-layout">
        {/* LEFT COLUMN — Client Selection */}
        <div className="plg-left">
          <div className="step-card">
            <h2 className="step-title">
              <Users className="step-icon" />
              Select Client
            </h2>
            <div className="client-search-container">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search clients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="client-table-wrapper">
              <table className="client-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>ID No.</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length > 0 ? clients.map(client => (
                    <tr
                      key={client.id}
                      className={`client-row ${selectedClient?.id === client.id ? 'selected' : ''}`}
                      onClick={() => handleClientSelect(client)}
                    >
                      <td className="client-cell-name">{client.client_name}</td>
                      <td>{client.email || '-'}</td>
                      <td>{client.mobile || '-'}</td>
                      <td>{client.id_number || '-'}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="empty-table-msg">
                        {searchTerm ? 'No clients match your search' : 'Loading clients...'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedClient && (
              <div className="selected-client-card">
                <div className="selected-client-header">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Selected: {selectedClient.client_name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Customer Details — under client table */}
          {selectedClient && (
            <div className="step-card">
              <h2 className="step-title">
                <User className="step-icon" />
                Customer Details
              </h2>
              <div className="customer-details-grid">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input type="text" value={customerDetails.name} onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Email *</label>
                  <input type="email" value={customerDetails.email} onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>ID Number *</label>
                  <input type="text" value={customerDetails.idNumber} onChange={e => setCustomerDetails({...customerDetails, idNumber: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input type="tel" value={customerDetails.phoneNumber} onChange={e => setCustomerDetails({...customerDetails, phoneNumber: e.target.value})} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Policy → Company → Product */}
        <div className="plg-right">
          {/* POLICY */}
          <div className="step-card">
            <h2 className="step-title">
              <FileText className="step-icon" />
              1. Select Policy
            </h2>
            {clientPolicies.length === 0 ? (
              <p className="text-muted">No policies found</p>
            ) : (
              <div className="selection-list">
                {clientPolicies.map(policy => (
                  <div
                    key={policy.id}
                    className={`selection-item ${selectedPolicy?.id === policy.id ? 'selected' : ''}`}
                    onClick={() => handlePolicySelect(policy)}
                  >
                    <div className="selection-item-primary">
                      <span className="selection-item-title">{policy.policy_number}</span>
                      <span className="selection-item-badge">{policy.status}</span>
                    </div>
                    <div className="selection-item-secondary">
                      {policy.policy_type}{policy.cover_type ? ` • ${policy.cover_type}` : ''}
                    </div>
                    <div className="selection-item-price">{formatPrice(policy.premium_amount)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COMPANY */}
          <div className="step-card">
            <h2 className="step-title">
              <Building className="step-icon" />
              2. Select Company
            </h2>
            {selectedPolicy ? (
              <div className="selection-list">
                {companies.length > 0 ? companies.map(company => (
                  <div
                    key={company.id}
                    className={`selection-item ${selectedCompany?.id === company.id ? 'selected' : ''}`}
                    onClick={() => handleCompanySelect(company)}
                  >
                    <div className="selection-item-primary">
                      <span className="selection-item-title">{company.display_name || company.name}</span>
                      <span className="selection-item-badge">{company.licensed ? 'Licensed' : 'Unlicensed'}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-muted">No companies available</p>
                )}
              </div>
            ) : (
              <p className="text-muted">Select a policy first</p>
            )}
          </div>

          {/* PRODUCT */}
          <div className="step-card">
            <h2 className="step-title">
              <Shield className="step-icon" />
              3. Select Product
            </h2>
            {selectedCompany ? (
              <div className="selection-list">
                {companyProducts.length === 0 ? (
                  <p className="text-muted">No products available</p>
                ) : (
                  companyProducts.map(product => (
                    <div
                      key={product.id}
                      className={`selection-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="selection-item-primary">
                        <span className="selection-item-title">{product.title}</span>
                        <span className="selection-item-badge">{product.category}</span>
                      </div>
                      {product.short_description && (
                        <div className="selection-item-secondary">{product.short_description}</div>
                      )}
                      <div className="selection-item-price">{formatPrice(product.premium)}</div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-muted">Select a company first</p>
            )}
          </div>

          {/* GENERATE */}
          {selectedProduct && (
            <div className="step-card generate-card">
              <div className="generate-summary">
                <div className="generate-summary-row">
                  <span>Client:</span>
                  <strong>{selectedClient?.client_name}</strong>
                </div>
                <div className="generate-summary-row">
                  <span>Policy:</span>
                  <strong>{selectedPolicy?.policy_number}</strong>
                </div>
                <div className="generate-summary-row">
                  <span>Company:</span>
                  <strong>{selectedCompany?.display_name || selectedCompany?.name}</strong>
                </div>
                <div className="generate-summary-row">
                  <span>Product:</span>
                  <strong>{selectedProduct?.title}</strong>
                </div>
                <div className="generate-summary-divider"></div>
                <div className="generate-summary-row total">
                  <span>Amount:</span>
                  <strong>{formatPrice(selectedProduct?.premium || 0)}</strong>
                </div>
              </div>

              <div className="expiry-row">
                <label>Link expires in:</label>
                <select value={expiryHours} onChange={e => setExpiryHours(Number(e.target.value))}>
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                  <option value={72}>72 hours</option>
                </select>
              </div>

              {normalizeCategory(selectedProduct.category) === 'motor' && (
                <div className="policy-details-section">
                  <h3><Car size={16} /> Vehicle Details</h3>
                  <div className="customer-details-grid">
                    <div className="form-field">
                      <label>Make *</label>
                      <input type="text" value={policyDetails.vehicleMake} onChange={e => setPolicyDetails({...policyDetails, vehicleMake: e.target.value})} placeholder="e.g. Toyota" />
                    </div>
                    <div className="form-field">
                      <label>Model *</label>
                      <input type="text" value={policyDetails.vehicleModel} onChange={e => setPolicyDetails({...policyDetails, vehicleModel: e.target.value})} placeholder="e.g. Corolla" />
                    </div>
                    <div className="form-field">
                      <label>Year *</label>
                      <input type="number" value={policyDetails.vehicleYear} onChange={e => setPolicyDetails({...policyDetails, vehicleYear: e.target.value})} placeholder="e.g. 2020" />
                    </div>
                    <div className="form-field">
                      <label>Reg No. *</label>
                      <input type="text" value={policyDetails.registrationNumber} onChange={e => setPolicyDetails({...policyDetails, registrationNumber: e.target.value})} placeholder="e.g. KAB 123A" />
                    </div>
                    <div className="form-field">
                      <label>Vehicle Value</label>
                      <input type="text" value={policyDetails.vehicleValue} onChange={e => setPolicyDetails({...policyDetails, vehicleValue: e.target.value})} placeholder="KES 2,000,000" />
                    </div>
                    <div className="form-field">
                      <label>Color</label>
                      <input type="text" value={policyDetails.vehicleColor} onChange={e => setPolicyDetails({...policyDetails, vehicleColor: e.target.value})} placeholder="e.g. White" />
                    </div>
                    <div className="form-field">
                      <label>Chassis No.</label>
                      <input type="text" value={policyDetails.vehicleChassis} onChange={e => setPolicyDetails({...policyDetails, vehicleChassis: e.target.value})} placeholder="Chassis number" />
                    </div>
                  </div>
                </div>
              )}

              {normalizeCategory(selectedProduct.category) === 'medical' && (
                <div className="policy-details-section">
                  <h3><Heart size={16} /> Person Insured Details</h3>
                  <div className="customer-details-grid">
                    <div className="form-field">
                      <label>Full Name *</label>
                      <input type="text" value={policyDetails.personName} onChange={e => setPolicyDetails({...policyDetails, personName: e.target.value})} placeholder="Full name of person insured" />
                    </div>
                    <div className="form-field">
                      <label>Age *</label>
                      <input type="number" value={policyDetails.personAge} onChange={e => setPolicyDetails({...policyDetails, personAge: e.target.value})} placeholder="e.g. 35" />
                    </div>
                    <div className="form-field">
                      <label>Sex *</label>
                      <select value={policyDetails.personSex} onChange={e => setPolicyDetails({...policyDetails, personSex: e.target.value})}>
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Cover Type *</label>
                      <select value={policyDetails.coverType} onChange={e => setPolicyDetails({...policyDetails, coverType: e.target.value})}>
                        <option value="">Select...</option>
                        <option value="individual">Individual</option>
                        <option value="family">Family</option>
                        <option value="corporate">Corporate</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Cover Limit *</label>
                      <input type="text" value={policyDetails.coverLimit} onChange={e => setPolicyDetails({...policyDetails, coverLimit: e.target.value})} placeholder="KES 1,000,000" />
                    </div>
                    <div className="form-field">
                      <label>Beneficiary</label>
                      <input type="text" value={policyDetails.beneficiaryName} onChange={e => setPolicyDetails({...policyDetails, beneficiaryName: e.target.value})} placeholder="Beneficiary name" />
                    </div>
                    <div className="form-field">
                      <label>Pre-existing Conditions</label>
                      <input type="text" value={policyDetails.preExistingConditions} onChange={e => setPolicyDetails({...policyDetails, preExistingConditions: e.target.value})} placeholder="None" />
                    </div>
                  </div>
                </div>
              )}

              {normalizeCategory(selectedProduct.category) === 'buildings' && (
                <div className="policy-details-section">
                  <h3><Building size={16} /> Building/Property Details</h3>
                  <div className="customer-details-grid">
                    <div className="form-field">
                      <label>Building Type *</label>
                      <select value={policyDetails.buildingType} onChange={e => setPolicyDetails({...policyDetails, buildingType: e.target.value})}>
                        <option value="">Select...</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="mixed">Mixed Use</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Location *</label>
                      <input type="text" value={policyDetails.buildingLocation} onChange={e => setPolicyDetails({...policyDetails, buildingLocation: e.target.value})} placeholder="e.g. Nairobi, CBD" />
                    </div>
                    <div className="form-field">
                      <label>Property Value *</label>
                      <input type="text" value={policyDetails.buildingValue} onChange={e => setPolicyDetails({...policyDetails, buildingValue: e.target.value})} placeholder="KES 10,000,000" />
                    </div>
                    <div className="form-field">
                      <label>Year Built</label>
                      <input type="number" value={policyDetails.buildingYear} onChange={e => setPolicyDetails({...policyDetails, buildingYear: e.target.value})} placeholder="e.g. 2015" />
                    </div>
                    <div className="form-field">
                      <label>Number of Floors</label>
                      <input type="number" value={policyDetails.buildingFloors} onChange={e => setPolicyDetails({...policyDetails, buildingFloors: e.target.value})} placeholder="e.g. 4" />
                    </div>
                    <div className="form-field">
                      <label>Construction Type</label>
                      <select value={policyDetails.buildingConstruction} onChange={e => setPolicyDetails({...policyDetails, buildingConstruction: e.target.value})}>
                        <option value="">Select...</option>
                        <option value="stone">Stone</option>
                        <option value="brick">Brick</option>
                        <option value="wood">Wood</option>
                        <option value="steel">Steel Frame</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Occupancy</label>
                      <select value={policyDetails.buildingOccupancy} onChange={e => setPolicyDetails({...policyDetails, buildingOccupancy: e.target.value})}>
                        <option value="">Select...</option>
                        <option value="owner">Owner Occupied</option>
                        <option value="tenant">Tenant Occupied</option>
                        <option value="vacant">Vacant</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={generatePaymentLink} className="generate-btn-full" disabled={isGenerating}>
                {isGenerating ? (
                  <><div className="loading-spinner mr-2"></div> Generating...</>
                ) : (
                  <><Link className="w-5 h-5 mr-2" /> Generate Payment Link</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentLinkGenerator;
