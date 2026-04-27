import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, FileText, ArrowLeft, Calendar, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../components/Pagination';
import '../../../components/Pagination.css';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import '../AgentTableEnhancements.css';
import './CertificateStatus.css';
import './CertificateStatusModal.css';

const CertificateStatus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch certificates from API
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/certificates/');
      const data = await response.json();
      
      if (data.success) {
        setCertificates(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch certificates');
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCertificates = Array.isArray(certificates) ? certificates.filter(certificate => 
    certificate && 
    typeof certificate === 'object' && (
      (certificate.certificate_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (certificate.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (certificate.insurer || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const openViewModal = (certificate) => {
    setSelectedCertificate(certificate);
    setShowViewModal(true);
  };

  const openEditModal = (certificate) => {
    setEditingCertificate({...certificate});
    setShowEditModal(true);
  };

  const openDeleteModal = (certificate) => {
    setSelectedCertificate(certificate);
    setShowDeleteModal(true);
  };

  const handleEditCertificate = async () => {
    if (!editingCertificate) return;
    
    try {
      setIsUpdating(true);
      
      const updateData = {
        certificate_no: editingCertificate.certificate_no,
        insurer: editingCertificate.insurer,
        user_name: editingCertificate.user_name,
        status: editingCertificate.status,
        item: editingCertificate.item,
        d_expiry: editingCertificate.d_expiry,
        amount: editingCertificate.amount
      };

      const response = await fetch(`/api/certificates/${editingCertificate.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Certificate updated successfully');
        setShowEditModal(false);
        setEditingCertificate(null);
        fetchCertificates(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to update certificate');
      }
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast.error('Failed to update certificate');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!selectedCertificate) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/certificates/${selectedCertificate.id}/`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Certificate deleted successfully');
        setShowDeleteModal(false);
        setSelectedCertificate(null);
        fetchCertificates(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to delete certificate');
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error('Failed to delete certificate');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="certificate-status-container">
      <div className="certificate-status-header">
        <div className="certificate-status-header-content">
          <div className="certificate-status-header-left">
            <h1 className="certificate-status-title">Certificate Status</h1>
            <p className="certificate-status-subtitle">View and manage certificate status</p>
          </div>
          <div className="certificate-status-header-actions">
            <button className="certificate-status-btn">
              <Download className="certificate-status-btn-icon" />
              Export
            </button>
            <button className="certificate-status-btn primary">
              <Plus className="certificate-status-btn-icon" />
              New Status Update
            </button>
          </div>
        </div>
      </div>

      <div className="certificate-status-filters">
        <div className="certificate-status-search">
          <Search className="certificate-status-search-icon" />
          <input
            type="text"
            placeholder="Search certificate status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="certificate-status-search-input"
          />
        </div>
        <button className="certificate-status-filter-btn">
          <Filter className="certificate-status-filter-icon" />
          Filters
        </button>
      </div>

      <div className="certificate-status-table-container">
        <div className="certificate-status-table-wrapper">
          {loading ? (
            <div className="certificate-status-loading">
              <div className="loading-spinner"></div>
              <p>Loading certificates...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="certificate-status-empty">
              <AlertCircle className="empty-icon" />
              <h3>No Certificates Found</h3>
              <p>There are no certificates to display.</p>
            </div>
          ) : (
            <table className="certificate-status-table">
              <thead className="certificate-status-table-head">
                <tr className="certificate-status-table-row">
                  <th className="certificate-status-table-header">CERTIFICATE NO.</th>
                  <th className="certificate-status-table-header">INSURER</th>
                  <th className="certificate-status-table-header">CLIENT</th>
                  <th className="certificate-status-table-header">DATE</th>
                  <th className="certificate-status-table-header">D.EXPIRY</th>
                  <th className="certificate-status-table-header">AMOUNT</th>
                  <th className="certificate-status-table-header">STATUS</th>
                  <th className="certificate-status-table-header">ITEM</th>
                  <th className="certificate-status-table-header">ACTIONs</th>
                </tr>
              </thead>
              <tbody className="certificate-status-table-body">
                {paginatedCertificates.map((certificate) => (
                  <tr key={certificate.id} className="certificate-status-table-row">
                    <td className="certificate-status-table-cell">
                      <div className="certificate-status-certificate-info">
                        <div className="certificate-status-certificate-no">{certificate.certificate_no}</div>
                      </div>
                    </td>
                    <td className="certificate-status-table-cell">
                      <div className="certificate-status-insurer-info">
                        <div className="certificate-status-insurer">{certificate.insurer}</div>
                      </div>
                    </td>
                    <td className="certificate-status-table-cell">
                      <div className="certificate-status-client-info">
                        <div className="certificate-status-client-name">{certificate.user_name}</div>
                      </div>
                    </td>
                    <td className="certificate-status-table-cell">
                      <div className="certificate-status-date-info">
                        <div className="certificate-status-date">{certificate.date}</div>
                      </div>
                    </td>
                    <td className="certificate-status-table-cell">
                      <div className="certificate-status-expiry-info">
                        <div className="certificate-status-d-expiry">{certificate.d_expiry}</div>
                      </div>
                    </td>
                    <td className="certificate-status-table-cell">
                      <div className="certificate-status-amount-info">
                        <div className="certificate-status-amount">KES {(certificate.amount || 0).toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="certificate-status-table-cell">
                      <span className={`certificate-status-status ${getStatusColor(certificate.status)}`}>
                        {certificate.status}
                      </span>
                    </td>
                    <td className="certificate-status-table-cell">
                      <div className="certificate-status-item-info">
                        <div className="certificate-status-item">{certificate.item}</div>
                      </div>
                    </td>
                    <td className="certificate-status-table-cell">
                      <div className="certificate-status-actions">
                        <button className="certificate-status-action-btn view" onClick={() => openViewModal(certificate)}>
                          <Eye className="certificate-status-action-icon" />
                        </button>
                        <button className="certificate-status-action-btn edit" onClick={() => openEditModal(certificate)}>
                          <Edit className="certificate-status-action-icon" />
                        </button>
                        <button className="certificate-status-action-btn delete" onClick={() => openDeleteModal(certificate)}>
                          <Trash2 className="certificate-status-action-icon" />
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCertificates.length)} of {filteredCertificates.length} certificate status records
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredCertificates.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* View Certificate Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedCertificate(null);
        }}
        title="Certificate Details"
        size="medium"
      >
        {selectedCertificate && (
          <div className="certificate-details">
            <div className="detail-row">
              <label>Certificate No:</label>
              <span>{selectedCertificate.certificate_no}</span>
            </div>
            <div className="detail-row">
              <label>Insurer:</label>
              <span>{selectedCertificate.insurer}</span>
            </div>
            <div className="detail-row">
              <label>Client:</label>
              <span>{selectedCertificate.user_name}</span>
            </div>
            <div className="detail-row">
              <label>Date:</label>
              <span>{selectedCertificate.date}</span>
            </div>
            <div className="detail-row">
              <label>Expiry Date:</label>
              <span>{selectedCertificate.d_expiry}</span>
            </div>
            <div className="detail-row">
              <label>Amount:</label>
              <span>KES {(selectedCertificate.amount || 0).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <label>Status:</label>
              <span className={`certificate-status-status ${getStatusColor(selectedCertificate.status)}`}>
                {selectedCertificate.status}
              </span>
            </div>
            <div className="detail-row">
              <label>Item:</label>
              <span>{selectedCertificate.item}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Certificate Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setEditingCertificate(null);
        }}
        title="Edit Certificate"
        size="medium"
      >
        {editingCertificate && (
          <div className="certificate-edit-form">
            <div className="form-group">
              <label>Certificate Number</label>
              <input
                type="text"
                value={editingCertificate.certificate_no}
                onChange={(e) => setEditingCertificate({...editingCertificate, certificate_no: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Insurer</label>
              <input
                type="text"
                value={editingCertificate.insurer}
                onChange={(e) => setEditingCertificate({...editingCertificate, insurer: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                value={editingCertificate.user_name}
                onChange={(e) => setEditingCertificate({...editingCertificate, user_name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={editingCertificate.date}
                onChange={(e) => setEditingCertificate({...editingCertificate, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                value={editingCertificate.d_expiry}
                onChange={(e) => setEditingCertificate({...editingCertificate, d_expiry: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={editingCertificate.amount}
                onChange={(e) => setEditingCertificate({...editingCertificate, amount: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={editingCertificate.status}
                onChange={(e) => setEditingCertificate({...editingCertificate, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="form-group">
              <label>Item</label>
              <input
                type="text"
                value={editingCertificate.item}
                onChange={(e) => setEditingCertificate({...editingCertificate, item: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button className="certificate-status-btn secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="certificate-status-btn primary" onClick={handleEditCertificate} disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Certificate'}
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
          setSelectedCertificate(null);
        }}
        onConfirm={handleDeleteCertificate}
        title="Delete Certificate"
        message={`Are you sure you want to delete certificate ${selectedCertificate?.certificate_no} for ${selectedCertificate?.user_name}? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        type="danger"
        disabled={isDeleting}
      />
    </div>
  );
};

export default CertificateStatus;
