import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertTriangle, Users, TrendingUp, DollarSign, FileText, Clock, ChevronRight, Search, Filter, Download, Plus, Eye, Edit, User, Car, Heart, Shield, Activity } from 'lucide-react';
import './Activities.css';

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [activities, setActivities] = useState([]);

  const [stats, setStats] = useState({
    totalActivities: 156,
    todayActivities: 12,
    weeklyActivities: 45,
    monthlyActivities: 156,
    policiesSold: 28,
    claimsProcessed: 15,
    meetingsHeld: 8,
    certificatesIssued: 32
  });

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.policyType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && activity.type === selectedFilter;
  });

  const getPolicyIcon = (policyType) => {
    switch (policyType.toLowerCase()) {
      case 'motor insurance':
        return Car;
      case 'medical insurance':
      case 'group medical':
        return Heart;
      case 'life insurance':
        return Shield;
      default:
        return FileText;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="activities-container">
      {/* Header */}
      <div className="activities-header">
        <div className="activities-header-content">
          <div>
            <h1 className="activities-title">Activities</h1>
            <p className="activities-subtitle">Track all your insurance business activities and transactions.</p>
          </div>
          <div className="activities-header-actions">
            <button className="activities-header-button">
              <Download className="activities-header-icon" />
              Export Report
            </button>
            <button className="activities-header-button primary">
              <Plus className="activities-header-icon" />
              Log Activity
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="activities-controls">
          <div className="activities-search-wrapper">
            <Search className="activities-search-icon" />
            <input
              type="text"
              placeholder="Search activities, clients, or policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="activities-search-input"
            />
          </div>
          <div className="activities-controls-content">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`activities-filter-button ${showFilters ? 'active' : ''}`}
            >
              <Filter className="activities-filter-icon" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="activities-stats-grid">
        <div className="activity-stat-card">
          <div className="activity-stat-content">
            <div className="activity-stat-info">
              <p className="activity-stat-title">Total Activities</p>
              <p className="activity-stat-value">{stats.totalActivities}</p>
            </div>
            <div className="activity-stat-icon-wrapper blue">
              <Activity className="activity-stat-icon" />
            </div>
          </div>
        </div>
        <div className="activity-stat-card">
          <div className="activity-stat-content">
            <div className="activity-stat-info">
              <p className="activity-stat-title">Today</p>
              <p className="activity-stat-value">{stats.todayActivities}</p>
            </div>
            <div className="activity-stat-icon-wrapper green">
              <Calendar className="activity-stat-icon" />
            </div>
          </div>
        </div>
        <div className="activity-stat-card">
          <div className="activity-stat-content">
            <div className="activity-stat-info">
              <p className="activity-stat-title">This Week</p>
              <p className="activity-stat-value">{stats.weeklyActivities}</p>
            </div>
            <div className="activity-stat-icon-wrapper orange">
              <TrendingUp className="activity-stat-icon" />
            </div>
          </div>
        </div>
        <div className="activity-stat-card">
          <div className="activity-stat-content">
            <div className="activity-stat-info">
              <p className="activity-stat-title">This Month</p>
              <p className="activity-stat-value">{stats.monthlyActivities}</p>
            </div>
            <div className="activity-stat-icon-wrapper purple">
              <Clock className="activity-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Filters */}
      {showFilters && (
        <div className="activities-filters">
          <div className="activities-filters-header">
            <h3 className="activities-filters-title">Filter by Type</h3>
          </div>
          <div className="activities-filters-grid">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`activities-filter-chip ${selectedFilter === 'all' ? 'active' : ''}`}
            >
              All Activities
            </button>
            <button
              onClick={() => setSelectedFilter('policy_sold')}
              className={`activities-filter-chip ${selectedFilter === 'policy_sold' ? 'active' : ''}`}
            >
              Policy Sold
            </button>
            <button
              onClick={() => setSelectedFilter('claim_processed')}
              className={`activities-filter-chip ${selectedFilter === 'claim_processed' ? 'active' : ''}`}
            >
              Claims
            </button>
            <button
              onClick={() => setSelectedFilter('client_meeting')}
              className={`activities-filter-chip ${selectedFilter === 'client_meeting' ? 'active' : ''}`}
            >
              Meetings
            </button>
            <button
              onClick={() => setSelectedFilter('renewal_reminder')}
              className={`activities-filter-chip ${selectedFilter === 'renewal_reminder' ? 'active' : ''}`}
            >
              Renewals
            </button>
            <button
              onClick={() => setSelectedFilter('certificate_issued')}
              className={`activities-filter-chip ${selectedFilter === 'certificate_issued' ? 'active' : ''}`}
            >
              Certificates
            </button>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="activities-list-container">
        <div className="activities-list-header">
          <h2 className="activities-list-title">Recent Activities</h2>
          <span className="activities-list-count">{filteredActivities.length} activities</span>
        </div>
        
        <div className="activities-list">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon-wrapper">
                <activity.icon className={`activity-icon ${activity.color}`} />
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <div className="activity-title-section">
                    <h3 className="activity-title">{activity.title}</h3>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-meta">
                    {activity.amount > 0 && (
                      <span className="activity-amount">{formatAmount(activity.amount)}</span>
                    )}
                  </div>
                </div>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-details">
                  <div className="activity-detail-item">
                    <User className="activity-detail-icon" />
                    <span>{activity.clientName}</span>
                  </div>
                  {activity.policyType !== 'N/A' && (
                    <div className="activity-detail-item">
                      {(() => {
                        const PolicyIcon = getPolicyIcon(activity.policyType);
                        return <PolicyIcon className="activity-detail-icon" />;
                      })()}
                      <span>{activity.policyType}</span>
                    </div>
                  )}
                  {activity.policyNumber !== 'N/A' && (
                    <div className="activity-detail-item">
                      <FileText className="activity-detail-icon" />
                      <span>{activity.policyNumber}</span>
                    </div>
                  )}
                  <div className="activity-detail-item">
                    <Calendar className="activity-detail-icon" />
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="activity-actions">
                <button className="activity-action-btn">
                  <Eye className="activity-action-icon" />
                </button>
                <button className="activity-action-btn">
                  <Edit className="activity-action-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
