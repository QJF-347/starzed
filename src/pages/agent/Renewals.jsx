import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Calendar, AlertTriangle, CheckCircle, Clock, User, FileText, RefreshCw, Mail, Phone, ChevronRight, ArrowLeft } from 'lucide-react';
import './Renewals.css';

const Renewals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [renewals, setRenewals] = useState([]);

  const filteredRenewals = renewals.filter(renewal => {
    const matchesSearch = renewal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         renewal.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         renewal.policyType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || renewal.status === filterStatus;
    const matchesPeriod = filterPeriod === 'all' || 
                         (filterPeriod === '30-days' && renewal.daysLeft <= 30 && renewal.daysLeft > 0) ||
                         (filterPeriod === '7-days' && renewal.daysLeft <= 7 && renewal.daysLeft > 0) ||
                         (filterPeriod === 'expired' && renewal.daysLeft < 0);
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const handleContactClient = (renewal, method) => {
    console.log(`Contacting ${renewal.clientName} via ${method}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'expiring-soon':
        return 'expiring';
      case 'upcoming':
        return 'upcoming';
      case 'expired':
        return 'expired';
      default:
        return 'expiring';
    }
  };

  const getRenewalStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'confirmed';
      case 'pending':
        return 'pending';
      case 'lost':
        return 'lost';
      default:
        return 'pending';
    }
  };

  const getDaysLeftColor = (days) => {
    if (days <= 7) return 'urgent';
    if (days <= 14) return 'warning';
    return 'normal';
  };

  return (
    <div className="renewals-container">
      {/* Header */}
      <div className="renewals-header">
        <div className="renewals-header-content">
          <div>
            <h1 className="renewals-header-title">Policy Renewals</h1>
            <p className="renewals-header-subtitle">Manage and track policy renewals</p>
          </div>
          <div className="renewals-header-actions">
            <button className="renewals-header-button">
              <Download className="renewals-header-icon" />
              Export Report
            </button>
            <button className="renewals-header-button primary">
              <Mail className="renewals-header-icon" />
              Send Reminders
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="renewals-controls">
          <div className="renewals-search-wrapper">
            <Search className="renewals-search-icon" />
            <input
              type="text"
              placeholder="Search renewals by client, policy number, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="renewals-search-input"
            />
          </div>
          <div className="renewals-controls-content">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`renewals-filter-button ${showFilters ? 'active' : ''}`}
            >
              <Filter className="renewals-filter-icon" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="renewals-stats-grid">
        <div className="renewals-stat-card">
          <div className="renewals-stat-icon-wrapper expiring">
            <AlertTriangle className="renewals-stat-icon" />
          </div>
          <div className="renewals-stat-content">
            <h3 className="renewals-stat-title">Expiring Soon</h3>
            <p className="renewals-stat-value">{renewals.filter(r => r.status === 'expiring-soon').length}</p>
            <p className="renewals-stat-change">Next 7 days</p>
          </div>
        </div>
        <div className="renewals-stat-card">
          <div className="renewals-stat-icon-wrapper upcoming">
            <Calendar className="renewals-stat-icon" />
          </div>
          <div className="renewals-stat-content">
            <h3 className="renewals-stat-title">Upcoming</h3>
            <p className="renewals-stat-value">{renewals.filter(r => r.status === 'upcoming').length}</p>
            <p className="renewals-stat-change">Next 30 days</p>
          </div>
        </div>
        <div className="renewals-stat-card">
          <div className="renewals-stat-icon-wrapper confirmed">
            <CheckCircle className="renewals-stat-icon" />
          </div>
          <div className="renewals-stat-content">
            <h3 className="renewals-stat-title">Confirmed</h3>
            <p className="renewals-stat-value">{renewals.filter(r => r.renewalStatus === 'confirmed').length}</p>
            <p className="renewals-stat-change">This month</p>
          </div>
        </div>
        <div className="renewals-stat-card">
          <div className="renewals-stat-icon-wrapper lost">
            <Clock className="renewals-stat-icon" />
          </div>
          <div className="renewals-stat-content">
            <h3 className="renewals-stat-title">Lost</h3>
            <p className="renewals-stat-value">{renewals.filter(r => r.renewalStatus === 'lost').length}</p>
            <p className="renewals-stat-change">This quarter</p>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="renewals-filters-panel">
          <div className="renewals-filter-group">
            <label className="renewals-filter-label">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="renewals-filter-select"
            >
              <option value="all">All Status</option>
              <option value="expiring-soon">Expiring Soon</option>
              <option value="upcoming">Upcoming</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          
          <div className="renewals-filter-group">
            <label className="renewals-filter-label">Period</label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="renewals-filter-select"
            >
              <option value="all">All Periods</option>
              <option value="7-days">Next 7 Days</option>
              <option value="30-days">Next 30 Days</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      )}

      {/* Renewals Table */}
      <div className="renewals-table-container">
        <table className="renewals-table">
          <thead>
            <tr>
              <th className="renewals-table-head">Policy</th>
              <th className="renewals-table-head">Client</th>
              <th className="renewals-table-head">Policy Type</th>
              <th className="renewals-table-head">Current Premium</th>
              <th className="renewals-table-head">Renewal Premium</th>
              <th className="renewals-table-head">Expiry Date</th>
              <th className="renewals-table-head">Days Left</th>
              <th className="renewals-table-head">Status</th>
              <th className="renewals-table-head">Renewal Status</th>
              <th className="renewals-table-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRenewals.map((renewal) => (
              <tr key={renewal.id} className="renewals-table-row-hover">
                <td className="renewals-table-cell">
                  <div className="renewals-policy-info">
                    <FileText className="renewals-policy-icon" />
                    <div className="renewals-policy-details">
                      <div className="renewals-policy-number">{renewal.policyNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="renewals-table-cell">
                  <div className="renewals-client-info">
                    <div className="renewals-client-name">{renewal.clientName}</div>
                    <div className="renewals-client-email">{renewal.clientEmail}</div>
                    <div className="renewals-client-phone">{renewal.clientPhone}</div>
                  </div>
                </td>
                <td className="renewals-table-cell">
                  <div className="renewals-policy-info">
                    <div className="renewals-policy-type">{renewal.policyType}</div>
                    {renewal.vehicle && <div className="renewals-policy-detail">{renewal.vehicle}</div>}
                    {renewal.cover && <div className="renewals-policy-detail">{renewal.cover}</div>}
                  </div>
                </td>
                <td className="renewals-table-cell">
                  <div className="renewals-amount-info">
                    <div className="renewals-current-premium">KES {renewal.currentPremium.toLocaleString()}</div>
                  </div>
                </td>
                <td className="renewals-table-cell">
                  <div className="renewals-amount-info renewal-premium">
                    <div className="renewals-renewal-premium">KES {renewal.renewalPremium.toLocaleString()}</div>
                  </div>
                </td>
                <td className="renewals-table-cell">
                  <div className="renewals-date-info">
                    <Calendar className="renewals-date-icon" />
                    <div className="renewals-expiry-date">{renewal.expiryDate}</div>
                  </div>
                </td>
                <td className="renewals-table-cell">
                  <span className={`renewals-days-badge ${getDaysLeftColor(renewal.daysLeft)}`}>
                    {renewal.daysLeft > 0 ? `${renewal.daysLeft} days` : `${Math.abs(renewal.daysLeft)} days ago`}
                  </span>
                </td>
                <td className="renewals-table-cell">
                  <span className={`renewals-status-badge ${getStatusColor(renewal.status)}`}>
                    {renewal.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="renewals-table-cell">
                  <span className={`renewals-renewal-status-badge ${getRenewalStatusColor(renewal.renewalStatus)}`}>
                    {renewal.renewalStatus}
                  </span>
                </td>
                <td className="renewals-table-cell renewals-table-cell-actions">
                  <div className="renewals-action-buttons">
                    <button className="renewals-action-btn view-btn" title="View Details">
                      <Eye className="renewals-action-icon" />
                    </button>
                    <button className="renewals-action-btn edit-btn" title="Edit Renewal">
                      <Edit className="renewals-action-icon" />
                    </button>
                    <button 
                      className="renewals-action-btn contact-btn" 
                      title="Contact Client"
                      onClick={() => handleContactClient(renewal, 'email')}
                    >
                      <Mail className="renewals-action-icon" />
                    </button>
                    <button 
                      className="renewals-action-btn call-btn" 
                      title="Call Client"
                      onClick={() => handleContactClient(renewal, 'phone')}
                    >
                      <Phone className="renewals-action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRenewals.length === 0 && (
        <div className="renewals-empty-state">
          <Calendar className="renewals-empty-icon" />
          <h3 className="renewals-empty-title">No renewals found</h3>
          <p className="renewals-empty-description">Try adjusting your search or filters</p>
          <Link to="/agent/policies" className="renewals-empty-button">
            <Plus className="renewals-empty-icon" />
            View All Policies
          </Link>
        </div>
      )}
    </div>
  );
};

export default Renewals;
