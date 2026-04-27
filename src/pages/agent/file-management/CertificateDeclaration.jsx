import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Plus, Search, Filter, Eye, Edit, Trash2, X, Save } from 'lucide-react';
import Pagination from '../../../components/Pagination';
import '../../../components/Pagination.css';
import '../AgentTableEnhancements.css';
import './CertificateDeclaration.css';

const CertificateDeclaration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const [certificates, setCertificates] = useState([]);

  const filteredCertificates = certificates.filter(certificate => 
    certificate.certificateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate.insurer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowViewModal(true);
  };

  const handleEditCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowEditModal(true);
  };

  const handleDeleteCertificate = (certificate) => {
    if (window.confirm(`Are you sure you want to delete certificate ${certificate.certificateNo}?`)) {
      setCertificates(certificates.filter(cert => cert.id !== certificate.id));
      alert('Certificate deleted successfully!');
    }
  };

  const handleSaveEdit = () => {
    // Save edited certificate logic here
    alert('Certificate updated successfully!');
    setShowEditModal(false);
    setSelectedCertificate(null);
  };

  return (
    <div className="certificate-declaration-container">
      <div className="certificate-declaration-header">
        <div className="certificate-declaration-header-content">
          <div className="certificate-declaration-header-left">
            <h1 className="certificate-declaration-title">Certificate Declaration</h1>
            <p className="certificate-declaration-subtitle">View certificate declarations</p>
          </div>
          <div className="certificate-declaration-header-actions">
            <button className="certificate-declaration-btn">
              <Download className="certificate-declaration-btn-icon" />
              Export
            </button>
            <button className="certificate-declaration-btn primary">
              <Plus className="certificate-declaration-btn-icon" />
              New Declaration
            </button>
          </div>
        </div>
      </div>

      <div className="certificate-declaration-filters">
        <div className="certificate-declaration-search">
          <Search className="certificate-declaration-search-icon" />
          <input
            type="text"
            placeholder="Search certificate declarations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="certificate-declaration-search-input"
          />
        </div>
        <button className="certificate-declaration-filter-btn">
          <Filter className="certificate-declaration-filter-icon" />
          Filters
        </button>
      </div>

      <div className="certificate-declaration-table-container">
        <div className="certificate-declaration-table-wrapper">
          <table className="certificate-declaration-table">
            <thead className="certificate-declaration-table-head">
              <tr className="certificate-declaration-table-row">
                <th className="certificate-declaration-table-header">CERTIFICATE NO.</th>
                <th className="certificate-declaration-table-header">INSURER</th>
                <th className="certificate-declaration-table-header">DATE</th>
                <th className="certificate-declaration-table-header">USER NAME</th>
                <th className="certificate-declaration-table-header">STATUS</th>
                <th className="certificate-declaration-table-header">ITEM</th>
                <th className="certificate-declaration-table-header">ACTIONs</th>
              </tr>
            </thead>
            <tbody className="certificate-declaration-table-body">
              {paginatedCertificates.map((certificate) => (
                <tr key={certificate.id} className="certificate-declaration-table-row">
                  <td className="certificate-declaration-table-cell">
                    <div className="certificate-declaration-certificate-info">
                      <div className="certificate-declaration-certificate-no">{certificate.certificateNo}</div>
                    </div>
                  </td>
                  <td className="certificate-declaration-table-cell">
                    <div className="certificate-declaration-insurer-info">
                      <div className="certificate-declaration-insurer">{certificate.insurer}</div>
                    </div>
                  </td>
                  <td className="certificate-declaration-table-cell">
                    <div className="certificate-declaration-date-info">
                      <div className="certificate-declaration-date">{certificate.date}</div>
                    </div>
                  </td>
                  <td className="certificate-declaration-table-cell">
                    <div className="certificate-declaration-user-info">
                      <div className="certificate-declaration-user-name">{certificate.userName}</div>
                    </div>
                  </td>
                  <td className="certificate-declaration-table-cell">
                    <span className={`certificate-declaration-status ${getStatusColor(certificate.status)}`}>
                      {certificate.status}
                    </span>
                  </td>
                  <td className="certificate-declaration-table-cell">
                    <div className="certificate-declaration-item-info">
                      <div className="certificate-declaration-item">{certificate.item}</div>
                    </div>
                  </td>
                  <td className="certificate-declaration-table-cell">
                    <div className="certificate-declaration-actions">
                      <button 
                        className="certificate-declaration-action-btn view"
                        onClick={() => handleViewCertificate(certificate)}
                      >
                        <Eye className="certificate-declaration-action-icon" />
                      </button>
                      <button 
                        className="certificate-declaration-action-btn edit"
                        onClick={() => handleEditCertificate(certificate)}
                      >
                        <Edit className="certificate-declaration-action-icon" />
                      </button>
                      <button 
                        className="certificate-declaration-action-btn delete"
                        onClick={() => handleDeleteCertificate(certificate)}
                      >
                        <Trash2 className="certificate-declaration-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCertificates.length)} of {filteredCertificates.length} certificate declarations
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

      {/* View Modal */}
      {showViewModal && selectedCertificate && (
        <div className="certificate-declaration-modal-overlay">
          <div className="certificate-declaration-modal">
            <div className="certificate-declaration-modal-header">
              <h2 className="certificate-declaration-modal-title">Certificate Details</h2>
              <button 
                className="certificate-declaration-modal-close"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCertificate(null);
                }}
              >
                <X className="certificate-declaration-modal-close-icon" />
              </button>
            </div>
            <div className="certificate-declaration-modal-body">
              <div className="certificate-declaration-view-grid">
                <div className="certificate-declaration-view-group">
                  <label className="certificate-declaration-view-label">Certificate No.</label>
                  <p className="certificate-declaration-view-value">{selectedCertificate.certificateNo}</p>
                </div>
                <div className="certificate-declaration-view-group">
                  <label className="certificate-declaration-view-label">Insurer</label>
                  <p className="certificate-declaration-view-value">{selectedCertificate.insurer}</p>
                </div>
                <div className="certificate-declaration-view-group">
                  <label className="certificate-declaration-view-label">Date</label>
                  <p className="certificate-declaration-view-value">{selectedCertificate.date}</p>
                </div>
                <div className="certificate-declaration-view-group">
                  <label className="certificate-declaration-view-label">User Name</label>
                  <p className="certificate-declaration-view-value">{selectedCertificate.userName}</p>
                </div>
                <div className="certificate-declaration-view-group">
                  <label className="certificate-declaration-view-label">Status</label>
                  <span className={`certificate-declaration-view-status ${getStatusColor(selectedCertificate.status)}`}>
                    {selectedCertificate.status}
                  </span>
                </div>
                <div className="certificate-declaration-view-group">
                  <label className="certificate-declaration-view-label">Item</label>
                  <p className="certificate-declaration-view-value">{selectedCertificate.item}</p>
                </div>
              </div>
            </div>
            <div className="certificate-declaration-modal-footer">
              <button 
                className="certificate-declaration-btn secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCertificate(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCertificate && (
        <div className="certificate-declaration-modal-overlay">
          <div className="certificate-declaration-modal">
            <div className="certificate-declaration-modal-header">
              <h2 className="certificate-declaration-modal-title">Edit Certificate</h2>
              <button 
                className="certificate-declaration-modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCertificate(null);
                }}
              >
                <X className="certificate-declaration-modal-close-icon" />
              </button>
            </div>
            <div className="certificate-declaration-modal-body">
              <div className="certificate-declaration-edit-grid">
                <div className="certificate-declaration-form-group">
                  <label className="certificate-declaration-form-label">Certificate No.</label>
                  <input
                    type="text"
                    value={selectedCertificate.certificateNo}
                    onChange={(e) => setSelectedCertificate({...selectedCertificate, certificateNo: e.target.value})}
                    className="certificate-declaration-form-input"
                  />
                </div>
                <div className="certificate-declaration-form-group">
                  <label className="certificate-declaration-form-label">Insurer</label>
                  <input
                    type="text"
                    value={selectedCertificate.insurer}
                    onChange={(e) => setSelectedCertificate({...selectedCertificate, insurer: e.target.value})}
                    className="certificate-declaration-form-input"
                  />
                </div>
                <div className="certificate-declaration-form-group">
                  <label className="certificate-declaration-form-label">Date</label>
                  <input
                    type="date"
                    value={selectedCertificate.date}
                    onChange={(e) => setSelectedCertificate({...selectedCertificate, date: e.target.value})}
                    className="certificate-declaration-form-input"
                  />
                </div>
                <div className="certificate-declaration-form-group">
                  <label className="certificate-declaration-form-label">User Name</label>
                  <input
                    type="text"
                    value={selectedCertificate.userName}
                    onChange={(e) => setSelectedCertificate({...selectedCertificate, userName: e.target.value})}
                    className="certificate-declaration-form-input"
                  />
                </div>
                <div className="certificate-declaration-form-group">
                  <label className="certificate-declaration-form-label">Status</label>
                  <select
                    value={selectedCertificate.status}
                    onChange={(e) => setSelectedCertificate({...selectedCertificate, status: e.target.value})}
                    className="certificate-declaration-form-select"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="certificate-declaration-form-group">
                  <label className="certificate-declaration-form-label">Item</label>
                  <input
                    type="text"
                    value={selectedCertificate.item}
                    onChange={(e) => setSelectedCertificate({...selectedCertificate, item: e.target.value})}
                    className="certificate-declaration-form-input"
                  />
                </div>
              </div>
            </div>
            <div className="certificate-declaration-modal-footer">
              <button 
                className="certificate-declaration-btn secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCertificate(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="certificate-declaration-btn primary"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDeclaration;
