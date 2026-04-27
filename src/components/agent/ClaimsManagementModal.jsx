import React, { useState } from 'react';
import { X, DollarSign, FileText, Upload, Calendar, User, AlertTriangle, CheckCircle, Clock, Send, MessageSquare, Paperclip, Download, Eye, Edit, Save, Plus, Trash2, Search, Filter } from 'lucide-react';
import './ClaimsManagementModal.css';

const ClaimsManagementModal = ({ isOpen, onClose, claim, policies, onSave }) => {
  const [isEditing, setIsEditing] = useState(!claim);
  const [activeTab, setActiveTab] = useState('details');
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newDocument, setNewDocument] = useState({ name: '', type: '', description: '' });

  const [formData, setFormData] = useState({
    id: claim?.id || `CLM${Date.now()}`,
    policyId: claim?.policyId || '',
    claimNumber: claim?.claimNumber || '',
    claimType: claim?.claimType || '',
    status: claim?.status || 'pending',
    priority: claim?.priority || 'medium',
    dateOfIncident: claim?.dateOfIncident || new Date().toISOString().split('T')[0],
    dateReported: claim?.dateReported || new Date().toISOString().split('T')[0],
    estimatedAmount: claim?.estimatedAmount || '',
    approvedAmount: claim?.approvedAmount || '',
    description: claim?.description || '',
    incidentLocation: claim?.incidentLocation || '',
    incidentDescription: claim?.incidentDescription || '',
    claimantDetails: claim?.claimantDetails || {},
    witnessDetails: claim?.witnessDetails || [],
    policeReport: claim?.policeReport || {},
    medicalReport: claim?.medicalReport || {},
    repairEstimates: claim?.repairEstimates || [],
    documents: claim?.documents || [],
    notes: claim?.notes || [],
    assessment: claim?.assessment || {},
    settlement: claim?.settlement || {},
    assignedTo: claim?.assignedTo || '',
    dateAssigned: claim?.dateAssigned || new Date().toISOString().split('T')[0],
    dateResolved: claim?.dateResolved || ''
  });

  const claimTypes = [
    'Motor Accident',
    'Medical Claim',
    'Property Damage',
    'Theft',
    'Fire Damage',
    'Liability Claim',
    'Business Interruption',
    'Other'
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'pending' },
    { value: 'investigating', label: 'Investigating', color: 'investigating' },
    { value: 'assessed', label: 'Assessed', color: 'assessed' },
    { value: 'approved', label: 'Approved', color: 'approved' },
    { value: 'rejected', label: 'Rejected', color: 'rejected' },
    { value: 'settled', label: 'Settled', color: 'settled' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'low' },
    { value: 'medium', label: 'Medium', color: 'medium' },
    { value: 'high', label: 'High', color: 'high' },
    { value: 'critical', label: 'Critical', color: 'critical' }
  ];

  const documentTypes = [
    'Police Report',
    'Medical Report',
    'Repair Estimate',
    'Photographs',
    'Witness Statement',
    'Insurance Form',
    'Receipts',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    setFormData(claim || {});
    setIsEditing(false);
  };

  const addNote = () => {
    if (newNote.trim()) {
      setFormData(prev => ({
        ...prev,
        notes: [...prev.notes, {
          id: Date.now(),
          text: newNote,
          author: 'Current Agent',
          date: new Date().toISOString(),
          type: 'internal'
        }]
      }));
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const addDocument = () => {
    if (newDocument.name && newDocument.type) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, {
          id: Date.now(),
          ...newDocument,
          uploadDate: new Date().toISOString(),
          uploadedBy: 'Current Agent'
        }]
      }));
      setNewDocument({ name: '', type: '', description: '' });
      setShowAddDocument(false);
    }
  };

  const removeDocument = (id) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }));
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'pending';
  };

  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(p => p.value === priority);
    return priorityOption ? priorityOption.color : 'medium';
  };

  const filteredDocuments = formData.documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="claims-modal-overlay">
      <div className="claims-modal">
        <div className="claims-modal-header">
          <div className="claims-modal-title">
            <FileText className="claims-modal-icon" />
            <h2>{claim ? 'Edit Claim' : 'Create New Claim'}</h2>
            {formData.id && (
              <span className="claims-modal-number">{formData.claimNumber || formData.id}</span>
            )}
          </div>
          <div className="claims-modal-header-actions">
            {!isEditing && claim && (
              <button 
                onClick={() => setIsEditing(true)}
                className="claims-modal-btn edit"
              >
                <Edit className="claims-modal-btn-icon" />
                Edit
              </button>
            )}
            {isEditing && (
              <>
                <button 
                  onClick={handleCancel}
                  className="claims-modal-btn cancel"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="claims-modal-btn save"
                >
                  <Save className="claims-modal-btn-icon" />
                  Save
                </button>
              </>
            )}
            <button onClick={onClose} className="claims-modal-close">
              <X />
            </button>
          </div>
        </div>

        <div className="claims-modal-tabs">
          <button
            className={`claims-modal-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <FileText className="claims-modal-tab-icon" />
            Claim Details
          </button>
          <button
            className={`claims-modal-tab ${activeTab === 'assessment' ? 'active' : ''}`}
            onClick={() => setActiveTab('assessment')}
          >
            <CheckCircle className="claims-modal-tab-icon" />
            Assessment
          </button>
          <button
            className={`claims-modal-tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <Paperclip className="claims-modal-tab-icon" />
            Documents ({formData.documents.length})
          </button>
          <button
            className={`claims-modal-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <MessageSquare className="claims-modal-tab-icon" />
            Notes ({formData.notes.length})
          </button>
        </div>

        <div className="claims-modal-content">
          {activeTab === 'details' && (
            <div className="claims-modal-grid">
              <div className="claims-modal-section">
                <h3 className="claims-modal-section-title">Basic Information</h3>
                <div className="claims-modal-form-grid">
                  <div className="claims-modal-form-group">
                    <label>Policy</label>
                    {isEditing ? (
                      <select
                        name="policyId"
                        value={formData.policyId}
                        onChange={handleInputChange}
                        className="claims-modal-select"
                      >
                        <option value="">Select Policy</option>
                        {policies?.map(policy => (
                          <option key={policy.id} value={policy.id}>
                            {policy.policyNumber} - {policy.policyType}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="claims-modal-value">
                        {policies?.find(p => p.id === formData.policyId)?.policyNumber || 'N/A'}
                      </div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Claim Type</label>
                    {isEditing ? (
                      <select
                        name="claimType"
                        value={formData.claimType}
                        onChange={handleInputChange}
                        className="claims-modal-select"
                      >
                        {claimTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="claims-modal-value">{formData.claimType || 'N/A'}</div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Status</label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="claims-modal-select"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`claims-modal-status ${getStatusColor(formData.status)}`}>
                        {statusOptions.find(s => s.value === formData.status)?.label || formData.status}
                      </span>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Priority</label>
                    {isEditing ? (
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="claims-modal-select"
                      >
                        {priorityOptions.map(priority => (
                          <option key={priority.value} value={priority.value}>{priority.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`claims-modal-priority ${getPriorityColor(formData.priority)}`}>
                        {priorityOptions.find(p => p.value === formData.priority)?.label || formData.priority}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="claims-modal-section">
                <h3 className="claims-modal-section-title">Incident Details</h3>
                <div className="claims-modal-form-grid">
                  <div className="claims-modal-form-group">
                    <label>Date of Incident</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfIncident"
                        value={formData.dateOfIncident}
                        onChange={handleInputChange}
                        className="claims-modal-input"
                      />
                    ) : (
                      <div className="claims-modal-value">
                        {new Date(formData.dateOfIncident).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Date Reported</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateReported"
                        value={formData.dateReported}
                        onChange={handleInputChange}
                        className="claims-modal-input"
                      />
                    ) : (
                      <div className="claims-modal-value">
                        {new Date(formData.dateReported).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Incident Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="incidentLocation"
                        value={formData.incidentLocation}
                        onChange={handleInputChange}
                        className="claims-modal-input"
                        placeholder="Location of incident"
                      />
                    ) : (
                      <div className="claims-modal-value">{formData.incidentLocation || 'N/A'}</div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Estimated Amount (KES)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="estimatedAmount"
                        value={formData.estimatedAmount}
                        onChange={handleInputChange}
                        className="claims-modal-input"
                        placeholder="Estimated claim value"
                      />
                    ) : (
                      <div className="claims-modal-value">
                        KES {parseInt(formData.estimatedAmount || 0).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="claims-modal-form-group full-width">
                  <label>Incident Description</label>
                  {isEditing ? (
                    <textarea
                      name="incidentDescription"
                      value={formData.incidentDescription}
                      onChange={handleInputChange}
                      placeholder="Detailed description of the incident..."
                      className="claims-modal-textarea"
                      rows="4"
                    />
                  ) : (
                    <div className="claims-modal-value claims-modal-textarea-value">
                      {formData.incidentDescription || 'No description provided'}
                    </div>
                  )}
                </div>
              </div>

              <div className="claims-modal-section">
                <h3 className="claims-modal-section-title">Assignment</h3>
                <div className="claims-modal-form-grid">
                  <div className="claims-modal-form-group">
                    <label>Assigned To</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleInputChange}
                        className="claims-modal-input"
                        placeholder="Assign to agent or adjuster"
                      />
                    ) : (
                      <div className="claims-modal-value">{formData.assignedTo || 'Unassigned'}</div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Date Assigned</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateAssigned"
                        value={formData.dateAssigned}
                        onChange={handleInputChange}
                        className="claims-modal-input"
                      />
                    ) : (
                      <div className="claims-modal-value">
                        {formData.dateAssigned ? new Date(formData.dateAssigned).toLocaleDateString() : 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div className="claims-modal-assessment">
              <div className="claims-modal-section">
                <h3 className="claims-modal-section-title">Claim Assessment</h3>
                <div className="claims-modal-form-grid">
                  <div className="claims-modal-form-group">
                    <label>Approved Amount (KES)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="approvedAmount"
                        value={formData.approvedAmount}
                        onChange={handleInputChange}
                        className="claims-modal-input"
                      />
                    ) : (
                      <div className="claims-modal-value">
                        KES {parseInt(formData.approvedAmount || 0).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Assessment Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.assessment?.date || ''}
                        onChange={(e) => handleNestedInputChange('assessment', 'date', e.target.value)}
                        className="claims-modal-input"
                      />
                    ) : (
                      <div className="claims-modal-value">
                        {formData.assessment?.date ? new Date(formData.assessment.date).toLocaleDateString() : 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="claims-modal-form-group full-width">
                  <label>Assessment Notes</label>
                  {isEditing ? (
                    <textarea
                      value={formData.assessment?.notes || ''}
                      onChange={(e) => handleNestedInputChange('assessment', 'notes', e.target.value)}
                      placeholder="Assessment findings and recommendations..."
                      className="claims-modal-textarea"
                      rows="4"
                    />
                  ) : (
                    <div className="claims-modal-value claims-modal-textarea-value">
                      {formData.assessment?.notes || 'No assessment notes available'}
                    </div>
                  )}
                </div>
              </div>

              <div className="claims-modal-section">
                <h3 className="claims-modal-section-title">Settlement Details</h3>
                <div className="claims-modal-form-grid">
                  <div className="claims-modal-form-group">
                    <label>Settlement Amount (KES)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.settlement?.amount || ''}
                        onChange={(e) => handleNestedInputChange('settlement', 'amount', e.target.value)}
                        className="claims-modal-input"
                      />
                    ) : (
                      <div className="claims-modal-value">
                        KES {parseInt(formData.settlement?.amount || 0).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Settlement Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.settlement?.date || ''}
                        onChange={(e) => handleNestedInputChange('settlement', 'date', e.target.value)}
                        className="claims-modal-input"
                      />
                    ) : (
                      <div className="claims-modal-value">
                        {formData.settlement?.date ? new Date(formData.settlement.date).toLocaleDateString() : 'N/A'}
                      </div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Payment Method</label>
                    {isEditing ? (
                      <select
                        value={formData.settlement?.paymentMethod || ''}
                        onChange={(e) => handleNestedInputChange('settlement', 'paymentMethod', e.target.value)}
                        className="claims-modal-select"
                      >
                        <option value="">Select Method</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cheque">Cheque</option>
                        <option value="cash">Cash</option>
                        <option value="mobile_money">Mobile Money</option>
                      </select>
                    ) : (
                      <div className="claims-modal-value">{formData.settlement?.paymentMethod || 'N/A'}</div>
                    )}
                  </div>
                  <div className="claims-modal-form-group">
                    <label>Date Resolved</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateResolved"
                        value={formData.dateResolved}
                        onChange={handleInputChange}
                        className="claims-modal-input"
                      />
                    ) : (
                      <div className="claims-modal-value">
                        {formData.dateResolved ? new Date(formData.dateResolved).toLocaleDateString() : 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="claims-modal-documents">
              <div className="claims-modal-documents-header">
                <h3 className="claims-modal-section-title">Claim Documents</h3>
                <div className="claims-modal-documents-actions">
                  <div className="claims-modal-search-wrapper">
                    <Search className="claims-modal-search-icon" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="claims-modal-search-input"
                    />
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => setShowAddDocument(true)}
                      className="claims-modal-btn primary"
                    >
                      <Plus className="claims-modal-btn-icon" />
                      Add Document
                    </button>
                  )}
                </div>
              </div>

              {showAddDocument && (
                <div className="claims-modal-add-document">
                  <h4>Add New Document</h4>
                  <div className="claims-modal-form-grid">
                    <div className="claims-modal-form-group">
                      <label>Document Name</label>
                      <input
                        type="text"
                        value={newDocument.name}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                        className="claims-modal-input"
                        placeholder="Document name"
                      />
                    </div>
                    <div className="claims-modal-form-group">
                      <label>Document Type</label>
                      <select
                        value={newDocument.type}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                        className="claims-modal-select"
                      >
                        <option value="">Select Type</option>
                        {documentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="claims-modal-form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={newDocument.description}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Document description..."
                        className="claims-modal-textarea"
                        rows="2"
                      />
                    </div>
                  </div>
                  <div className="claims-modal-document-actions">
                    <button onClick={() => setShowAddDocument(false)} className="claims-modal-btn cancel">
                      Cancel
                    </button>
                    <button onClick={addDocument} className="claims-modal-btn primary">
                      Add Document
                    </button>
                  </div>
                </div>
              )}

              <div className="claims-modal-documents-list">
                {filteredDocuments.map(doc => (
                  <div key={doc.id} className="claims-modal-document-card">
                    <div className="claims-modal-document-info">
                      <Paperclip className="claims-modal-document-icon" />
                      <div>
                        <div className="claims-modal-document-name">{doc.name}</div>
                        <div className="claims-modal-document-details">
                          <span className="claims-modal-document-type">{doc.type}</span>
                          <span>•</span>
                          <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>By: {doc.uploadedBy}</span>
                        </div>
                        {doc.description && (
                          <div className="claims-modal-document-description">{doc.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="claims-modal-document-actions">
                      <button className="claims-modal-btn secondary">
                        <Eye className="claims-modal-btn-icon" />
                        View
                      </button>
                      <button className="claims-modal-btn secondary">
                        <Download className="claims-modal-btn-icon" />
                        Download
                      </button>
                      {isEditing && (
                        <button 
                          onClick={() => removeDocument(doc.id)}
                          className="claims-modal-btn danger"
                        >
                          <Trash2 className="claims-modal-btn-icon" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="claims-modal-empty-state">
                  <Paperclip className="claims-modal-empty-icon" />
                  <p>{searchTerm ? 'No documents found matching your search' : 'No documents uploaded for this claim'}</p>
                  {isEditing && !searchTerm && (
                    <button 
                      onClick={() => setShowAddDocument(true)}
                      className="claims-modal-btn primary"
                    >
                      Upload First Document
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="claims-modal-notes">
              <div className="claims-modal-notes-header">
                <h3 className="claims-modal-section-title">Claim Notes</h3>
                {isEditing && (
                  <button 
                    onClick={() => setShowAddNote(true)}
                    className="claims-modal-btn primary"
                  >
                    <Plus className="claims-modal-btn-icon" />
                    Add Note
                  </button>
                )}
              </div>

              {showAddNote && (
                <div className="claims-modal-add-note">
                  <h4>Add New Note</h4>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note..."
                    className="claims-modal-textarea"
                    rows="3"
                  />
                  <div className="claims-modal-note-actions">
                    <button onClick={() => setShowAddNote(false)} className="claims-modal-btn cancel">
                      Cancel
                    </button>
                    <button onClick={addNote} className="claims-modal-btn primary">
                      Add Note
                    </button>
                  </div>
                </div>
              )}

              <div className="claims-modal-notes-list">
                {formData.notes.map(note => (
                  <div key={note.id} className="claims-modal-note-card">
                    <div className="claims-modal-note-header">
                      <div className="claims-modal-note-author">{note.author}</div>
                      <div className="claims-modal-note-date">
                        {new Date(note.date).toLocaleDateString()} {new Date(note.date).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="claims-modal-note-content">{note.text}</div>
                  </div>
                ))}
              </div>

              {formData.notes.length === 0 && (
                <div className="claims-modal-empty-state">
                  <MessageSquare className="claims-modal-empty-icon" />
                  <p>No notes available for this claim</p>
                  {isEditing && (
                    <button 
                      onClick={() => setShowAddNote(true)}
                      className="claims-modal-btn primary"
                    >
                      Add First Note
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

export default ClaimsManagementModal;
