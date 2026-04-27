import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, FileText, Edit, Save, Shield, Car, Heart, Briefcase, Home, AlertCircle, CheckCircle } from 'lucide-react';
import './ClientDetailsModal.css';

const ClientDetailsModal = ({ isOpen, onClose, client, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: client?.id || '',
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    dateOfBirth: client?.dateOfBirth || '',
    idNumber: client?.idNumber || '',
    occupation: client?.occupation || '',
    emergencyContact: client?.emergencyContact || '',
    emergencyPhone: client?.emergencyPhone || '',
    notes: client?.notes || '',
    policies: client?.policies || [],
    status: client?.status || 'active'
  });

  const [activeTab, setActiveTab] = useState('details');
  const [showAddPolicy, setShowAddPolicy] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(client || {});
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'inactive': return 'inactive';
      case 'pending': return 'pending';
      default: return 'active';
    }
  };

  const getPolicyIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'motor': return Car;
      case 'health': return Heart;
      case 'life': return Shield;
      case 'business': return Briefcase;
      case 'home': return Home;
      default: return FileText;
    }
  };

  const addNewPolicy = (policyType) => {
    const newPolicy = {
      id: `POL${Date.now()}`,
      type: policyType,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      premium: 0
    };
    
    setFormData(prev => ({
      ...prev,
      policies: [...prev.policies, newPolicy]
    }));
    setShowAddPolicy(false);
  };

  if (!isOpen) return null;

  return (
    <div className="client-modal-overlay">
      <div className="client-modal">
        <div className="client-modal-header">
          <div className="client-modal-title">
            <User className="client-modal-icon" />
            <h2>Client Details</h2>
            <span className={`client-modal-status ${getStatusColor(formData.status)}`}>
              {formData.status}
            </span>
          </div>
          <div className="client-modal-header-actions">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="client-modal-btn edit"
              >
                <Edit className="client-modal-btn-icon" />
                Edit
              </button>
            ) : (
              <>
                <button 
                  onClick={handleCancel}
                  className="client-modal-btn cancel"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="client-modal-btn save"
                >
                  <Save className="client-modal-btn-icon" />
                  Save
                </button>
              </>
            )}
            <button onClick={onClose} className="client-modal-close">
              <X />
            </button>
          </div>
        </div>

        <div className="client-modal-tabs">
          <button
            className={`client-modal-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <User className="client-modal-tab-icon" />
            Personal Details
          </button>
          <button
            className={`client-modal-tab ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveTab('policies')}
          >
            <FileText className="client-modal-tab-icon" />
            Policies ({formData.policies.length})
          </button>
          <button
            className={`client-modal-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <FileText className="client-modal-tab-icon" />
            Notes
          </button>
        </div>

        <div className="client-modal-content">
          {activeTab === 'details' && (
            <div className="client-modal-grid">
              <div className="client-modal-section">
                <h3 className="client-modal-section-title">Basic Information</h3>
                <div className="client-modal-form-grid">
                  <div className="client-modal-form-group">
                    <label>Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="client-modal-input"
                      />
                    ) : (
                      <div className="client-modal-value">{formData.name || 'N/A'}</div>
                    )}
                  </div>
                  <div className="client-modal-form-group">
                    <label>Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="client-modal-input"
                      />
                    ) : (
                      <div className="client-modal-value">{formData.email || 'N/A'}</div>
                    )}
                  </div>
                  <div className="client-modal-form-group">
                    <label>Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="client-modal-input"
                      />
                    ) : (
                      <div className="client-modal-value">{formData.phone || 'N/A'}</div>
                    )}
                  </div>
                  <div className="client-modal-form-group">
                    <label>ID Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        className="client-modal-input"
                      />
                    ) : (
                      <div className="client-modal-value">{formData.idNumber || 'N/A'}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="client-modal-section">
                <h3 className="client-modal-section-title">Additional Information</h3>
                <div className="client-modal-form-grid">
                  <div className="client-modal-form-group">
                    <label>Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="client-modal-input"
                      />
                    ) : (
                      <div className="client-modal-value">
                        {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </div>
                    )}
                  </div>
                  <div className="client-modal-form-group">
                    <label>Occupation</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="client-modal-input"
                      />
                    ) : (
                      <div className="client-modal-value">{formData.occupation || 'N/A'}</div>
                    )}
                  </div>
                  <div className="client-modal-form-group full-width">
                    <label>Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="client-modal-input"
                      />
                    ) : (
                      <div className="client-modal-value">{formData.address || 'N/A'}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="client-modal-section">
                <h3 className="client-modal-section-title">Emergency Contact</h3>
                <div className="client-modal-form-grid">
                  <div className="client-modal-form-group">
                    <label>Contact Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="client-modal-input"
                      />
                    ) : (
                      <div className="client-modal-value">{formData.emergencyContact || 'N/A'}</div>
                    )}
                  </div>
                  <div className="client-modal-form-group">
                    <label>Contact Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        className="client-modal-input"
                      />
                    ) : (
                      <div className="client-modal-value">{formData.emergencyPhone || 'N/A'}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="client-modal-policies">
              <div className="client-modal-policies-header">
                <h3 className="client-modal-section-title">Client Policies</h3>
                <button 
                  onClick={() => setShowAddPolicy(!showAddPolicy)}
                  className="client-modal-btn primary"
                >
                  <FileText className="client-modal-btn-icon" />
                  Add Policy
                </button>
              </div>

              {showAddPolicy && (
                <div className="client-modal-add-policy">
                  <h4>Select Policy Type</h4>
                  <div className="client-modal-policy-types">
                    {['Motor Insurance', 'Health Insurance', 'Life Insurance', 'Business Insurance', 'Home Insurance'].map(type => (
                      <button
                        key={type}
                        onClick={() => addNewPolicy(type)}
                        className="client-modal-policy-type-btn"
                      >
                        {React.createElement(getPolicyIcon(type.split(' ')[0].toLowerCase()), { className: "client-modal-policy-type-icon" })}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="client-modal-policies-grid">
                {formData.policies.map(policy => {
                  const PolicyIcon = getPolicyIcon(policy.type.split(' ')[0]);
                  return (
                    <div key={policy.id} className="client-modal-policy-card">
                      <div className="client-modal-policy-header">
                        <div className="client-modal-policy-info">
                          <PolicyIcon className="client-modal-policy-icon" />
                          <div>
                            <h4>{policy.type}</h4>
                            <p className="client-modal-policy-id">{policy.id}</p>
                          </div>
                        </div>
                        <span className={`client-modal-policy-status ${policy.status}`}>
                          {policy.status}
                        </span>
                      </div>
                      <div className="client-modal-policy-details">
                        <div className="client-modal-policy-detail">
                          <Calendar className="client-modal-policy-detail-icon" />
                          <span>Start: {new Date(policy.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="client-modal-policy-detail">
                          <Calendar className="client-modal-policy-detail-icon" />
                          <span>End: {new Date(policy.endDate).toLocaleDateString()}</span>
                        </div>
                        {policy.premium > 0 && (
                          <div className="client-modal-policy-detail">
                            <span className="client-modal-policy-premium">KES {policy.premium.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {formData.policies.length === 0 && (
                <div className="client-modal-empty-state">
                  <FileText className="client-modal-empty-icon" />
                  <p>No policies found for this client</p>
                  <button 
                    onClick={() => setShowAddPolicy(true)}
                    className="client-modal-btn primary"
                  >
                    Add First Policy
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="client-modal-notes">
              <h3 className="client-modal-section-title">Client Notes</h3>
              {isEditing ? (
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add notes about this client..."
                  className="client-modal-textarea"
                  rows="8"
                />
              ) : (
                <div className="client-modal-notes-content">
                  {formData.notes ? (
                    <p>{formData.notes}</p>
                  ) : (
                    <div className="client-modal-empty-state">
                      <FileText className="client-modal-empty-icon" />
                      <p>No notes available for this client</p>
                    </div>
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

export default ClientDetailsModal;
