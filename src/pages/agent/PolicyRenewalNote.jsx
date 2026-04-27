import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Clock, AlertCircle, CheckCircle, Shield, Calendar, DollarSign, Download, RotateCcw, User } from 'lucide-react';
import './PolicyRenewalNote.css';

import apiService from '../../services/api';

const PolicyRenewalNote = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [firstParagraph, setFirstParagraph] = useState('');
  const [secondParagraph, setSecondParagraph] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedNote, setGeneratedNote] = useState(null);

  // Data states
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const transactionsData = await apiService.getRenewals();
        setTransactions(transactionsData.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(transaction =>
    transaction.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.policy_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.insurer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowTransactionPopup(value.length > 0);
  };

  // Handle transaction selection
  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction);
    setSearchTerm(transaction.policy_number || transaction.id);
    setShowTransactionPopup(false);

    // Load renewal note content based on transaction
    setFirstParagraph(`Dear ${transaction.client_name},\n\nWe are writing to inform you that your policy ${transaction.policy_number} with ${transaction.insurer} is due for renewal. Your current policy is set to expire on ${transaction.expiry_date}.`);
    setSecondParagraph(`We value your continued trust in our services and would like to offer you the opportunity to renew your policy. Please contact us at your earliest convenience to discuss the renewal terms and ensure continuous coverage.`);
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    if (!selectedTransaction) {
      alert('Please select a transaction first');
      return;
    }
    if (!firstParagraph || !secondParagraph) {
      alert('Please complete both paragraphs before generating PDF');
      return;
    }

    // Create PDF content
    const pdfContent = `
      <html>
        <head>
          <title>Policy Renewal Notice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Policy Renewal Notice</h1>
            <p>Policy Number: ${selectedTransaction.policy_number}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="content">
            <p>${firstParagraph}</p>
            <p>${secondParagraph}</p>
            <hr>
            <h3>Policy Details:</h3>
            <p>Policy Number: ${selectedTransaction.policy_number}</p>
            <p>Insurer: ${selectedTransaction.insurer}</p>
            <p>Product: ${selectedTransaction.product}</p>
            <p>Expiry Date: ${selectedTransaction.expiry_date}</p>
            <p>Premium: KES ${Number(selectedTransaction.premium || 0).toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renewal-notice-${selectedTransaction.policy_number || selectedTransaction.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success modal
    setGeneratedNote({
      policy_number: selectedTransaction.policy_number,
      client_name: selectedTransaction.client_name,
      policy_number_display: selectedTransaction.policy_number,
      generatedAt: new Date().toLocaleString()
    });
    setShowSuccessModal(true);
  };

  // Reset form
  const handleReset = () => {
    setSelectedTransaction(null);
    setSearchTerm('');
    setFirstParagraph('');
    setSecondParagraph('');
    setShowTransactionPopup(false);
  };

  return (
    <div className="renewal-note-container">
      {/* Header */}
      <div className="renewal-note-header">
        <div className="renewal-note-header-content">
          <div className="renewal-note-header-left">
            <h1 className="renewal-note-title">Policy Renewal Note</h1>
            <p className="renewal-note-subtitle">Generate renewal notices for clients whose policies are about to expire or have expired</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="renewal-note-main-content">
        {/* Left Panel - Form */}
        <div className="renewal-note-left-panel">
          {/* Previous Transaction Search */}
          <div className="renewal-note-section">
            <h3 className="renewal-note-section-title">Search Previous Transaction</h3>
            <div className="renewal-note-search-wrapper">
              <Search className="renewal-note-search-icon" />
              <input
                type="text"
                placeholder="Search by transaction ID, policy number, or insurer..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowTransactionPopup(searchTerm.length > 0)}
                className="renewal-note-search-input"
              />
              {showTransactionPopup && filteredTransactions.length > 0 && (
                <div className="renewal-note-client-popup">
                  {filteredTransactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="renewal-note-client-option"
                      onClick={() => handleTransactionSelect(transaction)}
                    >
                      <div className="renewal-note-client-name">{transaction.policy_number || transaction.id}</div>
                      <div className="renewal-note-client-details">
                        {transaction.client_name} | {transaction.policy_number} | {transaction.insurer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Note Content */}
          <div className="renewal-note-section">
            <h3 className="renewal-note-section-title">Renewal Notice Content</h3>
            
            <div className="renewal-note-form-group">
              <label className="renewal-note-form-label">First Paragraph *</label>
              <textarea
                placeholder="Enter first paragraph of renewal notice..."
                value={firstParagraph}
                onChange={(e) => setFirstParagraph(e.target.value)}
                className="renewal-note-form-textarea"
                rows="6"
                disabled={!selectedTransaction}
              />
            </div>

            <div className="renewal-note-form-group">
              <label className="renewal-note-form-label">Second Paragraph *</label>
              <textarea
                placeholder="Enter second paragraph of renewal notice..."
                value={secondParagraph}
                onChange={(e) => setSecondParagraph(e.target.value)}
                className="renewal-note-form-textarea"
                rows="6"
                disabled={!selectedTransaction}
              />
            </div>

            {/* Action Buttons */}
            <div className="renewal-note-actions">
              <button
                className="renewal-note-btn renewal-note-btn-primary"
                onClick={handleGeneratePDF}
                disabled={!selectedTransaction || !firstParagraph || !secondParagraph}
              >
                <Download className="renewal-note-btn-icon" />
                Generate PDF
              </button>
              <button
                className="renewal-note-btn renewal-note-btn-secondary"
                onClick={handleReset}
              >
                <RotateCcw className="renewal-note-btn-icon" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Details */}
        <div className="renewal-note-right-panel">
          <div className="renewal-note-details-card">
            <h3 className="renewal-note-details-title">Renewal Details</h3>
              
              {/* Policy Details */}
              <div className="renewal-note-details-section">
                <h4 className="renewal-note-details-subtitle">Policy Information</h4>
                <div className="renewal-note-details-grid">
                  <div className="renewal-note-detail-item">
                    <FileText className="renewal-note-detail-icon" />
                    <div className="renewal-note-detail-content">
                      <span className="renewal-note-detail-label">Policy Number</span>
                      <span className="renewal-note-detail-value">{selectedTransaction ? selectedTransaction.policy_number : '-'}</span>
                    </div>
                  </div>
                  <div className="renewal-note-detail-item">
                    <Shield className="renewal-note-detail-icon" />
                    <div className="renewal-note-detail-content">
                      <span className="renewal-note-detail-label">Product</span>
                      <span className="renewal-note-detail-value">{selectedTransaction ? selectedTransaction.product : '-'}</span>
                    </div>
                  </div>
                  <div className="renewal-note-detail-item">
                    <User className="renewal-note-detail-icon" />
                    <div className="renewal-note-detail-content">
                      <span className="renewal-note-detail-label">Client</span>
                      <span className="renewal-note-detail-value">{selectedTransaction ? selectedTransaction.client_name : '-'}</span>
                    </div>
                  </div>
                  <div className="renewal-note-detail-item">
                    <Shield className="renewal-note-detail-icon" />
                    <div className="renewal-note-detail-content">
                      <span className="renewal-note-detail-label">Insurer</span>
                      <span className="renewal-note-detail-value">{selectedTransaction ? selectedTransaction.insurer : '-'}</span>
                    </div>
                  </div>
                  <div className="renewal-note-detail-item">
                    <Calendar className="renewal-note-detail-icon" />
                    <div className="renewal-note-detail-content">
                      <span className="renewal-note-detail-label">Start Date</span>
                      <span className="renewal-note-detail-value">{selectedTransaction ? selectedTransaction.start_date : '-'}</span>
                    </div>
                  </div>
                  <div className="renewal-note-detail-item">
                    <AlertCircle className="renewal-note-detail-icon" />
                    <div className="renewal-note-detail-content">
                      <span className="renewal-note-detail-label">Expiry Date</span>
                      <span className="renewal-note-detail-value">{selectedTransaction ? selectedTransaction.expiry_date : '-'}</span>
                    </div>
                  </div>
                  <div className="renewal-note-detail-item">
                    <DollarSign className="renewal-note-detail-icon" />
                    <div className="renewal-note-detail-content">
                      <span className="renewal-note-detail-label">Premium</span>
                      <span className="renewal-note-detail-value">KES {selectedTransaction ? Number(selectedTransaction.premium || 0).toLocaleString() : '0'}</span>
                    </div>
                  </div>
                  <div className="renewal-note-detail-item">
                    <Clock className="renewal-note-detail-icon" />
                    <div className="renewal-note-detail-content">
                      <span className="renewal-note-detail-label">Status</span>
                      <span className="renewal-note-detail-value">{selectedTransaction ? selectedTransaction.status : '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && generatedNote && (
        <div className="renewal-note-modal-overlay">
          <div className="renewal-note-modal">
            <div className="renewal-note-modal-header">
              <h2 className="renewal-note-modal-title">Renewal Note Generated Successfully!</h2>
              <button 
                className="renewal-note-modal-close"
                onClick={() => setShowSuccessModal(false)}
              >
                <X className="renewal-note-modal-close-icon" />
              </button>
            </div>
            <div className="renewal-note-modal-body">
              <div className="renewal-note-success-content">
                <div className="renewal-note-success-icon">
                  <CheckCircle size={48} color="#10b981" />
                </div>
                <h3 className="renewal-note-success-title">Certificate Generated</h3>
                <p className="renewal-note-success-message">
                  The renewal notice has been generated and downloaded successfully.
                </p>
                <div className="renewal-note-success-details">
                  <div className="renewal-note-success-item">
                    <span className="renewal-note-success-label">Client:</span>
                    <span className="renewal-note-success-value">{generatedNote.client_name}</span>
                  </div>
                  <div className="renewal-note-success-item">
                    <span className="renewal-note-success-label">Policy:</span>
                    <span className="renewal-note-success-value">{generatedNote.policy_number_display}</span>
                  </div>
                  <div className="renewal-note-success-item">
                    <span className="renewal-note-success-label">Date:</span>
                    <span className="renewal-note-success-value">{generatedNote.generatedAt}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="renewal-note-modal-footer">
              <button 
                className="renewal-note-btn renewal-note-btn-primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  handleReset();
                }}
              >
                Create New Note
              </button>
              <button 
                className="renewal-note-btn renewal-note-btn-secondary"
                onClick={() => setShowSuccessModal(false)}
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
