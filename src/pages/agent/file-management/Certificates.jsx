import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, FileText, ArrowLeft, X } from 'lucide-react';
import Pagination from '../../../components/Pagination';
import apiService from '../../../services/api';
import '../../../components/Pagination.css';
import '../AgentTableEnhancements.css';
import './Certificates.css';

const Certificates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for side-by-side layout
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [showPolicySearch, setShowPolicySearch] = useState(false);
  const [showCertificateSearch, setShowCertificateSearch] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [policySearchTerm, setPolicySearchTerm] = useState('');
  const [certificateSearchTerm, setCertificateSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const [certificates, setCertificates] = useState([]);
  const [clients] = useState([]);
  const [policies] = useState([]);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCertificates();
      const data = response?.data || response || [];
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading certificates:', err);
      setError('Failed to load certificates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filtering logic
  const filteredCertificates = certificates.filter(certificate => {
    const searchLower = searchTerm.toLowerCase();
    const clientMatch = selectedClient && certificate.clientId === selectedClient.id;
    const policyMatch = selectedPolicy && certificate.policyId === selectedPolicy.id;
    const certificateMatch = selectedCertificate && certificate.id === selectedCertificate.id;

    return (
      (searchLower === '' ||
        (certificate.certificate_no || '').toLowerCase().includes(searchLower) ||
        (certificate.user_name || '').toLowerCase().includes(searchLower) ||
        (certificate.insurer || '').toLowerCase().includes(searchLower) ||
        (certificate.item || '').toLowerCase().includes(searchLower) ||
        (certificate.status || '').toLowerCase().includes(searchLower) ||
        (certificate.date || '').toLowerCase().includes(searchLower) ||
        certificate.amount?.toString().includes(searchLower) ||
        (certificate.d_expiry || '').toLowerCase().includes(searchLower)
      ) &&
      (!selectedClient || clientMatch) &&
      (!selectedPolicy || policyMatch) &&
      (!selectedCertificate || certificateMatch)
    );
  });

  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await apiService.delete(`/certificates/${id}/`);
      await loadCertificates();
    } catch (err) {
      console.error('Error deleting certificate:', err);
      alert('Failed to delete certificate.');
    }
  };

  const handleExport = () => {
    if (certificates.length === 0) {
      alert('No certificates to export.');
      return;
    }
    const data = certificates.map(cert => ({
      'Certificate No.': cert.certificate_no || '',
      'Insurer': cert.insurer || '',
      'Date': cert.date || '',
      'Username': cert.user_name || '',
      'Status': cert.status || '',
      'Item': cert.item || '',
      'D.Expiry': cert.d_expiry || '',
      'Amount': cert.amount || 0,
    }));
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `certificates_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Enhanced search handlers
  const handleClientSearchChange = (e) => {
    setClientSearchTerm(e.target.value);
    setShowClientSearch(true);
  };

  const handlePolicySearchChange = (e) => {
    setPolicySearchTerm(e.target.value);
    setShowPolicySearch(true);
  };

  const handleCertificateSearchChange = (e) => {
    setCertificateSearchTerm(e.target.value);
    setShowCertificateSearch(true);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setClientSearchTerm('');
    setShowClientSearch(false);
    setSelectedPolicy(null);
    setSelectedCertificate(null);
  };

  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    setPolicySearchTerm('');
    setShowPolicySearch(false);
    setSelectedClient(null);
    setSelectedCertificate(null);
  };

  const handleCertificateSelect = (certificate) => {
    setSelectedCertificate(certificate);
    setCertificateSearchTerm('');
    setShowCertificateSearch(false);
  };

  const handleClearFilters = () => {
    setSelectedClient(null);
    setSelectedPolicy(null);
    setSelectedCertificate(null);
    setClientSearchTerm('');
    setPolicySearchTerm('');
    setCertificateSearchTerm('');
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    switch(status && status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="certificates-container">
      {/* Header */}
      <div className="certificates-header">
        <div className="certificates-header-content">
          <div className="certificates-header-left">
            <h1 className="certificates-title">Certificates</h1>
            <p className="certificates-subtitle">Manage all certificates in one place</p>
          </div>
          <div className="certificates-header-actions">
            <button className="certificates-btn" onClick={handleExport}>
              <Download className="certificates-btn-icon" />
              Export
            </button>
            <button className="certificates-btn primary">
              <Plus className="certificates-btn-icon" />
              New Certificate
            </button>
          </div>
        </div>
      </div>

      <div className="certificates-side-panel">
        {/* Search Section */}
        <div className="certificates-search-section">
          <div className="certificates-search-title">Search & Filters</div>
          <div className="certificates-search-row">
            <div className="certificates-search-group">
              <label className="certificates-search-label">Search</label>
              <div className="certificates-search-wrapper">
                <Search className="certificates-search-icon" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="certificates-search-input"
                />
                {showClientSearch && (
                  <div className="certificates-client-search-popup">
                    <div className="certificates-client-search-results">
                      {clients.filter(client =>
                        client.name?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                        client.email?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                        client.phone?.includes(clientSearchTerm)
                      ).map(client => (
                        <div
                          key={client.id}
                          className="certificates-client-option"
                          onClick={() => handleClientSelect(client)}
                        >
                          <div className="certificates-client-option-name">{client.name}</div>
                          <div className="certificates-client-option-details">
                            {client.email} | {client.phone}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="certificates-search-group">
              <label className="certificates-search-label">Policy</label>
              <div className="certificates-search-wrapper">
                <Search className="certificates-search-icon" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={policySearchTerm}
                  onChange={handlePolicySearchChange}
                  className="certificates-search-input"
                />
                {showPolicySearch && (
                  <div className="certificates-policy-search-popup">
                    <div className="certificates-policy-search-results">
                      {policies.filter(policy =>
                        policy.name?.toLowerCase().includes(policySearchTerm.toLowerCase()) ||
                        policy.policyNumber?.toLowerCase().includes(policySearchTerm.toLowerCase())
                      ).map(policy => (
                        <div
                          key={policy.id}
                          className="certificates-policy-option"
                          onClick={() => handlePolicySelect(policy)}
                        >
                          <div className="certificates-policy-option-name">{policy.name}</div>
                          <div className="certificates-policy-option-details">
                            {policy.policyNumber}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="certificates-search-group">
              <label className="certificates-search-label">Certificate</label>
              <div className="certificates-search-wrapper">
                <Search className="certificates-search-icon" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={certificateSearchTerm}
                  onChange={handleCertificateSearchChange}
                  className="certificates-search-input"
                />
                {showCertificateSearch && (
                  <div className="certificates-certificate-search-popup">
                    <div className="certificates-certificate-search-results">
                      {certificates.filter(certificate =>
                        (certificate.certificate_no || '').toLowerCase().includes(certificateSearchTerm.toLowerCase()) ||
                        (certificate.user_name || '').toLowerCase().includes(certificateSearchTerm.toLowerCase()) ||
                        (certificate.insurer || '').toLowerCase().includes(certificateSearchTerm.toLowerCase()) ||
                        (certificate.item || '').toLowerCase().includes(certificateSearchTerm.toLowerCase()) ||
                        (certificate.status || '').toLowerCase().includes(certificateSearchTerm.toLowerCase())
                      ).map(cert => (
                        <div
                          key={cert.id}
                          className="certificates-certificate-option"
                          onClick={() => handleCertificateSelect(cert)}
                        >
                          <div className="certificates-certificate-option-name">{cert.certificate_no}</div>
                          <div className="certificates-certificate-option-details">
                            {cert.insurer} - {cert.item}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="certificates-clear-filters-btn" onClick={handleClearFilters}>
              <Filter className="certificates-filter-icon" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Selected Filters Display */}
        {(selectedClient || selectedPolicy || selectedCertificate) && (
          <div className="certificates-selected-filters">
            <div className="certificates-selected-filters-title">Active Filters:</div>
            <div className="certificates-selected-filters-list">
              {selectedClient && (
                <div className="certificates-selected-filter">
                  <span className="certificates-filter-label">Client:</span>
                  <span className="certificates-filter-value">{selectedClient.name}</span>
                  <button
                    className="certificates-filter-clear-btn"
                    onClick={() => setSelectedClient(null)}
                    title="Clear client filter"
                  >
                    <X className="certificates-filter-clear-icon" />
                  </button>
                </div>
              )}
              {selectedPolicy && (
                <div className="certificates-selected-filter">
                  <span className="certificates-filter-label">Policy:</span>
                  <span className="certificates-filter-value">{selectedPolicy.name}</span>
                  <button
                    className="certificates-filter-clear-btn"
                    onClick={() => setSelectedPolicy(null)}
                    title="Clear policy filter"
                  >
                    <X className="certificates-filter-clear-icon" />
                  </button>
                </div>
              )}
              {selectedCertificate && (
                <div className="certificates-selected-filter">
                  <span className="certificates-filter-label">Certificate:</span>
                  <span className="certificates-filter-value">{selectedCertificate.certificate_no}</span>
                  <button
                    className="certificates-filter-clear-btn"
                    onClick={() => setSelectedCertificate(null)}
                    title="Clear certificate filter"
                  >
                    <X className="certificates-filter-clear-icon" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Panel - Always Visible */}
        <div className="certificates-right-panel">
          <div className="certificates-table-container">
            <div className="certificates-table-wrapper">
              {loading ? (
                <div className="certificates-loading">Loading certificates...</div>
              ) : error ? (
                <div className="certificates-error">{error}</div>
              ) : (
                <table className="certificates-table">
                  <thead className="certificates-table-head">
                    <tr className="certificates-table-row">
                      <th className="certificates-table-header">CERTIFICATE NO.</th>
                      <th className="certificates-table-header">INSURER</th>
                      <th className="certificates-table-header">DATE</th>
                      <th className="certificates-table-header">USERNAME</th>
                      <th className="certificates-table-header">STATUS</th>
                      <th className="certificates-table-header">ITEM</th>
                      <th className="certificates-table-header">D.EXPIRY</th>
                      <th className="certificates-table-header">AMOUNT</th>
                      <th className="certificates-table-header">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="certificates-table-body">
                    {paginatedCertificates.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="certificates-table-empty">No certificates found</td>
                      </tr>
                    ) : (
                      paginatedCertificates.map((certificate) => (
                        <tr key={certificate.id} className="certificates-table-row">
                          <td className="certificates-table-cell">
                            <div className="certificates-certificate-info">
                              <div className="certificates-certificate-no">{certificate.certificate_no}</div>
                            </div>
                          </td>
                          <td className="certificates-table-cell">
                            <div className="certificates-insurer-info">
                              <div className="certificates-insurer">{certificate.insurer}</div>
                            </div>
                          </td>
                          <td className="certificates-table-cell">
                            <div className="certificates-date-info">
                              <div className="certificates-date">{certificate.date}</div>
                            </div>
                          </td>
                          <td className="certificates-table-cell">
                            <div className="certificates-user-info">
                              <div className="certificates-user-name">{certificate.user_name}</div>
                            </div>
                          </td>
                          <td className="certificates-table-cell">
                            <span className={`certificates-status ${getStatusColor(certificate.status)}`}>
                              {certificate.status}
                            </span>
                          </td>
                          <td className="certificates-table-cell">
                            <div className="certificates-item-info">
                              <div className="certificates-item">{certificate.item}</div>
                            </div>
                          </td>
                          <td className="certificates-table-cell">
                            <div className="certificates-expiry-info">
                              <div className="certificates-d-expiry">{certificate.d_expiry}</div>
                            </div>
                          </td>
                          <td className="certificates-table-cell">
                            <div className="certificates-amount-info">
                              <div className="certificates-amount">KES {parseFloat(certificate.amount || 0).toLocaleString()}</div>
                            </div>
                          </td>
                          <td className="certificates-table-cell">
                            <div className="certificates-actions">
                              <button className="certificates-action-btn view">
                                <Eye className="certificates-action-icon" />
                              </button>
                              <button className="certificates-action-btn edit">
                                <Edit className="certificates-action-icon" />
                              </button>
                              <button className="certificates-action-btn delete" onClick={() => handleDeleteCertificate(certificate.id)}>
                                <Trash2 className="certificates-action-icon" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {!loading && !error && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCertificates.length)} of {filteredCertificates.length} certificates
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredCertificates.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
