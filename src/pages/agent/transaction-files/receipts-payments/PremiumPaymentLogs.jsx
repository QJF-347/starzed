import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, FileText, ArrowLeft, AlertCircle, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import Modal from '../../../../components/Modal';
import '../../../../components/Pagination.css';
import '../../AgentTableEnhancements.css';
import './PremiumPaymentLogs.css';

const PremiumPaymentLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [editingLog, setEditingLog] = useState(null);

  // Fetch payment logs from API
  const fetchPaymentLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/premium-payment-logs/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentLogs(Array.isArray(data.payment_logs) ? data.payment_logs : []);
      } else {
        toast.error(data.message || 'Failed to fetch payment logs');
        setPaymentLogs([]);
      }
    } catch (error) {
      console.error('Error fetching payment logs:', error);
      toast.error('Failed to fetch payment logs: ' + error.message);
      setPaymentLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentLogs();
  }, []);

  // Pagination logic
  const filteredLogs = Array.isArray(paymentLogs) ? paymentLogs.filter(log => 
    log && typeof log === 'object' && (
      (log.transaction_id && typeof log.transaction_id === 'string' && log.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.payment_reference && typeof log.payment_reference === 'string' && log.payment_reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.policy_number && typeof log.policy_number === 'string' && log.policy_number.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  ) : [];

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate payment link
  const generatePaymentLink = async (log) => {
    try {
      setGeneratingLink(true);
      const response = await fetch('/api/generate-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'payment_log',
          amount: log.amount,
          customer_name: log.customer_name,
          policy_number: log.policy_number,
          description: `${log.payment_type} - ${log.description}`,
          transaction_id: log.transaction_id,
          payment_reference: log.payment_reference
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedPaymentLink(data.payment_link);
        setShowPaymentLinkModal(true);
        toast.success('Payment link generated successfully!');
      } else {
        toast.error(data.message || 'Failed to generate payment link');
      }
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Failed to generate payment link');
    } finally {
      setGeneratingLink(false);
    }
  };

  // Copy payment link to clipboard
  const copyPaymentLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedPaymentLink.payment_url);
      setCopiedToClipboard(true);
      toast.success('Payment link copied to clipboard!');
      setTimeout(() => setCopiedToClipboard(false), 3000);
    } catch (error) {
      toast.error('Failed to copy link to clipboard');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-default';
    }
  };

  const openViewModal = (log) => {
    setSelectedLog(log);
    setShowViewModal(true);
  };

  const openEditModal = (log) => {
    setEditingLog({...log});
    setShowEditModal(true);
  };

  const openDeleteModal = (log) => {
    setSelectedLog(log);
    setShowDeleteModal(true);
  };

  const handleEditLog = () => {
    console.log('Updating payment log:', editingLog);
    setShowEditModal(false);
    setEditingLog(null);
  };

  const handleDeleteLog = () => {
    console.log('Deleting payment log:', selectedLog);
    setShowDeleteModal(false);
    setSelectedLog(null);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Premium Payment': return 'text-green-600 bg-green-100';
      case 'Partial Payment': return 'text-yellow-600 bg-yellow-100';
      case 'Refund': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="premium-payment-logs-container">
      {/* Header */}
      <div className="premium-payment-logs-header">
        <div className="premium-payment-logs-header-content">
          <div className="premium-payment-logs-header-left">
            <h1 className="premium-payment-logs-title">Premium Payment Logs</h1>
            <p className="premium-payment-logs-subtitle">Manage and view all premium payment logs</p>
          </div>
          <div className="premium-payment-logs-header-actions">
            <button className="premium-payment-logs-btn">
              <Download className="premium-payment-logs-btn-icon" />
              Export
            </button>
            <button className="premium-payment-logs-btn primary">
              <Plus className="premium-payment-logs-btn-icon" />
              New Log Entry
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="premium-payment-logs-filters">
        <div className="premium-payment-logs-search">
          <Search className="premium-payment-logs-search-icon" />
          <input
            type="text"
            placeholder="Search payment logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="premium-payment-logs-search-input"
          />
        </div>
        <button className="premium-payment-logs-filter-btn">
          <Filter className="premium-payment-logs-filter-icon" />
          Filters
        </button>
      </div>

      {/* Payment Logs Table */}
      <div className="premium-payment-logs-table-container">
        <div className="premium-payment-logs-table-wrapper">
          {loading ? (
            <div className="premium-payment-logs-loading">
              <div className="loading-spinner"></div>
              <p>Loading payment logs...</p>
            </div>
          ) : paymentLogs.length === 0 ? (
            <div className="premium-payment-logs-empty">
              <AlertCircle className="empty-icon" />
              <h3>No Payment Logs Found</h3>
              <p>There are no payment logs to display.</p>
            </div>
          ) : (
            <table className="premium-payment-logs-table">
              <thead className="premium-payment-logs-table-head">
                <tr className="premium-payment-logs-table-row">
                  <th className="premium-payment-logs-table-header">TRANSACTION ID</th>
                  <th className="premium-payment-logs-table-header">POLICY NO.</th>
                  <th className="premium-payment-logs-table-header">CUSTOMER</th>
                  <th className="premium-payment-logs-table-header">AMOUNT</th>
                  <th className="premium-payment-logs-table-header">PAYMENT DATE</th>
                  <th className="premium-payment-logs-table-header">PAYMENT METHOD</th>
                  <th className="premium-payment-logs-table-header">REFERENCE</th>
                  <th className="premium-payment-logs-table-header">STATUS</th>
                  <th className="premium-payment-logs-table-header">INSURER</th>
                  <th className="premium-payment-logs-table-header">PROCESSED BY</th>
                  <th className="premium-payment-logs-table-header">ACTIONs</th>
                </tr>
              </thead>
              <tbody className="premium-payment-logs-table-body">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="premium-payment-logs-table-row">
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-transaction-info">
                        <div className="premium-payment-logs-transaction-id">{log.transaction_id}</div>
                      </div>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-policy-info">
                        <div className="premium-payment-logs-policy">{log.policy_number}</div>
                      </div>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-customer-info">
                        <div className="premium-payment-logs-customer">{log.customer_name}</div>
                      </div>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-amount-info">
                        <div className="premium-payment-logs-amount">KES {log.amount.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-date-info">
                        <div className="premium-payment-logs-date">{log.payment_date}</div>
                      </div>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-pay-mode-info">
                        <div className="premium-payment-logs-pay-mode">{log.payment_method}</div>
                      </div>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-reference-info">
                        <div className="premium-payment-logs-reference">{log.payment_reference}</div>
                      </div>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <span className={`premium-payment-logs-status ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-insurer-info">
                        <div className="premium-payment-logs-insurer">{log.insurer}</div>
                      </div>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-processed-info">
                        <div className="premium-payment-logs-processed">{log.processed_by}</div>
                      </div>
                    </td>
                    <td className="premium-payment-logs-table-cell">
                      <div className="premium-payment-logs-actions">
                        <button className="premium-payment-logs-action-btn view" onClick={() => openViewModal(log)}>
                          <Eye className="premium-payment-logs-action-icon" />
                        </button>
                        <button className="premium-payment-logs-action-btn edit" onClick={() => openEditModal(log)}>
                          <Edit className="premium-payment-logs-action-icon" />
                        </button>
                        <button 
                          className="premium-payment-logs-action-btn share" 
                          onClick={() => generatePaymentLink(log)}
                          disabled={generatingLink}
                        >
                          <Share2 className="premium-payment-logs-action-icon" />
                        </button>
                        <button className="premium-payment-logs-action-btn delete" onClick={() => openDeleteModal(log)}>
                          <Trash2 className="premium-payment-logs-action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} payment logs
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredLogs.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Payment Link Modal */}
      <Modal 
        isOpen={showPaymentLinkModal} 
        onClose={() => {
          setShowPaymentLinkModal(false);
          setGeneratedPaymentLink(null);
          setCopiedToClipboard(false);
        }}
        title="Payment Link Generated"
        size="small"
      >
        {generatedPaymentLink && (
          <div className="payment-link-modal">
            <div className="payment-link-info">
              <div className="payment-link-details">
                <h4>Payment Details</h4>
                <div className="payment-info-grid">
                  <div className="payment-info-item">
                    <label>Customer:</label>
                    <span>{generatedPaymentLink.customer_name}</span>
                  </div>
                  <div className="payment-info-item">
                    <label>Policy Number:</label>
                    <span>{generatedPaymentLink.policy_number}</span>
                  </div>
                  <div className="payment-info-item">
                    <label>Amount:</label>
                    <span>KES {generatedPaymentLink.amount.toLocaleString()}</span>
                  </div>
                  <div className="payment-info-item">
                    <label>Description:</label>
                    <span>{generatedPaymentLink.description || 'Payment'}</span>
                  </div>
                </div>
              </div>
              
              <div className="payment-link-url">
                <h4>Payment Link</h4>
                <div className="payment-link-input-group">
                  <input 
                    type="text" 
                    value={generatedPaymentLink.payment_url} 
                    readOnly 
                    className="payment-link-input"
                  />
                  <button 
                    className="payment-link-copy-btn"
                    onClick={copyPaymentLink}
                  >
                    {copiedToClipboard ? (
                      <Check className="copy-icon" />
                    ) : (
                      <Copy className="copy-icon" />
                    )}
                  </button>
                </div>
                <p className="payment-link-instructions">
                  Share this link with the customer to complete their payment. 
                  Link expires in {generatedPaymentLink.expiry_hours} hours.
                </p>
              </div>
            </div>
            
            <div className="payment-link-actions">
              <button 
                className="premium-payment-logs-btn secondary" 
                onClick={() => {
                  setShowPaymentLinkModal(false);
                  setGeneratedPaymentLink(null);
                  setCopiedToClipboard(false);
                }}
              >
                Close
              </button>
              <button 
                className="premium-payment-logs-btn primary" 
                onClick={copyPaymentLink}
              >
                {copiedToClipboard ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Payment Log Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedLog(null);
        }}
        title="Payment Log Details"
        size="medium"
      >
        {selectedLog && (
          <div className="payment-log-view-modal">
            <div className="payment-log-details-grid">
              <div className="payment-log-detail-item">
                <label>Customer Name:</label>
                <span>{selectedLog.customer_name}</span>
              </div>
              <div className="payment-log-detail-item">
                <label>Policy Number:</label>
                <span>{selectedLog.policy_number}</span>
              </div>
              <div className="payment-log-detail-item">
                <label>Amount:</label>
                <span>KES {selectedLog.amount.toLocaleString()}</span>
              </div>
              <div className="payment-log-detail-item">
                <label>Payment Type:</label>
                <span className={`payment-type ${getTypeColor(selectedLog.payment_type)}`}>
                  {selectedLog.payment_type}
                </span>
              </div>
              <div className="payment-log-detail-item">
                <label>Transaction ID:</label>
                <span>{selectedLog.transaction_id}</span>
              </div>
              <div className="payment-log-detail-item">
                <label>Payment Reference:</label>
                <span>{selectedLog.payment_reference}</span>
              </div>
              <div className="payment-log-detail-item">
                <label>Status:</label>
                <span className={`payment-status ${getStatusColor(selectedLog.status)}`}>
                  {selectedLog.status}
                </span>
              </div>
              <div className="payment-log-detail-item">
                <label>Insurer:</label>
                <span>{selectedLog.insurer}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Payment Log Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setEditingLog(null);
        }}
        title="Edit Payment Log"
        size="medium"
      >
        {editingLog && (
          <div className="payment-log-edit-modal">
            <div className="payment-log-edit-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={editingLog.customer_name}
                  onChange={(e) => setEditingLog({...editingLog, customer_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingLog.status}
                  onChange={(e) => setEditingLog({...editingLog, status: e.target.value})}
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="premium-payment-logs-btn secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="premium-payment-logs-btn primary" onClick={handleEditLog}>
                Update Payment Log
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedLog(null);
        }}
        title="Delete Payment Log"
        size="small"
      >
        {selectedLog && (
          <div className="payment-log-delete-modal">
            <p>Are you sure you want to delete payment log for {selectedLog.customer_name}?</p>
            <div className="modal-actions">
              <button className="premium-payment-logs-btn secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="premium-payment-logs-btn danger" onClick={handleDeleteLog}>
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PremiumPaymentLogs;
