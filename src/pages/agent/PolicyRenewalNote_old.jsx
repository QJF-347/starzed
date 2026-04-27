import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Trash2, FileSpreadsheet, X, ArrowLeft, FileText, Calendar, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './PolicyRenewalNote.css';

const PolicyRenewalNote = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [noteType, setNoteType] = useState('');
  const [status, setStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [renewalNotes, setRenewalNotes] = useState([
    {
      id: 1,
      clientName: 'John Kamau Njoroge',
      policyNumber: 'POL-2024-001',
      renewalNumber: 'REN-2024-001',
      noteDate: '2024-01-10',
      noteType: 'Renewal Reminder',
      subject: 'Annual Policy Renewal Due',
      noteContent: 'Client contacted for annual renewal. Premium increased by 8% due to inflation adjustments. Client agreed to renewal terms.',
      priority: 'High',
      status: 'Completed',
      nextFollowUp: '2024-01-15',
      category: 'Motor',
      productType: 'Comprehensive Motor Insurance'
    },
    {
      id: 2,
      clientName: 'Mary Wanjiru Kimani',
      policyNumber: 'POL-2024-002',
      renewalNumber: 'REN-2024-002',
      noteDate: '2024-02-15',
      noteType: 'Payment Follow-up',
      subject: 'Renewal Payment Pending',
      noteContent: 'Client yet to make renewal payment. Follow-up call scheduled. Payment due by end of month.',
      priority: 'Medium',
      status: 'Pending',
      nextFollowUp: '2024-02-20',
      category: 'Motor',
      productType: 'Third Party Motor Insurance'
    },
    {
      id: 3,
      clientName: 'David Ochieng Otieno',
      policyNumber: 'POL-2024-003',
      renewalNumber: 'REN-2024-003',
      noteDate: '2024-03-20',
      noteType: 'Documentation Update',
      subject: 'Updated Renewal Documents',
      noteContent: 'New renewal documents prepared and sent to client. Additional coverage requested.',
      priority: 'Low',
      status: 'Completed',
      nextFollowUp: '2024-03-25',
      category: 'Non-Motor',
      productType: 'Fire Insurance'
    },
    {
      id: 4,
      clientName: 'Sarah Kamau Mwangi',
      policyNumber: 'POL-2024-004',
      renewalNumber: 'REN-2024-004',
      noteDate: '2024-04-05',
      noteType: 'Special Conditions',
      subject: 'Renewal with Special Conditions',
      noteContent: 'Client requested special conditions for renewal including additional driver coverage and reduced excess.',
      priority: 'High',
      status: 'Processing',
      nextFollowUp: '2024-04-10',
      category: 'Accidental and Medical',
      productType: 'Personal Accident Insurance'
    },
    {
      id: 5,
      clientName: 'Peter Njoroge Kariuki',
      policyNumber: 'POL-2024-005',
      renewalNumber: 'REN-2024-005',
      noteDate: '2024-04-15',
      noteType: 'Client Communication',
      subject: 'Renewal Confirmation Received',
      noteContent: 'Client confirmed renewal via email. All documentation signed and returned. Payment processed successfully.',
      priority: 'Low',
      status: 'Completed',
      nextFollowUp: '2025-04-10',
      category: 'Motor',
      productType: 'Motor Commercial Insurance'
    }
  ]);

  const noteTypeOptions = [
    { value: 'All', label: 'All Types' },
    { value: 'Renewal Reminder', label: 'Renewal Reminder' },
    { value: 'Payment Follow-up', label: 'Payment Follow-up' },
    { value: 'Documentation Update', label: 'Documentation Update' },
    { value: 'Special Conditions', label: 'Special Conditions' },
    { value: 'Client Communication', label: 'Client Communication' },
    { value: 'Underwriting Note', label: 'Underwriting Note' },
    { value: 'Compliance Check', label: 'Compliance Check' }
  ];

  const statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Overdue', label: 'Overdue' }
  ];

  const priorityOptions = ['High', 'Medium', 'Low'];

  const filteredNotes = renewalNotes.filter(note => {
    const matchesSearch = searchTerm === '' || 
      note.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.renewalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = noteType === '' || noteType === 'All' || note.noteType === noteType;
    const matchesStatus = status === '' || status === 'All' || note.status === status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const openViewModal = (note) => {
    setSelectedNote(note);
    setShowViewModal(true);
  };

  const exportToExcel = () => {
    const data = filteredNotes.map(note => ({
      'Client Name': note.clientName,
      'Policy Number': note.policyNumber,
      'Renewal Number': note.renewalNumber,
      'Note Date': note.noteDate,
      'Note Type': note.noteType,
      'Subject': note.subject,
      'Note Content': note.noteContent,
      'Priority': note.priority,
      'Status': note.status,
      'Next Follow-up': note.nextFollowUp,
      'Category': note.category,
      'Product Type': note.productType
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `policy_renewal_notes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle className="status-icon completed" />;
      case 'Pending': return <Clock className="status-icon pending" />;
      case 'Processing': return <AlertCircle className="status-icon processing" />;
      case 'Overdue': return <X className="status-icon overdue" />;
      default: return <AlertCircle className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'status-completed';
      case 'Pending': return 'status-pending';
      case 'Processing': return 'status-processing';
      case 'Overdue': return 'status-overdue';
      default: return 'status-default';
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  return (
    <div className="policy-renewal-note-container">
      {/* Header */}
      <div className="policy-renewal-note-header">
        <div className="policy-renewal-note-header-content">
          <div className="policy-renewal-note-header-left">
            <h1 className="policy-renewal-note-title">Policy Renewal Note</h1>
            <p className="policy-renewal-note-subtitle">Manage renewal notes and follow-up communications</p>
          </div>
          <div className="policy-renewal-note-header-actions">
            <button className="policy-renewal-note-btn" onClick={exportToExcel}>
              <FileSpreadsheet className="policy-renewal-note-btn-icon" />
              Export to Excel
            </button>
            <button className="policy-renewal-note-btn primary" onClick={() => setShowAddModal(true)}>
              <Plus className="policy-renewal-note-btn-icon" />
              New Note
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="policy-renewal-note-filter-section">
        <div className="policy-renewal-note-filter-grid">
          {/* Search */}
          <div className="policy-renewal-note-filter-group">
            <label className="policy-renewal-note-filter-label">Search</label>
            <div className="policy-renewal-note-search-wrapper">
              <Search className="policy-renewal-note-search-icon" />
              <input
                type="text"
                placeholder="Search by client name, policy number, renewal number, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="policy-renewal-note-search-input"
              />
            </div>
          </div>

          {/* Note Type Filter */}
          <div className="policy-renewal-note-filter-group">
            <label className="policy-renewal-note-filter-label">Note Type</label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="policy-renewal-note-filter-select"
            >
              {noteTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="policy-renewal-note-filter-group">
            <label className="policy-renewal-note-filter-label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="policy-renewal-note-filter-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="policy-renewal-note-stats-grid">
        <div className="policy-renewal-note-stat-card">
          <div className="policy-renewal-note-stat-content">
            <div className="policy-renewal-note-stat-info">
              <p className="policy-renewal-note-stat-title">Total Notes</p>
              <p className="policy-renewal-note-stat-value">{filteredNotes.length}</p>
            </div>
            <div className="policy-renewal-note-stat-icon-wrapper blue">
              <FileText className="policy-renewal-note-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policy-renewal-note-stat-card">
          <div className="policy-renewal-note-stat-content">
            <div className="policy-renewal-note-stat-info">
              <p className="policy-renewal-note-stat-title">Completed</p>
              <p className="policy-renewal-note-stat-value">{filteredNotes.filter(n => n.status === 'Completed').length}</p>
            </div>
            <div className="policy-renewal-note-stat-icon-wrapper green">
              <CheckCircle className="policy-renewal-note-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policy-renewal-note-stat-card">
          <div className="policy-renewal-note-stat-content">
            <div className="policy-renewal-note-stat-info">
              <p className="policy-renewal-note-stat-title">Pending</p>
              <p className="policy-renewal-note-stat-value">{filteredNotes.filter(n => n.status === 'Pending').length}</p>
            </div>
            <div className="policy-renewal-note-stat-icon-wrapper orange">
              <Clock className="policy-renewal-note-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policy-renewal-note-stat-card">
          <div className="policy-renewal-note-stat-content">
            <div className="policy-renewal-note-stat-info">
              <p className="policy-renewal-note-stat-title">High Priority</p>
              <p className="policy-renewal-note-stat-value">{filteredNotes.filter(n => n.priority === 'High').length}</p>
            </div>
            <div className="policy-renewal-note-stat-icon-wrapper red">
              <AlertCircle className="policy-renewal-note-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Notes Table */}
      <div className="policy-renewal-note-table-container">
        <div className="policy-renewal-note-table-wrapper">
          <table className="policy-renewal-note-table">
            <thead className="policy-renewal-note-table-head">
              <tr className="policy-renewal-note-table-row">
                <th className="policy-renewal-note-table-header">Client Information</th>
                <th className="policy-renewal-note-table-header">Policy Details</th>
                <th className="policy-renewal-note-table-header">Note Details</th>
                <th className="policy-renewal-note-table-header">Priority & Status</th>
                <th className="policy-renewal-note-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="policy-renewal-note-table-body">
              {filteredNotes.map((note) => (
                <tr key={note.id} className="policy-renewal-note-table-row">
                  <td className="policy-renewal-note-table-cell">
                    <div className="policy-renewal-note-client-info">
                      <div className="policy-renewal-note-client-name">{note.clientName}</div>
                    </div>
                  </td>
                  <td className="policy-renewal-note-table-cell">
                    <div className="policy-renewal-note-policy-info">
                      <div className="policy-renewal-note-policy-number">{note.policyNumber}</div>
                      <div className="policy-renewal-note-renewal-number">{note.renewalNumber}</div>
                      <div className="policy-renewal-note-product-type">{note.productType}</div>
                    </div>
                  </td>
                  <td className="policy-renewal-note-table-cell">
                    <div className="policy-renewal-note-note-info">
                      <div className="policy-renewal-note-date">{note.noteDate}</div>
                      <div className="policy-renewal-note-type">{note.noteType}</div>
                      <div className="policy-renewal-note-subject">{note.subject}</div>
                      <div className="policy-renewal-note-content">{note.noteContent}</div>
                      <div className="policy-renewal-note-followup">
                        <span className="policy-renewal-note-followup-label">Follow-up:</span>
                        <span className="policy-renewal-note-followup-date">{note.nextFollowUp}</span>
                      </div>
                    </div>
                  </td>
                  <td className="policy-renewal-note-table-cell">
                    <div className="policy-renewal-note-status-info">
                      <div className={`policy-renewal-note-priority ${getPriorityClass(note.priority)}`}>
                        {note.priority}
                      </div>
                      <div className="policy-renewal-note-status-item">
                        {getStatusIcon(note.status)}
                        <span className={`policy-renewal-note-status-text ${getStatusClass(note.status)}`}>
                          {note.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="policy-renewal-note-table-cell">
                    <div className="policy-renewal-note-actions">
                      <button className="policy-renewal-note-action-btn view" onClick={() => openViewModal(note)}>
                        <Eye className="policy-renewal-note-action-icon" />
                      </button>
                      <button className="policy-renewal-note-action-btn edit">
                        <Edit className="policy-renewal-note-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Note Modal */}
      {showViewModal && selectedNote && (
        <div className="policy-renewal-note-modal-overlay">
          <div className="policy-renewal-note-modal">
            <div className="policy-renewal-note-modal-header">
              <h2 className="policy-renewal-note-modal-title">Policy Renewal Note Details</h2>
              <button 
                className="policy-renewal-note-modal-close"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedNote(null);
                }}
              >
                <X className="policy-renewal-note-modal-close-icon" />
              </button>
            </div>
            <div className="policy-renewal-note-modal-body">
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Client Name</label>
                <p className="policy-renewal-note-view-value">{selectedNote.clientName}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Policy Number</label>
                <p className="policy-renewal-note-view-value">{selectedNote.policyNumber}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Renewal Number</label>
                <p className="policy-renewal-note-view-value">{selectedNote.renewalNumber}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Note Date</label>
                <p className="policy-renewal-note-view-value">{selectedNote.noteDate}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Note Type</label>
                <p className="policy-renewal-note-view-value">{selectedNote.noteType}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Subject</label>
                <p className="policy-renewal-note-view-value">{selectedNote.subject}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Note Content</label>
                <p className="policy-renewal-note-view-value">{selectedNote.noteContent}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Priority</label>
                <p className="policy-renewal-note-view-value">{selectedNote.priority}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Status</label>
                <p className="policy-renewal-note-view-value">{selectedNote.status}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Next Follow-up</label>
                <p className="policy-renewal-note-view-value">{selectedNote.nextFollowUp}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Category</label>
                <p className="policy-renewal-note-view-value">{selectedNote.category}</p>
              </div>
              <div className="policy-renewal-note-view-group">
                <label className="policy-renewal-note-view-label">Product Type</label>
                <p className="policy-renewal-note-view-value">{selectedNote.productType}</p>
              </div>
            </div>
            <div className="policy-renewal-note-modal-footer">
              <button 
                className="policy-renewal-note-btn secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedNote(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyRenewalNote;
