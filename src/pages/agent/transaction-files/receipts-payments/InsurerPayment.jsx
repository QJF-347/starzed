import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, FileText, ArrowLeft, AlertCircle, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import Modal from '../../../../components/Modal';
import '../../../../components/Pagination.css';
import '../../AgentTableEnhancements.css';
import './InsurerPayment.css';

const InsurerPayment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [insurerPayments, setInsurerPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  // Fetch insurer payments from API
  const fetchInsurerPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/insurer-payments/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setInsurerPayments(Array.isArray(data.insurer_payments) ? data.insurer_payments : []);
      } else {
        toast.error(data.message || 'Failed to fetch insurer payments');
        setInsurerPayments([]);
      }
    } catch (error) {
      console.error('Error fetching insurer payments:', error);
      toast.error('Failed to fetch insurer payments: ' + error.message);
      setInsurerPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurerPayments();
  }, []);

  // Pagination logic
  const filteredPayments = Array.isArray(insurerPayments) ? insurerPayments.filter(payment => 
    payment && typeof payment === 'object' && (
      (payment.payment_id && typeof payment.payment_id === 'string' && payment.payment_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.insurer_name && typeof payment.insurer_name === 'string' && payment.insurer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.policy_number && typeof payment.policy_number === 'string' && payment.policy_number.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  ) : [];

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate payment link
  const generatePaymentLink = async (payment) => {
    try {
      setGeneratingLink(true);
      const response = await fetch('/api/generate-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'insurer_payment',
          amount: payment.amount,
          customer_name: payment.insurer_name,
          policy_number: payment.policy_number,
          description: payment.description,
          payment_id: payment.payment_id,
          reference_number: payment.reference_number,
          insurer_name: payment.insurer_name
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

  const openViewModal = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const openEditModal = (payment) => {
    setEditingPayment({...payment});
    setShowEditModal(true);
  };

  const openDeleteModal = (payment) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  const handleEditPayment = () => {
    console.log('Updating insurer payment:', editingPayment);
    setShowEditModal(false);
    setEditingPayment(null);
  };

  const handleDeletePayment = () => {
    console.log('Deleting insurer payment:', selectedPayment);
    setShowDeleteModal(false);
    setSelectedPayment(null);
  };

  return (
    <div className="insurer-payment-container">
      {/* Header */}
      <div className="insurer-payment-header">
        <div className="insurer-payment-header-content">
          <div className="insurer-payment-header-left">
            <h1 className="insurer-payment-title">Insurer Payment</h1>
            <p className="insurer-payment-subtitle">Manage and view all insurer payments</p>
          </div>
          <div className="insurer-payment-header-actions">
            <button className="insurer-payment-btn">
              <Download className="insurer-payment-btn-icon" />
              Export
            </button>
            <button className="insurer-payment-btn primary">
              <Plus className="insurer-payment-btn-icon" />
              New Payment
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="insurer-payment-filters">
        <div className="insurer-payment-search">
          <Search className="insurer-payment-search-icon" />
          <input
            type="text"
            placeholder="Search insurer payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="insurer-payment-search-input"
          />
        </div>
        <button className="insurer-payment-filter-btn">
          <Filter className="insurer-payment-filter-icon" />
          Filters
        </button>
      </div>

      {/* Insurer Payments Table */}
      <div className="insurer-payment-table-container">
        <div className="insurer-payment-table-wrapper">
          {loading ? (
            <div className="insurer-payment-loading">
              <div className="loading-spinner"></div>
              <p>Loading insurer payments...</p>
            </div>
          ) : insurerPayments.length === 0 ? (
            <div className="insurer-payment-empty">
              <AlertCircle className="empty-icon" />
              <h3>No Insurer Payments Found</h3>
              <p>There are no insurer payments to display.</p>
            </div>
          ) : (
            <table className="insurer-payment-table">
              <thead className="insurer-payment-table-head">
                <tr className="insurer-payment-table-row">
                  <th className="insurer-payment-table-header">PAYMENT ID</th>
                  <th className="insurer-payment-table-header">INSURER NAME</th>
                  <th className="insurer-payment-table-header">POLICY NO.</th>
                  <th className="insurer-payment-table-header">AMOUNT</th>
                  <th className="insurer-payment-table-header">PAYMENT DATE</th>
                  <th className="insurer-payment-table-header">PAYMENT METHOD</th>
                  <th className="insurer-payment-table-header">STATUS</th>
                  <th className="insurer-payment-table-header">REFERENCE</th>
                  <th className="insurer-payment-table-header">DESCRIPTION</th>
                  <th className="insurer-payment-table-header">ACTIONs</th>
                </tr>
              </thead>
              <tbody className="insurer-payment-table-body">
                {paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="insurer-payment-table-row">
                    <td className="insurer-payment-table-cell">
                      <div className="insurer-payment-id-info">
                        <div className="insurer-payment-id">{payment.payment_id}</div>
                      </div>
                    </td>
                    <td className="insurer-payment-table-cell">
                      <div className="insurer-payment-insurer-info">
                        <div className="insurer-payment-insurer">{payment.insurer_name}</div>
                      </div>
                    </td>
                    <td className="insurer-payment-table-cell">
                      <div className="insurer-payment-policy-info">
                        <div className="insurer-payment-policy-no">{payment.policy_number}</div>
                      </div>
                    </td>
                    <td className="insurer-payment-table-cell">
                      <div className="insurer-payment-amount-info">
                        <div className="insurer-payment-amount">KES {payment.amount.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="insurer-payment-table-cell">
                      <div className="insurer-payment-date-info">
                        <div className="insurer-payment-date">{payment.payment_date}</div>
                      </div>
                    </td>
                    <td className="insurer-payment-table-cell">
                      <div className="insurer-payment-method-info">
                        <div className="insurer-payment-method">{payment.payment_method}</div>
                      </div>
                    </td>
                    <td className="insurer-payment-table-cell">
                      <span className={`insurer-payment-status ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="insurer-payment-table-cell">
                      <div className="insurer-payment-reference-info">
                        <div className="insurer-payment-reference">{payment.reference_number}</div>
                      </div>
                    </td>
                    <td className="insurer-payment-table-cell">
                      <div className="insurer-payment-description-info">
                        <div className="insurer-payment-description">{payment.description}</div>
                      </div>
                    </td>
                    <td className="insurer-payment-table-cell">
                      <div className="insurer-payment-actions">
                        <button className="insurer-payment-action-btn view" onClick={() => openViewModal(payment)}>
                          <Eye className="insurer-payment-action-icon" />
                        </button>
                        <button className="insurer-payment-action-btn edit" onClick={() => openEditModal(payment)}>
                          <Edit className="insurer-payment-action-icon" />
                        </button>
                        <button 
                          className="insurer-payment-action-btn share" 
                          onClick={() => generatePaymentLink(payment)}
                          disabled={generatingLink}
                        >
                          <Share2 className="insurer-payment-action-icon" />
                        </button>
                        <button className="insurer-payment-action-btn delete" onClick={() => openDeleteModal(payment)}>
                          <Trash2 className="insurer-payment-action-icon" />
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} insurer payments
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredPayments.length}
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
                    <label>Insurer:</label>
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
                    <span>{generatedPaymentLink.description || 'Insurer Payment'}</span>
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
                  Share this link with the insurer to complete their payment. 
                  Link expires in {generatedPaymentLink.expiry_hours} hours.
                </p>
              </div>
            </div>
            
            <div className="payment-link-actions">
              <button 
                className="insurer-payment-btn secondary" 
                onClick={() => {
                  setShowPaymentLinkModal(false);
                  setGeneratedPaymentLink(null);
                  setCopiedToClipboard(false);
                }}
              >
                Close
              </button>
              <button 
                className="insurer-payment-btn primary" 
                onClick={copyPaymentLink}
              >
                {copiedToClipboard ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Insurer Payment Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedPayment(null);
        }}
        title="Insurer Payment Details"
        size="medium"
      >
        {selectedPayment && (
          <div className="insurer-payment-view-modal">
            <div className="insurer-payment-details-grid">
              <div className="insurer-payment-detail-item">
                <label>Insurer Name:</label>
                <span>{selectedPayment.insurer_name}</span>
              </div>
              <div className="insurer-payment-detail-item">
                <label>Policy Number:</label>
                <span>{selectedPayment.policy_number}</span>
              </div>
              <div className="insurer-payment-detail-item">
                <label>Amount:</label>
                <span>KES {selectedPayment.amount.toLocaleString()}</span>
              </div>
              <div className="insurer-payment-detail-item">
                <label>Payment ID:</label>
                <span>{selectedPayment.payment_id}</span>
              </div>
              <div className="insurer-payment-detail-item">
                <label>Reference Number:</label>
                <span>{selectedPayment.reference_number}</span>
              </div>
              <div className="insurer-payment-detail-item">
                <label>Description:</label>
                <span>{selectedPayment.description}</span>
              </div>
              <div className="insurer-payment-detail-item">
                <label>Status:</label>
                <span className={`insurer-payment-status ${getStatusColor(selectedPayment.status)}`}>
                  {selectedPayment.status}
                </span>
              </div>
              <div className="insurer-payment-detail-item">
                <label>Payment Date:</label>
                <span>{selectedPayment.payment_date}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Insurer Payment Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setEditingPayment(null);
        }}
        title="Edit Insurer Payment"
        size="medium"
      >
        {editingPayment && (
          <div className="insurer-payment-edit-modal">
            <div className="insurer-payment-edit-form">
              <div className="form-group">
                <label>Insurer Name</label>
                <input
                  type="text"
                  value={editingPayment.insurer_name}
                  onChange={(e) => setEditingPayment({...editingPayment, insurer_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingPayment.status}
                  onChange={(e) => setEditingPayment({...editingPayment, status: e.target.value})}
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="insurer-payment-btn secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="insurer-payment-btn primary" onClick={handleEditPayment}>
                Update Payment
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
          setSelectedPayment(null);
        }}
        title="Delete Insurer Payment"
        size="small"
      >
        {selectedPayment && (
          <div className="insurer-payment-delete-modal">
            <p>Are you sure you want to delete payment from {selectedPayment.insurer_name}?</p>
            <div className="modal-actions">
              <button className="insurer-payment-btn secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="insurer-payment-btn danger" onClick={handleDeletePayment}>
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InsurerPayment;
