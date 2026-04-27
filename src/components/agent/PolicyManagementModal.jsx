import React, { useState } from 'react';
import { X, FileText, Save, Edit, Plus, Trash2, Calendar, DollarSign, User, Car, Heart, Shield, Briefcase, Home, AlertCircle, CheckCircle, Clock, Upload, Download } from 'lucide-react';
import './PolicyManagementModal.css';

const PolicyManagementModal = ({ isOpen, onClose, policy, onSave, clients }) => {
  const [isEditing, setIsEditing] = useState(!policy);
  const [formData, setFormData] = useState({
    id: policy?.id || `POL${Date.now()}`,
    clientId: policy?.clientId || '',
    policyType: policy?.policyType || 'Motor Insurance',
    policyNumber: policy?.policyNumber || '',
    status: policy?.status || 'active',
    startDate: policy?.startDate || new Date().toISOString().split('T')[0],
    endDate: policy?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    premium: policy?.premium || '',
    paymentFrequency: policy?.paymentFrequency || 'annual',
    coverageAmount: policy?.coverageAmount || '',
    deductible: policy?.deductible || '',
    vehicleDetails: policy?.vehicleDetails || {},
    healthDetails: policy?.healthDetails || {},
    lifeDetails: policy?.lifeDetails || {},
    businessDetails: policy?.businessDetails || {},
    homeDetails: policy?.homeDetails || {},
    beneficiaries: policy?.beneficiaries || [],
    documents: policy?.documents || [],
    notes: policy?.notes || '',
    renewalReminder: policy?.renewalReminder !== false,
    autoRenewal: policy?.autoRenewal || false
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState({ name: '', relationship: '', percentage: '', idNumber: '' });

  const policyTypes = [
    { id: 'motor', name: 'Motor Insurance', icon: Car },
    { id: 'health', name: 'Health Insurance', icon: Heart },
    { id: 'life', name: 'Life Insurance', icon: Shield },
    { id: 'business', name: 'Business Insurance', icon: Briefcase },
    { id: 'home', name: 'Home Insurance', icon: Home }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNestedInputChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(policy || {});
    setIsEditing(false);
  };

  const addBeneficiary = () => {
    if (newBeneficiary.name && newBeneficiary.percentage) {
      setFormData(prev => ({
        ...prev,
        beneficiaries: [...prev.beneficiaries, { ...newBeneficiary, id: Date.now() }]
      }));
      setNewBeneficiary({ name: '', relationship: '', percentage: '', idNumber: '' });
      setShowAddBeneficiary(false);
    }
  };

  const removeBeneficiary = (id) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter(b => b.id !== id)
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'expired': return 'expired';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return 'active';
    }
  };

  const getPolicyIcon = (type) => {
    const policyType = policyTypes.find(p => p.id === type);
    return policyType ? policyType.icon : FileText;
  };

  if (!isOpen) return null;

  return (
    <div className="policy-modal-overlay">
      <div className="policy-modal">
        <div className="policy-modal-header">
          <div className="policy-modal-title">
            <FileText className="policy-modal-icon" />
            <h2>{policy ? 'Edit Policy' : 'Create New Policy'}</h2>
            {formData.id && (
              <span className="policy-modal-number">{formData.id}</span>
            )}
          </div>
          <div className="policy-modal-header-actions">
            {!isEditing && policy && (
              <button 
                onClick={() => setIsEditing(true)}
                className="policy-modal-btn edit"
              >
                <Edit className="policy-modal-btn-icon" />
                Edit
              </button>
            )}
            {isEditing && (
              <>
                <button 
                  onClick={handleCancel}
                  className="policy-modal-btn cancel"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="policy-modal-btn save"
                >
                  <Save className="policy-modal-btn-icon" />
                  Save
                </button>
              </>
            )}
            <button onClick={onClose} className="policy-modal-close">
              <X />
            </button>
          </div>
        </div>

        <div className="policy-modal-tabs">
          <button
            className={`policy-modal-tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            <FileText className="policy-modal-tab-icon" />
            Basic Info
          </button>
          <button
            className={`policy-modal-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <Shield className="policy-modal-tab-icon" />
            Coverage Details
          </button>
          <button
            className={`policy-modal-tab ${activeTab === 'beneficiaries' ? 'active' : ''}`}
            onClick={() => setActiveTab('beneficiaries')}
          >
            <User className="policy-modal-tab-icon" />
            Beneficiaries ({formData.beneficiaries.length})
          </button>
          <button
            className={`policy-modal-tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <Upload className="policy-modal-tab-icon" />
            Documents ({formData.documents.length})
          </button>
        </div>

        <div className="policy-modal-content">
          {activeTab === 'basic' && (
            <div className="policy-modal-grid">
              <div className="policy-modal-section">
                <h3 className="policy-modal-section-title">Policy Information</h3>
                <div className="policy-modal-form-grid">
                  <div className="policy-modal-form-group">
                    <label>Client</label>
                    {isEditing ? (
                      <select
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleInputChange}
                        className="policy-modal-select"
                      >
                        <option value="">Select Client</option>
                        {clients?.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="policy-modal-value">
                        {clients?.find(c => c.id === formData.clientId)?.name || 'N/A'}
                      </div>
                    )}
                  </div>
                  <div className="policy-modal-form-group">
                    <label>Policy Type</label>
                    {isEditing ? (
                      <select
                        name="policyType"
                        value={formData.policyType}
                        onChange={handleInputChange}
                        className="policy-modal-select"
                      >
                        {policyTypes.map(type => (
                          <option key={type.id} value={type.name}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="policy-modal-value">{formData.policyType}</div>
                    )}
                  </div>
                  <div className="policy-modal-form-group">
                    <label>Policy Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="policyNumber"
                        value={formData.policyNumber}
                        onChange={handleInputChange}
                        className="policy-modal-input"
                      />
                    ) : (
                      <div className="policy-modal-value">{formData.policyNumber || 'N/A'}</div>
                    )}
                  </div>
                  <div className="policy-modal-form-group">
                    <label>Status</label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="policy-modal-select"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`policy-modal-status ${getStatusColor(formData.status)}`}>
                        {formData.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="policy-modal-section">
                <h3 className="policy-modal-section-title">Policy Period</h3>
                <div className="policy-modal-form-grid">
                  <div className="policy-modal-form-group">
                    <label>Start Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="policy-modal-input"
                      />
                    ) : (
                      <div className="policy-modal-value">
                        {new Date(formData.startDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="policy-modal-form-group">
                    <label>End Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="policy-modal-input"
                      />
                    ) : (
                      <div className="policy-modal-value">
                        {new Date(formData.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="policy-modal-section">
                <h3 className="policy-modal-section-title">Premium Information</h3>
                <div className="policy-modal-form-grid">
                  <div className="policy-modal-form-group">
                    <label>Premium Amount (KES)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="premium"
                        value={formData.premium}
                        onChange={handleInputChange}
                        className="policy-modal-input"
                      />
                    ) : (
                      <div className="policy-modal-value">KES {parseInt(formData.premium || 0).toLocaleString()}</div>
                    )}
                  </div>
                  <div className="policy-modal-form-group">
                    <label>Payment Frequency</label>
                    {isEditing ? (
                      <select
                        name="paymentFrequency"
                        value={formData.paymentFrequency}
                        onChange={handleInputChange}
                        className="policy-modal-select"
                      >
                        <option value="annual">Annual</option>
                        <option value="semi-annual">Semi-Annual</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    ) : (
                      <div className="policy-modal-value">{formData.paymentFrequency}</div>
                    )}
                  </div>
                  <div className="policy-modal-form-group">
                    <label>Coverage Amount (KES)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="coverageAmount"
                        value={formData.coverageAmount}
                        onChange={handleInputChange}
                        className="policy-modal-input"
                      />
                    ) : (
                      <div className="policy-modal-value">KES {parseInt(formData.coverageAmount || 0).toLocaleString()}</div>
                    )}
                  </div>
                  <div className="policy-modal-form-group">
                    <label>Deductible (KES)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="deductible"
                        value={formData.deductible}
                        onChange={handleInputChange}
                        className="policy-modal-input"
                      />
                    ) : (
                      <div className="policy-modal-value">KES {parseInt(formData.deductible || 0).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="policy-modal-section">
                <h3 className="policy-modal-section-title">Policy Options</h3>
                <div className="policy-modal-checkbox-group">
                  <label className="policy-modal-checkbox-label">
                    <input
                      type="checkbox"
                      name="renewalReminder"
                      checked={formData.renewalReminder}
                      onChange={handleInputChange}
                      className="policy-modal-checkbox"
                    />
                    <span>Send renewal reminder</span>
                  </label>
                  <label className="policy-modal-checkbox-label">
                    <input
                      type="checkbox"
                      name="autoRenewal"
                      checked={formData.autoRenewal}
                      onChange={handleInputChange}
                      className="policy-modal-checkbox"
                    />
                    <span>Enable auto-renewal</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="policy-modal-details">
              {formData.policyType === 'Motor Insurance' && (
                <div className="policy-modal-section">
                  <h3 className="policy-modal-section-title">
                    <Car className="policy-modal-section-icon" />
                    Vehicle Details
                  </h3>
                  <div className="policy-modal-form-grid">
                    <div className="policy-modal-form-group">
                      <label>Make & Model</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.vehicleDetails.makeModel || ''}
                          onChange={(e) => handleNestedInputChange('vehicleDetails', 'makeModel', e.target.value)}
                          className="policy-modal-input"
                        />
                      ) : (
                        <div className="policy-modal-value">{formData.vehicleDetails.makeModel || 'N/A'}</div>
                      )}
                    </div>
                    <div className="policy-modal-form-group">
                      <label>Registration Number</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.vehicleDetails.registrationNumber || ''}
                          onChange={(e) => handleNestedInputChange('vehicleDetails', 'registrationNumber', e.target.value)}
                          className="policy-modal-input"
                        />
                      ) : (
                        <div className="policy-modal-value">{formData.vehicleDetails.registrationNumber || 'N/A'}</div>
                      )}
                    </div>
                    <div className="policy-modal-form-group">
                      <label>Year of Manufacture</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.vehicleDetails.year || ''}
                          onChange={(e) => handleNestedInputChange('vehicleDetails', 'year', e.target.value)}
                          className="policy-modal-input"
                        />
                      ) : (
                        <div className="policy-modal-value">{formData.vehicleDetails.year || 'N/A'}</div>
                      )}
                    </div>
                    <div className="policy-modal-form-group">
                      <label>Vehicle Use</label>
                      {isEditing ? (
                        <select
                          value={formData.vehicleDetails.use || ''}
                          onChange={(e) => handleNestedInputChange('vehicleDetails', 'use', e.target.value)}
                          className="policy-modal-select"
                        >
                          <option value="">Select Use</option>
                          <option value="private">Private</option>
                          <option value="commercial">Commercial</option>
                          <option value="public-service">Public Service</option>
                        </select>
                      ) : (
                        <div className="policy-modal-value">{formData.vehicleDetails.use || 'N/A'}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {formData.policyType === 'Health Insurance' && (
                <div className="policy-modal-section">
                  <h3 className="policy-modal-section-title">
                    <Heart className="policy-modal-section-icon" />
                    Health Coverage Details
                  </h3>
                  <div className="policy-modal-form-grid">
                    <div className="policy-modal-form-group">
                      <label>Coverage Type</label>
                      {isEditing ? (
                        <select
                          value={formData.healthDetails.coverageType || ''}
                          onChange={(e) => handleNestedInputChange('healthDetails', 'coverageType', e.target.value)}
                          className="policy-modal-select"
                        >
                          <option value="">Select Coverage</option>
                          <option value="individual">Individual</option>
                          <option value="family">Family</option>
                          <option value="group">Group</option>
                        </select>
                      ) : (
                        <div className="policy-modal-value">{formData.healthDetails.coverageType || 'N/A'}</div>
                      )}
                    </div>
                    <div className="policy-modal-form-group">
                      <label>Number of Members</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.healthDetails.members || ''}
                          onChange={(e) => handleNestedInputChange('healthDetails', 'members', e.target.value)}
                          className="policy-modal-input"
                        />
                      ) : (
                        <div className="policy-modal-value">{formData.healthDetails.members || 'N/A'}</div>
                      )}
                    </div>
                    <div className="policy-modal-form-group">
                      <label>Pre-existing Conditions</label>
                      {isEditing ? (
                        <textarea
                          value={formData.healthDetails.preExisting || ''}
                          onChange={(e) => handleNestedInputChange('healthDetails', 'preExisting', e.target.value)}
                          className="policy-modal-textarea"
                          rows="3"
                        />
                      ) : (
                        <div className="policy-modal-value">{formData.healthDetails.preExisting || 'None'}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {formData.policyType === 'Life Insurance' && (
                <div className="policy-modal-section">
                  <h3 className="policy-modal-section-title">
                    <Shield className="policy-modal-section-icon" />
                    Life Insurance Details
                  </h3>
                  <div className="policy-modal-form-grid">
                    <div className="policy-modal-form-group">
                      <label>Policy Term</label>
                      {isEditing ? (
                        <select
                          value={formData.lifeDetails.term || ''}
                          onChange={(e) => handleNestedInputChange('lifeDetails', 'term', e.target.value)}
                          className="policy-modal-select"
                        >
                          <option value="">Select Term</option>
                          <option value="10">10 Years</option>
                          <option value="15">15 Years</option>
                          <option value="20">20 Years</option>
                          <option value="25">25 Years</option>
                          <option value="30">30 Years</option>
                          <option value="whole">Whole Life</option>
                        </select>
                      ) : (
                        <div className="policy-modal-value">{formData.lifeDetails.term || 'N/A'}</div>
                      )}
                    </div>
                    <div className="policy-modal-form-group">
                      <label>Sum Assured (KES)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.lifeDetails.sumAssured || ''}
                          onChange={(e) => handleNestedInputChange('lifeDetails', 'sumAssured', e.target.value)}
                          className="policy-modal-input"
                        />
                      ) : (
                        <div className="policy-modal-value">KES {parseInt(formData.lifeDetails.sumAssured || 0).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'beneficiaries' && (
            <div className="policy-modal-beneficiaries">
              <div className="policy-modal-beneficiaries-header">
                <h3 className="policy-modal-section-title">Policy Beneficiaries</h3>
                {isEditing && (
                  <button 
                    onClick={() => setShowAddBeneficiary(true)}
                    className="policy-modal-btn primary"
                  >
                    <Plus className="policy-modal-btn-icon" />
                    Add Beneficiary
                  </button>
                )}
              </div>

              {showAddBeneficiary && (
                <div className="policy-modal-add-beneficiary">
                  <h4>Add New Beneficiary</h4>
                  <div className="policy-modal-form-grid">
                    <div className="policy-modal-form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={newBeneficiary.name}
                        onChange={(e) => setNewBeneficiary(prev => ({ ...prev, name: e.target.value }))}
                        className="policy-modal-input"
                      />
                    </div>
                    <div className="policy-modal-form-group">
                      <label>Relationship</label>
                      <input
                        type="text"
                        value={newBeneficiary.relationship}
                        onChange={(e) => setNewBeneficiary(prev => ({ ...prev, relationship: e.target.value }))}
                        className="policy-modal-input"
                      />
                    </div>
                    <div className="policy-modal-form-group">
                      <label>Percentage (%)</label>
                      <input
                        type="number"
                        value={newBeneficiary.percentage}
                        onChange={(e) => setNewBeneficiary(prev => ({ ...prev, percentage: e.target.value }))}
                        className="policy-modal-input"
                      />
                    </div>
                    <div className="policy-modal-form-group">
                      <label>ID Number</label>
                      <input
                        type="text"
                        value={newBeneficiary.idNumber}
                        onChange={(e) => setNewBeneficiary(prev => ({ ...prev, idNumber: e.target.value }))}
                        className="policy-modal-input"
                      />
                    </div>
                  </div>
                  <div className="policy-modal-beneficiary-actions">
                    <button onClick={() => setShowAddBeneficiary(false)} className="policy-modal-btn cancel">
                      Cancel
                    </button>
                    <button onClick={addBeneficiary} className="policy-modal-btn primary">
                      Add Beneficiary
                    </button>
                  </div>
                </div>
              )}

              <div className="policy-modal-beneficiaries-list">
                {formData.beneficiaries.map(beneficiary => (
                  <div key={beneficiary.id} className="policy-modal-beneficiary-card">
                    <div className="policy-modal-beneficiary-info">
                      <div className="policy-modal-beneficiary-name">{beneficiary.name}</div>
                      <div className="policy-modal-beneficiary-details">
                        <span className="policy-modal-beneficiary-relationship">{beneficiary.relationship}</span>
                        <span className="policy-modal-beneficiary-percentage">{beneficiary.percentage}%</span>
                        <span className="policy-modal-beneficiary-id">ID: {beneficiary.idNumber}</span>
                      </div>
                    </div>
                    {isEditing && (
                      <button 
                        onClick={() => removeBeneficiary(beneficiary.id)}
                        className="policy-modal-btn danger"
                      >
                        <Trash2 className="policy-modal-btn-icon" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {formData.beneficiaries.length === 0 && (
                <div className="policy-modal-empty-state">
                  <User className="policy-modal-empty-icon" />
                  <p>No beneficiaries added to this policy</p>
                  {isEditing && (
                    <button 
                      onClick={() => setShowAddBeneficiary(true)}
                      className="policy-modal-btn primary"
                    >
                      Add First Beneficiary
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="policy-modal-documents">
              <div className="policy-modal-documents-header">
                <h3 className="policy-modal-section-title">Policy Documents</h3>
                {isEditing && (
                  <button className="policy-modal-btn primary">
                    <Upload className="policy-modal-btn-icon" />
                    Upload Document
                  </button>
                )}
              </div>

              <div className="policy-modal-documents-list">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="policy-modal-document-card">
                    <div className="policy-modal-document-info">
                      <FileText className="policy-modal-document-icon" />
                      <div>
                        <div className="policy-modal-document-name">{doc.name}</div>
                        <div className="policy-modal-document-details">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="policy-modal-btn secondary">
                      <Download className="policy-modal-btn-icon" />
                    </button>
                  </div>
                ))}
              </div>

              {formData.documents.length === 0 && (
                <div className="policy-modal-empty-state">
                  <Upload className="policy-modal-empty-icon" />
                  <p>No documents uploaded for this policy</p>
                  {isEditing && (
                    <button className="policy-modal-btn primary">
                      Upload First Document
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyManagementModal;
