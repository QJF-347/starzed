import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, FileText, ArrowLeft, AlertCircle, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import Modal from '../../../../components/Modal';
import '../../../../components/Pagination.css';
import '../../AgentTableEnhancements.css';
import './Premium.css';

const Premium = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [premiums, setPremiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPremium, setSelectedPremium] = useState(null);
  const [editingPremium, setEditingPremium] = useState(null);

  // Fetch premiums from API
  const fetchPremiums = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/premiums/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPremiums(Array.isArray(data.premiums) ? data.premiums : []);
      } else {
        toast.error(data.message || 'Failed to fetch premiums');
        setPremiums([]);
      }
    } catch (error) {
      console.error('Error fetching premiums:', error);
      toast.error('Failed to fetch premiums: ' + error.message);
      setPremiums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPremiums();
  }, []);

  // Pagination logic
  const filteredPremiums = Array.isArray(premiums) ? premiums.filter(premium => 
    premium && typeof premium === 'object' && (
      (premium.policy_number && typeof premium.policy_number === 'string' && premium.policy_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (premium.customer_name && typeof premium.customer_name === 'string' && premium.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (premium.policy_number && typeof premium.policy_number === 'string' && premium.policy_number.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  ) : [];

  const totalPages = Math.ceil(filteredPremiums.length / itemsPerPage);
  const paginatedPremiums = filteredPremiums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate payment link
  const generatePaymentLink = async (premium) => {
    try {
      setGeneratingLink(true);
      const response = await fetch('/api/generate-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'premium',
          amount: premium.balance > 0 ? premium.balance : premium.total_amount,
          customer_name: premium.customer_name,
          policy_number: premium.policy_number,
          description: `${premium.premium_type} Premium Payment`,
          premium_type: premium.premium_type
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
      case 'paid': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'unpaid': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const openViewModal = (premium) => {
    setSelectedPremium(premium);
    setShowViewModal(true);
  };

  const openEditModal = (premium) => {
    setEditingPremium({...premium});
    setShowEditModal(true);
  };

  const openDeleteModal = (premium) => {
    setSelectedPremium(premium);
    setShowDeleteModal(true);
  };

  const handleEditPremium = () => {
    console.log('Updating premium:', editingPremium);
    setShowEditModal(false);
    setEditingPremium(null);
  };

  const handleDeletePremium = () => {
    console.log('Deleting premium:', selectedPremium);
    setShowDeleteModal(false);
    setSelectedPremium(null);
  };

  return (
    <div className="premium-container">
      {/* Header */}
      <div className="premium-header">
        <div className="premium-header-content">
          <div className="premium-header-left">
            <h1 className="premium-title">Premium</h1>
            <p className="premium-subtitle">Manage and view all insurance premiums</p>
          </div>
          <div className="premium-header-actions">
            <button className="premium-btn">
              <Download className="premium-btn-icon" />
              Export
            </button>
            <button className="premium-btn primary">
              <Plus className="premium-btn-icon" />
              New Premium
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="premium-filters">
        <div className="premium-search">
          <Search className="premium-search-icon" />
          <input
            type="text"
            placeholder="Search premiums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="premium-search-input"
          />
        </div>
        <button className="premium-filter-btn">
          <Filter className="premium-filter-icon" />
          Filters
        </button>
      </div>

      {/* Premiums Table */}
      <div className="premium-table-container">
        <div className="premium-table-wrapper">
          {loading ? (
            <div className="premium-loading">
              <div className="loading-spinner"></div>
              <p>Loading premiums...</p>
            </div>
          ) : premiums.length === 0 ? (
            <div className="premium-empty">
              <AlertCircle className="empty-icon" />
              <h3>No Premiums Found</h3>
              <p>There are no premiums to display.</p>
            </div>
          ) : (
            <table className="premium-table">
              <thead className="premium-table-head">
                <tr className="premium-table-row">
                  <th className="premium-table-header">CLIENT NAME</th>
                  <th className="premium-table-header">POLICY NO.</th>
                  <th className="premium-table-header">PREMIUM TYPE</th>
                  <th className="premium-table-header">TOTAL AMOUNT</th>
                  <th className="premium-table-header">PAID AMOUNT</th>
                  <th className="premium-table-header">BALANCE</th>
                  <th className="premium-table-header">DUE DATE</th>
                  <th className="premium-table-header">STATUS</th>
                  <th className="premium-table-header">INSURER</th>
                  <th className="premium-table-header">FREQUENCY</th>
                  <th className="premium-table-header">ACTIONs</th>
                </tr>
              </thead>
              <tbody className="premium-table-body">
                {paginatedPremiums.map((premium) => (
                  <tr key={premium.id} className="premium-table-row">
                    <td className="premium-table-cell">
                      <div className="premium-client-info">
                        <div className="premium-client-name">{premium.customer_name}</div>
                      </div>
                    </td>
                    <td className="premium-table-cell">
                      <div className="premium-policy-info">
                        <div className="premium-policy-no">{premium.policy_number}</div>
                      </div>
                    </td>
                    <td className="premium-table-cell">
                      <div className="premium-class-info">
                        <div className="premium-class">{premium.premium_type}</div>
                      </div>
                    </td>
                    <td className="premium-table-cell">
                      <div className="premium-premium-info">
                        <div className="premium-premium">KES {premium.total_amount.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="premium-table-cell">
                      <div className="premium-paid-info">
                        <div className="premium-paid">KES {premium.paid_amount.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="premium-table-cell">
                      <div className="premium-balance-info">
                        <div className={`premium-balance ${premium.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          KES {premium.balance.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="premium-table-cell">
                      <div className="premium-date-info">
                        <div className="premium-date">{premium.due_date}</div>
                      </div>
                    </td>
                    <td className="premium-table-cell">
                      <span className={`premium-status ${getStatusColor(premium.status)}`}>
                        {premium.status}
                      </span>
                    </td>
                    <td className="premium-table-cell">
                      <div className="premium-insurer-info">
                        <div className="premium-insurer">{premium.insurer}</div>
                      </div>
                    </td>
                    <td className="premium-table-cell">
                      <div className="premium-frequency-info">
                        <div className="premium-frequency">{premium.frequency}</div>
                      </div>
                    </td>
                    <td className="premium-table-cell">
                      <div className="premium-actions">
                        <button className="premium-action-btn view" onClick={() => openViewModal(premium)}>
                          <Eye className="premium-action-icon" />
                        </button>
                        <button className="premium-action-btn edit" onClick={() => openEditModal(premium)}>
                          <Edit className="premium-action-icon" />
                        </button>
                        <button 
                          className="premium-action-btn share" 
                          onClick={() => generatePaymentLink(premium)}
                          disabled={generatingLink}
                        >
                          <Share2 className="premium-action-icon" />
                        </button>
                        <button className="premium-action-btn delete" onClick={() => openDeleteModal(premium)}>
                          <Trash2 className="premium-action-icon" />
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPremiums.length)} of {filteredPremiums.length} premiums
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredPremiums.length}
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
                    <span>{generatedPaymentLink.description || 'Premium Payment'}</span>
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
                  Share this link with the customer to complete their premium payment. 
                  Link expires in {generatedPaymentLink.expiry_hours} hours.
                </p>
              </div>
            </div>
            
            <div className="payment-link-actions">
              <button 
                className="premium-btn secondary" 
                onClick={() => {
                  setShowPaymentLinkModal(false);
                  setGeneratedPaymentLink(null);
                  setCopiedToClipboard(false);
                }}
              >
                Close
              </button>
              <button 
                className="premium-btn primary" 
                onClick={copyPaymentLink}
              >
                {copiedToClipboard ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Premium Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedPremium(null);
        }}
        title="Premium Details"
        size="medium"
      >
        {selectedPremium && (
          <div className="premium-view-modal">
            <div className="premium-details-grid">
              <div className="premium-detail-item">
                <label>Customer Name:</label>
                <span>{selectedPremium.customer_name}</span>
              </div>
              <div className="premium-detail-item">
                <label>Policy Number:</label>
                <span>{selectedPremium.policy_number}</span>
              </div>
              <div className="premium-detail-item">
                <label>Total Amount:</label>
                <span>KES {selectedPremium.total_amount.toLocaleString()}</span>
              </div>
              <div className="premium-detail-item">
                <label>Paid Amount:</label>
                <span>KES {selectedPremium.paid_amount.toLocaleString()}</span>
              </div>
              <div className="premium-detail-item">
                <label>Balance:</label>
                <span>KES {selectedPremium.balance.toLocaleString()}</span>
              </div>
              <div className="premium-detail-item">
                <label>Due Date:</label>
                <span>{selectedPremium.due_date}</span>
              </div>
              <div className="premium-detail-item">
                <label>Status:</label>
                <span className={`premium-status ${getStatusColor(selectedPremium.status)}`}>
                  {selectedPremium.status}
                </span>
              </div>
              <div className="premium-detail-item">
                <label>Premium Type:</label>
                <span>{selectedPremium.premium_type}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Premium Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setEditingPremium(null);
        }}
        title="Edit Premium"
        size="medium"
      >
        {editingPremium && (
          <div className="premium-edit-modal">
            <div className="premium-edit-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={editingPremium.customer_name}
                  onChange={(e) => setEditingPremium({...editingPremium, customer_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingPremium.status}
                  onChange={(e) => setEditingPremium({...editingPremium, status: e.target.value})}
                >
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="premium-btn secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="premium-btn primary" onClick={handleEditPremium}>
                Update Premium
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
          setSelectedPremium(null);
        }}
        title="Delete Premium"
        size="small"
      >
        {selectedPremium && (
          <div className="premium-delete-modal">
            <p>Are you sure you want to delete premium for {selectedPremium.customer_name}?</p>
            <div className="modal-actions">
              <button className="premium-btn secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="premium-btn danger" onClick={handleDeletePremium}>
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Premium;
