import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertTriangle, Users, TrendingUp, DollarSign, FileText, Clock, ChevronRight, Download, Plus, Eye, Edit, User, FileCheck, CreditCard, BarChart3, Folder, ChevronDown, Building, FileSpreadsheet, FolderOpen, MapPin, ArrowLeft } from 'lucide-react';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const [showFileDropdown, setShowFileDropdown] = useState(false);
  const [stats, setStats] = useState({
    expiringCertificates: 0,
    policiesWithPremiumBalance: 0,
    expiredWithBalance: 0,
    expiringPolicies: 0,
    monthlyRevenue: 0,
    newClientsThisMonth: 0,
    pendingRenewals: 0,
    claimsThisMonth: 0
  });

  const [expiringPolicies, setExpiringPolicies] = useState([]);

  const [recentActivities, setRecentActivities] = useState([]);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="stat-card">
      <div className="stat-content">
        <div className="stat-info">
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className={`stat-icon-wrapper ${color}`}>
          <Icon className="stat-icon" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'expiring':
        return 'expiring';
      case 'expiring-with-balance':
        return 'with-balance';
      default:
        return 'expiring';
    }
  };

  const getDaysLeftColor = (days) => {
    if (days <= 7) return 'urgent';
    if (days <= 14) return 'warning';
    return 'normal';
  };

  return (
    <div className="agent-dashboard-container">
      {/* Header */}
      <div className="agent-dashboard-header">
        <div className="agent-dashboard-header-content">
          <div className="agent-dashboard-header-left">
            <h1 className="agent-dashboard-title">Agent Dashboard</h1>
            <p className="agent-dashboard-subtitle">Welcome back! Here's your insurance business overview.</p>
          </div>
          <div className="agent-dashboard-header-actions">
            <button className="agent-dashboard-header-button">
              <Download className="agent-dashboard-header-icon" />
              Export Report
            </button>
            <Link
              to="/agent/reports"
              className="agent-dashboard-header-button primary"
            >
              <TrendingUp className="agent-dashboard-header-icon" />
              View Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="agent-dashboard-stats-grid">
        <div className="agent-dashboard-stat-card">
          <div className="agent-dashboard-stat-content">
            <div className="agent-dashboard-stat-info">
              <p className="agent-dashboard-stat-title">Expiring Certificates</p>
              <p className="agent-dashboard-stat-value">{stats.expiringCertificates}</p>
            </div>
            <div className="agent-dashboard-stat-icon-wrapper blue">
              <Calendar className="agent-dashboard-stat-icon" />
            </div>
          </div>
        </div>
        <div className="agent-dashboard-stat-card">
          <div className="agent-dashboard-stat-content">
            <div className="agent-dashboard-stat-info">
              <p className="agent-dashboard-stat-title">Policies With Premium Balance</p>
              <p className="agent-dashboard-stat-value">{stats.policiesWithPremiumBalance}</p>
            </div>
            <div className="agent-dashboard-stat-icon-wrapper green">
              <DollarSign className="agent-dashboard-stat-icon" />
            </div>
          </div>
        </div>
        <div className="agent-dashboard-stat-card">
          <div className="agent-dashboard-stat-content">
            <div className="agent-dashboard-stat-info">
              <p className="agent-dashboard-stat-title">Expired With Balance</p>
              <p className="agent-dashboard-stat-value">{stats.expiredWithBalance}</p>
            </div>
            <div className="agent-dashboard-stat-icon-wrapper orange">
              <AlertTriangle className="agent-dashboard-stat-icon" />
            </div>
          </div>
        </div>
        <div className="agent-dashboard-stat-card">
          <div className="agent-dashboard-stat-content">
            <div className="agent-dashboard-stat-info">
              <p className="agent-dashboard-stat-title">Expiring Policies</p>
              <p className="agent-dashboard-stat-value">{stats.expiringPolicies}</p>
            </div>
            <div className="agent-dashboard-stat-icon-wrapper purple">
              <Clock className="agent-dashboard-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="agent-dashboard-quick-actions">
        <div className="agent-dashboard-quick-actions-body">
          <div className="agent-dashboard-quick-actions-grid">
            <button className="agent-dashboard-quick-action-btn blue">
              <Plus className="agent-dashboard-quick-action-icon" />
              New Policy
            </button>
            <button className="agent-dashboard-quick-action-btn green">
              <User className="agent-dashboard-quick-action-icon" />
              Add Client
            </button>
            <button className="agent-dashboard-quick-action-btn purple">
              <FileCheck className="agent-dashboard-quick-action-icon" />
              Issue Certificate
            </button>
            <button className="agent-dashboard-quick-action-btn orange">
              <CreditCard className="agent-dashboard-quick-action-icon" />
              Process Payment
            </button>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="agent-dashboard-tables-grid">
        {/* Expiring Certificates Table */}
        <div className="agent-dashboard-table-card">
          <div className="agent-dashboard-table-header">
            <h3 className="agent-dashboard-table-title">Certificate Status</h3>
            <span className="agent-dashboard-table-count">{stats.expiringCertificates} certificates</span>
          </div>
          <div className="agent-dashboard-table-body">
            <div className="agent-dashboard-table">
              <div className="agent-dashboard-table-head">
                <div className="agent-dashboard-table-row">
                  <div className="agent-dashboard-table-cell">Name</div>
                  <div className="agent-dashboard-table-cell">Cert No</div>
                  <div className="agent-dashboard-table-cell">No. Days</div>
                  <div className="agent-dashboard-table-cell">Amount</div>
                </div>
              </div>
              <div className="agent-dashboard-table-body">
                {stats.expiringCertificates === 0 ? (
                  <div className="agent-dashboard-table-row">
                    <div className="agent-dashboard-table-cell" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                      No expiring certificates found
                    </div>
                  </div>
                ) : (
                  <div className="agent-dashboard-table-row">
                    <div className="agent-dashboard-table-cell">Loading...</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Policies With Premium Balance Table */}
        <div className="agent-dashboard-table-card">
          <div className="agent-dashboard-table-header">
            <h3 className="agent-dashboard-table-title">Policies With Premium Balance</h3>
            <span className="agent-dashboard-table-count">{stats.policiesWithPremiumBalance} policies</span>
          </div>
          <div className="agent-dashboard-table-body">
            <div className="agent-dashboard-table">
              <div className="agent-dashboard-table-head">
                <div className="agent-dashboard-table-row">
                  <div className="agent-dashboard-table-cell">Client Name</div>
                  <div className="agent-dashboard-table-cell">Policy No</div>
                  <div className="agent-dashboard-table-cell">Class</div>
                  <div className="agent-dashboard-table-cell">Expiry</div>
                  <div className="agent-dashboard-table-cell">Amount</div>
                </div>
              </div>
              <div className="agent-dashboard-table-body">
                {stats.policiesWithPremiumBalance === 0 ? (
                  <div className="agent-dashboard-table-row">
                    <div className="agent-dashboard-table-cell" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                      No policies with premium balance found
                    </div>
                  </div>
                ) : (
                  <div className="agent-dashboard-table-row">
                    <div className="agent-dashboard-table-cell">Loading...</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expired With Balance Table */}
        <div className="agent-dashboard-table-card">
          <div className="agent-dashboard-table-header">
            <h3 className="agent-dashboard-table-title">Expire With Balance</h3>
            <span className="agent-dashboard-table-count">{stats.expiredWithBalance} policies</span>
          </div>
          <div className="agent-dashboard-table-body">
            <div className="agent-dashboard-table">
              <div className="agent-dashboard-table-head">
                <div className="agent-dashboard-table-row">
                  <div className="agent-dashboard-table-cell">Name</div>
                  <div className="agent-dashboard-table-cell">Class</div>
                  <div className="agent-dashboard-table-cell">Policy No.</div>
                  <div className="agent-dashboard-table-cell">Date</div>
                  <div className="agent-dashboard-table-cell">Amount</div>
                </div>
              </div>
              <div className="agent-dashboard-table-body">
                {stats.expiredWithBalance === 0 ? (
                  <div className="agent-dashboard-table-row">
                    <div className="agent-dashboard-table-cell" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                      No expired policies with balance found
                    </div>
                  </div>
                ) : (
                  <div className="agent-dashboard-table-row">
                    <div className="agent-dashboard-table-cell">Loading...</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expiring Policies Table */}
        <div className="agent-dashboard-table-card">
          <div className="agent-dashboard-table-header">
            <h3 className="agent-dashboard-table-title">Expiring Policies</h3>
            <span className="agent-dashboard-table-count">{stats.expiringPolicies} policies</span>
          </div>
          <div className="agent-dashboard-table-body">
            <div className="agent-dashboard-table">
              <div className="agent-dashboard-table-head">
                <div className="agent-dashboard-table-row">
                  <div className="agent-dashboard-table-cell">Name</div>
                  <div className="agent-dashboard-table-cell">Class</div>
                  <div className="agent-dashboard-table-cell">Policy No.</div>
                  <div className="agent-dashboard-table-cell">Date</div>
                  <div className="agent-dashboard-table-cell">Premium</div>
                </div>
              </div>
              <div className="agent-dashboard-table-body">
                {stats.expiringPolicies === 0 ? (
                  <div className="agent-dashboard-table-row">
                    <div className="agent-dashboard-table-cell" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                      No expiring policies found
                    </div>
                  </div>
                ) : (
                  <div className="agent-dashboard-table-row">
                    <div className="agent-dashboard-table-cell">Loading...</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                    <div className="agent-dashboard-table-cell">-</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
