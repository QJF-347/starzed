import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, FileText, ArrowLeft, AlertCircle, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import '../../../../components/Pagination.css';
import Modal from '../../../../components/Modal';
import ConfirmModal from '../../../../components/ConfirmModal';
import '../../AgentTableEnhancements.css';
import './CustomersReceipts.css';
import './CustomersReceiptsModal.css';

const CustomersReceipts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch receipts from API
  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customer-receipts/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReceipts(Array.isArray(data.receipts) ? data.receipts : []);
      } else {
        toast.error(data.message || 'Failed to fetch receipts');
        setReceipts([]);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error('Failed to fetch receipts: ' + error.message);
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  // Pagination logic
  const filteredReceipts = Array.isArray(receipts) ? receipts.filter(receipt => 
    receipt && typeof receipt === 'object' && (
      (receipt.receipt_number && typeof receipt.receipt_number === 'string' && receipt.receipt_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (receipt.customer_name && typeof receipt.customer_name === 'string' && receipt.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (receipt.policy_number && typeof receipt.policy_number === 'string' && receipt.policy_number.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  ) : [];

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const paginatedReceipts = filteredReceipts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate payment link
  const generatePaymentLink = async (receipt) => {
    try {
      setGeneratingLink(true);
      const response = await fetch('/api/generate-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'receipt',
          amount: receipt.amount,
          customer_name: receipt.customer_name,
          policy_number: receipt.policy_number,
          description: receipt.description,
          receipt_number: receipt.receipt_number
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
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const openViewModal = (receipt) => {
    setSelectedReceipt(receipt);
    setShowViewModal(true);
  };

  const openEditModal = (receipt) => {
    setEditingReceipt({...receipt});
    setShowEditModal(true);
  };

  const openDeleteModal = (receipt) => {
    setSelectedReceipt(receipt);
    setShowDeleteModal(true);
  };

  const handleEditReceipt = () => {
    console.log('Updating receipt:', editingReceipt);
    setShowEditModal(false);
    setEditingReceipt(null);
  };

  const handleDeleteReceipt = () => {
    console.log('Deleting receipt:', selectedReceipt);
    setShowDeleteModal(false);
    setSelectedReceipt(null);
  };

  return (
    <div className="customers-receipts-container">
      {/* Header */}
      <div className="customers-receipts-header">
        <div className="customers-receipts-header-content">
          <div className="customers-receipts-header-left">
            <h1 className="customers-receipts-title">Customers Receipts</h1>
            <p className="customers-receipts-subtitle">Manage and view all customer payment receipts</p>
          </div>
          <div className="customers-receipts-header-actions">
            <button className="customers-receipts-btn">
              <Download className="customers-receipts-btn-icon" />
              Export
            </button>
            <button className="customers-receipts-btn primary">
              <Plus className="customers-receipts-btn-icon" />
              New Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="customers-receipts-filters">
        <div className="customers-receipts-search">
          <Search className="customers-receipts-search-icon" />
          <input
            type="text"
            placeholder="Search receipts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="customers-receipts-search-input"
          />
        </div>
        <button className="customers-receipts-filter-btn">
          <Filter className="customers-receipts-filter-icon" />
          Filters
        </button>
      </div>

      {/* Receipts Table */}
      <div className="customers-receipts-table-container">
        <div className="customers-receipts-table-wrapper">
          {loading ? (
            <div className="customers-receipts-loading">
              <div className="loading-spinner"></div>
              <p>Loading receipts...</p>
            </div>
          ) : receipts.length === 0 ? (
            <div className="customers-receipts-empty">
              <AlertCircle className="empty-icon" />
              <h3>No Receipts Found</h3>
              <p>There are no receipts to display.</p>
            </div>
          ) : (
            <table className="customers-receipts-table">
              <thead className="customers-receipts-table-head">
                <tr className="customers-receipts-table-row">
                  <th className="customers-receipts-table-header">Receipt No.</th>
                  <th className="customers-receipts-table-header">Customer</th>
                  <th className="customers-receipts-table-header">Policy No.</th>
                  <th className="customers-receipts-table-header">Amount</th>
                  <th className="customers-receipts-table-header">Date</th>
                  <th className="customers-receipts-table-header">Payment Method</th>
                  <th className="customers-receipts-table-header">Status</th>
                  <th className="customers-receipts-table-header">Insurer</th>
                  <th className="customers-receipts-table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="customers-receipts-table-body">
                {paginatedReceipts.map((receipt) => (
                  <tr key={receipt.id} className="customers-receipts-table-row">
                    <td className="customers-receipts-table-cell">
                      <div className="customers-receipts-receipt-info">
                        <div className="customers-receipts-receipt-number">{receipt.receipt_number}</div>
                      </div>
                    </td>
                    <td className="customers-receipts-table-cell">
                      <div className="customers-receipts-customer-info">
                        <div className="customers-receipts-customer-name">{receipt.customer_name}</div>
                      </div>
                    </td>
                    <td className="customers-receipts-table-cell">
                      <div className="customers-receipts-policy-info">
                        <div className="customers-receipts-policy-number">{receipt.policy_number}</div>
                      </div>
                    </td>
                    <td className="customers-receipts-table-cell">
                      <div className="customers-receipts-amount-info">
                        <div className="customers-receipts-amount">KES {receipt.amount.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="customers-receipts-table-cell">
                      <div className="customers-receipts-date-info">
                        <div className="customers-receipts-date">{receipt.payment_date}</div>
                      </div>
                    </td>
                    <td className="customers-receipts-table-cell">
                      <div className="customers-receipts-payment-info">
                        <div className="customers-receipts-payment-method">{receipt.payment_method}</div>
                      </div>
                    </td>
                    <td className="customers-receipts-table-cell">
                      <span className={`customers-receipts-status ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="customers-receipts-table-cell">
                      <div className="customers-receipts-insurer-info">
                        <div className="customers-receipts-insurer">{receipt.insurer}</div>
                      </div>
                    </td>
                    <td className="customers-receipts-table-cell">
                      <div className="customers-receipts-actions">
                        <button className="customers-receipts-action-btn view" onClick={() => openViewModal(receipt)}>
                          <Eye className="customers-receipts-action-icon" />
                        </button>
                        <button className="customers-receipts-action-btn edit" onClick={() => openEditModal(receipt)}>
                          <Edit className="customers-receipts-action-icon" />
                        </button>
                        <button 
                          className="customers-receipts-action-btn share" 
                          onClick={() => generatePaymentLink(receipt)}
                          disabled={generatingLink}
                        >
                          <Share2 className="customers-receipts-action-icon" />
                        </button>
                        <button className="customers-receipts-action-btn delete" onClick={() => openDeleteModal(receipt)}>
                          <Trash2 className="customers-receipts-action-icon" />
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredReceipts.length)} of {filteredReceipts.length} receipts
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredReceipts.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* View Receipt Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedReceipt(null);
        }}
        title="Receipt Details"
        size="medium"
      >
        {selectedReceipt && (
          <div className="receipt-details">
            <div className="detail-row">
              <label>Receipt Number:</label>
              <span>{selectedReceipt.receiptNumber}</span>
            </div>
            <div className="detail-row">
              <label>Customer Name:</label>
              <span>{selectedReceipt.customerName}</span>
            </div>
            <div className="detail-row">
              <label>Email:</label>
              <span>{selectedReceipt.customerEmail}</span>
            </div>
            <div className="detail-row">
              <label>Phone:</label>
              <span>{selectedReceipt.customerPhone}</span>
            </div>
            <div className="detail-row">
              <label>Policy Number:</label>
              <span>{selectedReceipt.policyNumber}</span>
            </div>
            <div className="detail-row">
              <label>Policy Type:</label>
              <span>{selectedReceipt.policyType}</span>
            </div>
            <div className="detail-row">
              <label>Amount:</label>
              <span>KES {selectedReceipt.amount.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <label>Receipt Date:</label>
              <span>{selectedReceipt.receiptDate}</span>
            </div>
            <div className="detail-row">
              <label>Payment Method:</label>
              <span>{selectedReceipt.paymentMethod}</span>
            </div>
            <div className="detail-row">
              <label>Status:</label>
              <span className={`customers-receipts-status ${getStatusColor(selectedReceipt.status)}`}>
                {selectedReceipt.status}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Receipt Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setEditingReceipt(null);
        }}
        title="Edit Receipt"
        size="medium"
      >
        {editingReceipt && (
          <div className="receipt-edit-form">
            <div className="form-group">
              <label>Receipt Number</label>
              <input
                type="text"
                value={editingReceipt.receiptNumber}
                onChange={(e) => setEditingReceipt({...editingReceipt, receiptNumber: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                value={editingReceipt.customerName}
                onChange={(e) => setEditingReceipt({...editingReceipt, customerName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Customer Email</label>
              <input
                type="email"
                value={editingReceipt.customerEmail}
                onChange={(e) => setEditingReceipt({...editingReceipt, customerEmail: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Customer Phone</label>
              <input
                type="text"
                value={editingReceipt.customerPhone}
                onChange={(e) => setEditingReceipt({...editingReceipt, customerPhone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Policy Number</label>
              <input
                type="text"
                value={editingReceipt.policyNumber}
                onChange={(e) => setEditingReceipt({...editingReceipt, policyNumber: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={editingReceipt.amount}
                onChange={(e) => setEditingReceipt({...editingReceipt, amount: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={editingReceipt.paymentMethod}
                onChange={(e) => setEditingReceipt({...editingReceipt, paymentMethod: e.target.value})}
              >
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={editingReceipt.status}
                onChange={(e) => setEditingReceipt({...editingReceipt, status: e.target.value})}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="customers-receipts-btn secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="customers-receipts-btn primary" onClick={handleEditReceipt}>
                Update Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedReceipt(null);
        }}
        onConfirm={handleDeleteReceipt}
        title="Delete Receipt"
        message={`Are you sure you want to delete receipt ${selectedReceipt?.receiptNumber} for ${selectedReceipt?.customerName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

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
                className="customers-receipts-btn secondary" 
                onClick={() => {
                  setShowPaymentLinkModal(false);
                  setGeneratedPaymentLink(null);
                  setCopiedToClipboard(false);
                }}
              >
                Close
              </button>
              <button 
                className="customers-receipts-btn primary" 
                onClick={copyPaymentLink}
              >
                {copiedToClipboard ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomersReceipts;
