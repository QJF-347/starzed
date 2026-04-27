import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Plus, Filter, Download, Eye, Edit, FileText, CreditCard, 
  AlertTriangle, CheckCircle, Clock, Calendar, DollarSign, User, 
  Shield, Award, RefreshCw, ArrowUpDown, ArrowLeft 
} from 'lucide-react';
import Pagination from '../../components/Pagination';
import '../../components/Pagination.css';
import './AgentTableEnhancements.css';
import './Policies.css';

const Policies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const [policies, setPolicies] = useState([
    {
      id: 'POL001',
      policyNumber: 'POL-2024-001',
      clientName: 'John Kamau',
      clientEmail: 'john.kamau@email.com',
      policyType: 'Motor Insurance',
      subType: 'Comprehensive',
      premium: {
        annual: 85000,
        monthly: 8500,
        paid: 70000,
        balance: 15000
      },
      dates: {
        startDate: '2023-03-25',
        endDate: '2024-03-25',
        renewalDate: '2024-03-25'
      },
      status: 'expiring',
      coverage: 'KES 5,000,000',
      company: 'Jubilee Insurance',
      agent: 'John Agent',
      documents: {
        certificate: 'CERT-POL001.pdf',
        policy: 'POL-POL001.pdf',
        schedule: 'SCHED-POL001.pdf'
      }
    },
    {
      id: 'POL002',
      policyNumber: 'POL-2024-002',
      clientName: 'Mary Wanjiru',
      clientEmail: 'mary.wanjiru@email.com',
      policyType: 'Medical Insurance',
      subType: 'Family Health Cover',
      premium: {
        annual: 45000,
        monthly: 4500,
        paid: 45000,
        balance: 0
      },
      dates: {
        startDate: '2023-03-28',
        endDate: '2024-03-28',
        renewalDate: '2024-03-28'
      },
      status: 'expiring',
      coverage: 'Inpatient, Outpatient, Dental',
      company: 'UAP Old Mutual',
      agent: 'John Agent',
      documents: {
        certificate: 'CERT-POL002.pdf',
        policy: 'POL-POL002.pdf',
        schedule: 'SCHED-POL002.pdf'
      }
    },
    {
      id: 'POL003',
      policyNumber: 'POL-2024-003',
      clientName: 'David Ochieng',
      clientEmail: 'david.ochieng@company.com',
      policyType: 'Motor Insurance',
      subType: 'Comprehensive',
      premium: {
        annual: 65000,
        monthly: 6500,
        paid: 57000,
        balance: 8000
      },
      dates: {
        startDate: '2023-03-30',
        endDate: '2024-03-30',
        renewalDate: '2024-03-30'
      },
      status: 'expiring-with-balance',
      coverage: 'KES 3,200,000',
      company: 'Britam',
      agent: 'John Agent',
      documents: {
        certificate: 'CERT-POL003.pdf',
        policy: 'POL-POL003.pdf',
        schedule: 'SCHED-POL003.pdf'
      }
    }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 'TRX001',
      policyNumber: 'POL-2024-001',
      clientName: 'John Kamau',
      type: 'Premium Payment',
      amount: 8500,
      date: '2024-03-01',
      method: 'M-Pesa',
      status: 'completed',
      reference: 'MP123456789',
      description: 'Monthly premium payment'
    },
    {
      id: 'TRX002',
      policyNumber: 'POL-2024-002',
      clientName: 'Mary Wanjiru',
      type: 'Premium Payment',
      amount: 4500,
      date: '2024-03-01',
      method: 'Bank Transfer',
      status: 'completed',
      reference: 'BANK987654321',
      description: 'Monthly premium payment'
    },
    {
      id: 'TRX003',
      policyNumber: 'POL-2024-003',
      clientName: 'David Ochieng',
      type: 'Premium Payment',
      amount: 6500,
      date: '2024-03-01',
      method: 'M-Pesa',
      status: 'pending',
      reference: 'MP456789123',
      description: 'Monthly premium payment'
    },
    {
      id: 'TRX004',
      policyNumber: 'POL-2024-001',
      clientName: 'John Kamau',
      type: 'Claim Payout',
      amount: -150000,
      date: '2024-02-15',
      method: 'Bank Transfer',
      status: 'completed',
      reference: 'CLAIM789456',
      description: 'Accident claim settlement'
    },
    {
      id: 'TRX005',
      policyNumber: 'POL-2024-002',
      clientName: 'Mary Wanjiru',
      type: 'Refund',
      amount: -2000,
      date: '2024-02-10',
      method: 'Bank Transfer',
      status: 'completed',
      reference: 'REFUND456789',
      description: 'Overpayment refund'
    }
  ]);

  const [endorsements, setEndorsements] = useState([
    {
      id: 'END001',
      policyNumber: 'POL-2024-001',
      clientName: 'John Kamau',
      type: 'Vehicle Change',
      subType: 'Substitution',
      date: '2024-02-20',
      status: 'completed',
      description: 'Changed vehicle from Toyota Prado to Land Cruiser',
      oldDetails: 'Toyota Prado KDG 123A',
      newDetails: 'Toyota Land Cruiser KDG 123A',
      effectiveDate: '2024-02-21',
      premiumAdjustment: 5000,
      processedBy: 'John Agent'
    },
    {
      id: 'END002',
      policyNumber: 'POL-2024-002',
      clientName: 'Mary Wanjiru',
      type: 'Coverage Change',
      subType: 'Correction',
      date: '2024-02-15',
      status: 'pending',
      description: 'Corrected beneficiary details',
      oldDetails: 'Beneficiary: Spouse',
      newDetails: 'Beneficiary: Children',
      effectiveDate: '2024-02-16',
      premiumAdjustment: 0,
      processedBy: 'John Agent'
    },
    {
      id: 'END003',
      policyNumber: 'POL-2024-003',
      clientName: 'David Ochieng',
      type: 'Policy Reversal',
      subType: 'Reverse',
      date: '2024-02-10',
      status: 'processing',
      description: 'Reversing policy due to misrepresentation',
      oldDetails: 'Active Policy',
      newDetails: 'Policy Cancelled',
      effectiveDate: '2024-02-11',
      premiumAdjustment: -65000,
      processedBy: 'John Agent'
    }
  ]);

  const [certificates, setCertificates] = useState([
    {
      id: 'CERT001',
      policyNumber: 'POL-2024-001',
      clientName: 'John Kamau',
      certificateType: 'Insurance Certificate',
      certificateNumber: 'CERT-2024-001',
      issueDate: '2024-03-01',
      expiryDate: '2024-03-25',
      status: 'active',
      allocated: true,
      fileUrl: '/certificates/CERT-2024-001.pdf',
      issuedBy: 'John Agent'
    },
    {
      id: 'CERT002',
      policyNumber: 'POL-2024-002',
      clientName: 'Mary Wanjiru',
      certificateType: 'Insurance Certificate',
      certificateNumber: 'CERT-2024-002',
      issueDate: '2024-03-01',
      expiryDate: '2024-03-28',
      status: 'active',
      allocated: true,
      fileUrl: '/certificates/CERT-2024-002.pdf',
      issuedBy: 'John Agent'
    },
    {
      id: 'CERT003',
      policyNumber: 'POL-2024-003',
      clientName: 'David Ochieng',
      certificateType: 'Insurance Certificate',
      certificateNumber: 'CERT-2024-003',
      issueDate: '2024-03-01',
      expiryDate: '2024-03-30',
      status: 'pending',
      allocated: false,
      fileUrl: null,
      issuedBy: null
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-orange-100 text-orange-800';
      case 'expiring-with-balance':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'Premium Payment':
        return 'text-green-600';
      case 'Claim Payout':
      case 'Refund':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Pagination logic
  const filteredPolicies = policies.filter(policy => 
    (policy.policyNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (policy.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (policy.policyType || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'transactions', name: 'Transactions', icon: CreditCard },
    { id: 'endorsements', name: 'Endorsements', icon: RefreshCw },
    { id: 'certificates', name: 'Certificates', icon: Award }
  ];

  const renderOverview = () => (
    <div>
      {/* Stats Cards */}
      <div className="policies-stats-grid">
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Total Policies</h3>
              <p className="policies-stat-value">{policies.length}</p>
            </div>
            <div className="policies-stat-icon blue">
              <Shield className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Active Policies</h3>
              <p className="policies-stat-value">{policies.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="policies-stat-icon green">
              <CheckCircle className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Expiring Soon</h3>
              <p className="policies-stat-value">{policies.filter(p => p.status === 'expiring' || p.status === 'expiring-with-balance').length}</p>
            </div>
            <div className="policies-stat-icon yellow">
              <AlertTriangle className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Total Premium</h3>
              <p className="policies-stat-value">KES {policies.reduce((sum, p) => sum + p.premium.annual, 0).toLocaleString()}</p>
            </div>
            <div className="policies-stat-icon purple">
              <DollarSign className="policies-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="policies-table-container">
        <div className="policies-table-wrapper">
          <table className="policies-table">
            <thead className="policies-table-head">
              <tr className="policies-table-row">
                <th className="policies-table-header">Policy</th>
                <th className="policies-table-header">Client</th>
                <th className="policies-table-header">Type</th>
                <th className="policies-table-header">Premium</th>
                <th className="policies-table-header">Status</th>
                <th className="policies-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="policies-table-body">
              {paginatedPolicies.map((policy) => (
                <tr key={policy.id} className="policies-table-row">
                  <td className="policies-table-cell">
                    <div className="policies-policy-info">
                      <div className="policies-policy-number">{policy.policyNumber}</div>
                      <div className="policies-policy-client">{policy.company}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-client-info">
                      <div className="policies-client-name">{policy.clientName}</div>
                      <div className="policies-client-email">{policy.clientEmail}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-type-info">
                      <div className="policies-type-main">{policy.policyType}</div>
                      <div className="policies-type-sub">{policy.subType}</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-premium-info">
                      <div className="policies-premium-amount">KES {policy.premium.annual.toLocaleString()}</div>
                      <div className="policies-premium-period">Annual</div>
                    </div>
                  </td>
                  <td className="policies-table-cell">
                    <span className={`policies-status-badge ${policy.status}`}>
                      {policy.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-actions">
                      <Link
                        to={`/agent/policies/${policy.id}`}
                        className="policies-action-btn view"
                      >
                        <Eye className="policies-action-icon" />
                      </Link>
                      <Link
                        to={`/agent/policies/${policy.id}/edit`}
                        className="policies-action-btn edit"
                      >
                        <Edit className="policies-action-icon" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPolicies.length)} of {filteredPolicies.length} policies
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredPolicies.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div>
      {/* Stats Cards */}
      <div className="policies-stats-grid">
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Total Transactions</h3>
              <p className="policies-stat-value">{transactions.length}</p>
            </div>
            <div className="policies-stat-icon blue">
              <CreditCard className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Completed</h3>
              <p className="policies-stat-value">{transactions.filter(t => t.status === 'completed').length}</p>
            </div>
            <div className="policies-stat-icon green">
              <CheckCircle className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Pending</h3>
              <p className="policies-stat-value">{transactions.filter(t => t.status === 'pending').length}</p>
            </div>
            <div className="policies-stat-icon yellow">
              <Clock className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Total Amount</h3>
              <p className="policies-stat-value">KES {Math.abs(transactions.reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}</p>
            </div>
            <div className="policies-stat-icon purple">
              <DollarSign className="policies-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="policies-table-container">
        <div className="overflow-x-auto">
          <table className="policies-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="policies-table-head">
                  Date
                </th>
                <th className="policies-table-head">
                  Policy
                </th>
                <th className="policies-table-head">
                  Client
                </th>
                <th className="policies-table-head">
                  Type
                </th>
                <th className="policies-table-head">
                  Amount
                </th>
                <th className="policies-table-head">
                  Method
                </th>
                <th className="policies-table-head">
                  Status
                </th>
                <th className="policies-table-head">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="policies-table-row-hover">
                  <td className="policies-table-cell">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="policies-table-cell">
                    {transaction.policyNumber}
                  </td>
                  <td className="policies-table-cell">
                    {transaction.clientName}
                  </td>
                  <td className="policies-table-cell">
                    {transaction.type}
                  </td>
                  <td className="policies-table-cell">
                    <span className={`policies-transaction-amount ${transaction.amount > 0 ? 'positive' : transaction.amount < 0 ? 'negative' : 'neutral'}`}>
                      {transaction.amount > 0 ? '+' : ''}KES {Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="policies-table-cell">
                    {transaction.method}
                  </td>
                  <td className="policies-table-cell">
                    <span className={`policies-status-badge ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="policies-table-cell policies-table-cell-actions">
                    {transaction.reference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEndorsements = () => (
    <div>
      {/* Stats Cards */}
      <div className="policies-stats-grid">
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Total Endorsements</h3>
              <p className="policies-stat-value">{endorsements.length}</p>
            </div>
            <div className="policies-stat-icon blue">
              <RefreshCw className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Completed</h3>
              <p className="policies-stat-value">{endorsements.filter(e => e.status === 'completed').length}</p>
            </div>
            <div className="policies-stat-icon green">
              <CheckCircle className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Pending</h3>
              <p className="policies-stat-value">{endorsements.filter(e => e.status === 'pending').length}</p>
            </div>
            <div className="policies-stat-icon yellow">
              <Clock className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Processing</h3>
              <p className="policies-stat-value">{endorsements.filter(e => e.status === 'processing').length}</p>
            </div>
            <div className="policies-stat-icon orange">
              <ArrowUpDown className="policies-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Endorsements Table */}
      <div className="policies-table-container">
        <div className="overflow-x-auto">
          <table className="policies-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="policies-table-head">
                  Date
                </th>
                <th className="policies-table-head">
                  Policy
                </th>
                <th className="policies-table-head">
                  Client
                </th>
                <th className="policies-table-head">
                  Type
                </th>
                <th className="policies-table-head">
                  Description
                </th>
                <th className="policies-table-head">
                  Premium Adj.
                </th>
                <th className="policies-table-head">
                  Status
                </th>
                <th className="policies-table-head">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {endorsements.map((endorsement) => (
                <tr key={endorsement.id} className="policies-table-row-hover">
                  <td className="policies-table-cell">
                    {new Date(endorsement.date).toLocaleDateString()}
                  </td>
                  <td className="policies-table-cell">
                    {endorsement.policyNumber}
                  </td>
                  <td className="policies-table-cell">
                    {endorsement.clientName}
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-endorsement-type">
                      <div className="policies-endorsement-main">{endorsement.type}</div>
                      <div className="policies-endorsement-sub">{endorsement.subType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {endorsement.description}
                  </td>
                  <td className="policies-table-cell">
                    <span className={`policies-premium-adjustment ${endorsement.premiumAdjustment > 0 ? 'increase' : endorsement.premiumAdjustment < 0 ? 'decrease' : 'neutral'}`}>
                      {endorsement.premiumAdjustment > 0 ? '+' : ''}KES {endorsement.premiumAdjustment.toLocaleString()}
                    </span>
                  </td>
                  <td className="policies-table-cell">
                    <span className={`policies-status-badge ${endorsement.status}`}>
                      {endorsement.status}
                    </span>
                  </td>
                  <td className="policies-table-cell policies-table-cell-actions">
                    <div className="policies-actions">
                      <button className="policies-action-button view">
                        <Eye className="policies-action-button" />
                      </button>
                      <button className="policies-action-button edit">
                        <Edit className="policies-action-button" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div>
      {/* Stats Cards */}
      <div className="policies-stats-grid">
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Total Certificates</h3>
              <p className="policies-stat-value">{certificates.length}</p>
            </div>
            <div className="policies-stat-icon blue">
              <Award className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Allocated</h3>
              <p className="policies-stat-value">{certificates.filter(c => c.allocated).length}</p>
            </div>
            <div className="policies-stat-icon green">
              <CheckCircle className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Pending</h3>
              <p className="policies-stat-value">{certificates.filter(c => c.status === 'pending').length}</p>
            </div>
            <div className="policies-stat-icon yellow">
              <Clock className="policies-stat-icon" />
            </div>
          </div>
        </div>
        <div className="policies-stat-card">
          <div className="policies-stat-content">
            <div className="policies-stat-info">
              <h3>Active</h3>
              <p className="policies-stat-value">{certificates.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="policies-stat-icon blue">
              <Shield className="policies-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="policies-table-container">
        <div className="overflow-x-auto">
          <table className="policies-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="policies-table-head">
                  Certificate No.
                </th>
                <th className="policies-table-head">
                  Policy
                </th>
                <th className="policies-table-head">
                  Client
                </th>
                <th className="policies-table-head">
                  Type
                </th>
                <th className="policies-table-head">
                  Issue Date
                </th>
                <th className="policies-table-head">
                  Expiry Date
                </th>
                <th className="policies-table-head">
                  Status
                </th>
                <th className="policies-table-head">
                  Allocated
                </th>
                <th className="policies-table-head">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((certificate) => (
                <tr key={certificate.id} className="policies-table-row-hover">
                  <td className="policies-table-cell">
                    <div className="policies-certificate-number">{certificate.certificateNumber}</div>
                  </td>
                  <td className="policies-table-cell">
                    {certificate.policyNumber}
                  </td>
                  <td className="policies-table-cell">
                    {certificate.clientName}
                  </td>
                  <td className="policies-table-cell">
                    <div className="policies-certificate-type">{certificate.certificateType}</div>
                  </td>
                  <td className="policies-table-cell">
                    {new Date(certificate.issueDate).toLocaleDateString()}
                  </td>
                  <td className="policies-table-cell">
                    {new Date(certificate.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="policies-table-cell">
                    <span className={`policies-status-badge ${certificate.status}`}>
                      {certificate.status}
                    </span>
                  </td>
                  <td className="policies-table-cell">
                    <span className={`policies-allocated-badge ${certificate.allocated ? 'yes' : 'no'}`}>
                      {certificate.allocated ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="policies-table-cell policies-table-cell-actions">
                    <div className="policies-actions">
                      {certificate.fileUrl && (
                        <button className="policies-action-button view">
                          <Eye className="policies-action-button" />
                        </button>
                      )}
                      <button className="policies-action-button edit">
                        <Edit className="policies-action-button" />
                      </button>
                      {!certificate.allocated && (
                        <button className="policies-action-button allocate">
                          <Plus className="policies-action-button" />
                        </button>
                      )}
                      {certificate.allocated && (
                        <button className="policies-action-button deallocate">
                          <RefreshCw className="policies-action-button" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="policies-container">
      {/* Header */}
      <div className="policies-header">
        <div className="policies-header-content">
          <div className="policies-header-left">
            <h1 className="policies-title">Policies</h1>
            <p className="policies-subtitle">Manage insurance policies, transactions, endorsements, and certificates</p>
          </div>
          <div className="policies-header-actions">
            <button className="policies-btn">
              <Download className="policies-btn-icon" />
              Export
            </button>
            <Link
              to="/agent/policies/new"
              className="policies-btn primary"
            >
              <Plus className="policies-btn-icon" />
              New Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="policies-search-section">
        <div className="policies-search-wrapper">
          <Search className="policies-search-icon" />
          <input
            type="text"
            placeholder="Search policies by number, client, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="policies-search-input"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="policies-tabs">
        <nav className="policies-tabs-list">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`policies-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon className="policies-tab-icon" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'endorsements' && renderEndorsements()}
        {activeTab === 'certificates' && renderCertificates()}
      </div>
    </div>
  );
};

export default Policies;
