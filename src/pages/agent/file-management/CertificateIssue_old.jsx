import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, FileText, ArrowLeft, User, FileCheck, Calendar, DollarSign, Clock } from 'lucide-react';
import Pagination from '../../../components/Pagination';
import '../../../components/Pagination.css';
import '../AgentTableEnhancements.css';
import './CertificateIssue.css';

const CertificateIssue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const [certificates, setCertificates] = useState([
    {
      id: 'CERT001',
      clientName: 'John Kamau',
      policyNumber: 'POL-2024-001',
      vehicleItem: 'Motor Vehicle - Toyota Prado',
      amountPaid: 25000,
      certificateAmount: 25000,
      certificateNo: 'CERT-2024-001',
      dateFrom: '2024-01-15',
      expiryDate: '2025-01-15',
      noOfMonths: 12,
      remarks: 'Standard certificate issuance',
      actions: ['view', 'edit', 'delete']
    }
  ]);

  const filteredCertificates = certificates.filter(certificate => 
    certificate.certificateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="certificate-issue-container">
      <div className="certificate-issue-header">
        <div className="certificate-issue-header-content">
          <div className="certificate-issue-header-left">
            <h1 className="certificate-issue-title">Issue Certificate</h1>
            <p className="certificate-issue-subtitle">Create and issue new certificates</p>
          </div>
          <div className="certificate-issue-header-actions">
            <button className="certificate-issue-btn">
              <Download className="certificate-issue-btn-icon" />
              Export
            </button>
            <button className="certificate-issue-btn primary">
              <Plus className="certificate-issue-btn-icon" />
              New Certificate
            </button>
          </div>
        </div>
      </div>

      <div className="certificate-issue-filters">
        <div className="certificate-issue-search">
          <Search className="certificate-issue-search-icon" />
          <input
            type="text"
            placeholder="Search issued certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="certificate-issue-search-input"
          />
        </div>
        <button className="certificate-issue-filter-btn">
          <Filter className="certificate-issue-filter-icon" />
          Filters
        </button>
      </div>

      <div className="certificate-issue-table-container">
        <div className="certificate-issue-table-wrapper">
          <table className="certificate-issue-table">
            <thead className="certificate-issue-table-head">
              <tr className="certificate-issue-table-row">
                <th className="certificate-issue-table-header">CLIENT NAME</th>
                <th className="certificate-issue-table-header">POLICY NUMBER</th>
                <th className="certificate-issue-table-header">VEHICLE/ITEM</th>
                <th className="certificate-issue-table-header">AMOUNT PAID</th>
                <th className="certificate-issue-table-header">CERTIFICATE AMOUNT</th>
                <th className="certificate-issue-table-header">CERTIFICATE NO.</th>
                <th className="certificate-issue-table-header">DATE FROM</th>
                <th className="certificate-issue-table-header">EXPIRY DATE</th>
                <th className="certificate-issue-table-header">NO. OF MONTHS</th>
                <th className="certificate-issue-table-header">REMARKS</th>
                <th className="certificate-issue-table-header">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="certificate-issue-table-body">
              {paginatedCertificates.map((certificate) => (
                <tr key={certificate.id} className="certificate-issue-table-row">
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-client-info">
                      <div className="certificate-issue-client-name">{certificate.clientName}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-policy-info">
                      <div className="certificate-issue-policy-number">{certificate.policyNumber}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-vehicle-info">
                      <div className="certificate-issue-vehicle-item">{certificate.vehicleItem}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-amount-info">
                      <div className="certificate-issue-amount-paid">KES {certificate.amountPaid.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-certificate-amount-info">
                      <div className="certificate-issue-certificate-amount">KES {certificate.certificateAmount.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-certificate-no-info">
                      <div className="certificate-issue-certificate-no">{certificate.certificateNo}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-date-from-info">
                      <div className="certificate-issue-date-from">{certificate.dateFrom}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-expiry-date-info">
                      <div className="certificate-issue-expiry-date">{certificate.expiryDate}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-no-of-months-info">
                      <div className="certificate-issue-no-of-months">{certificate.noOfMonths}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-remarks-info">
                      <div className="certificate-issue-remarks">{certificate.remarks}</div>
                    </div>
                  </td>
                  <td className="certificate-issue-table-cell">
                    <div className="certificate-issue-actions">
                      <button className="certificate-issue-action-btn view">
                        <Eye className="certificate-issue-action-icon" />
                      </button>
                      <button className="certificate-issue-action-btn edit">
                        <Edit className="certificate-issue-action-icon" />
                      </button>
                      <button className="certificate-issue-action-btn delete">
                        <Trash2 className="certificate-issue-action-icon" />
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
      </div>
    </div>
  );
};

export default CertificateIssue;
