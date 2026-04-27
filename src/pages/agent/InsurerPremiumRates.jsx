import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, FileSpreadsheet, ArrowLeft, DollarSign, TrendingUp, Building } from 'lucide-react';
import './InsurerPremiumRates.css';

const InsurerPremiumRates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('company');

  const [premiumRates] = useState([]);

  const companies = [];
  const categories = [];

  const filteredRates = premiumRates.filter(rate => {
    const matchesSearch = rate.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.companyCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = selectedCompany === 'all' || rate.company === selectedCompany;
    const matchesCategory = selectedCategory === 'all' || rate.category === selectedCategory;
    
    return matchesSearch && matchesCompany && matchesCategory;
  });

  const sortedRates = [...filteredRates].sort((a, b) => {
    switch (sortBy) {
      case 'company':
        return a.company.localeCompare(b.company);
      case 'premium':
        return b.totalPremium - a.totalPremium;
      case 'commission':
        return b.commissionRate - a.commissionRate;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const totalPremium = filteredRates.reduce((sum, rate) => sum + rate.totalPremium, 0);
  const totalCommission = filteredRates.reduce((sum, rate) => sum + rate.commissionAmount, 0);
  const averageCommissionRate = filteredRates.length > 0 
    ? (filteredRates.reduce((sum, rate) => sum + rate.commissionRate, 0) / filteredRates.length).toFixed(1)
    : 0;

  return (
    <div className="premium-rates-container">
      {/* Header */}
      <div className="premium-rates-header">
        <div className="premium-rates-header-content">
          <div className="premium-rates-header-left">
            <h1 className="premium-rates-title">Insurer Premium Rates</h1>
            <p className="premium-rates-subtitle">Manage and view all insurance premium rates</p>
          </div>
          <div className="premium-rates-header-actions">
            <button className="premium-rates-btn">
              <Download className="premium-rates-btn-icon" />
              Export
            </button>
            <button className="premium-rates-btn primary">
              <Plus className="premium-rates-btn-icon" />
              Add Rate
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="premium-rates-stats-grid">
        <div className="premium-rates-stat-card">
          <div className="premium-rates-stat-content">
            <div className="premium-rates-stat-info">
              <p className="premium-rates-stat-title">Total Rates</p>
              <p className="premium-rates-stat-value">{filteredRates.length}</p>
            </div>
            <div className="premium-rates-stat-icon-wrapper blue">
              <FileSpreadsheet className="premium-rates-stat-icon" />
            </div>
          </div>
        </div>
        <div className="premium-rates-stat-card">
          <div className="premium-rates-stat-content">
            <div className="premium-rates-stat-info">
              <p className="premium-rates-stat-title">Total Premium</p>
              <p className="premium-rates-stat-value">KES {totalPremium.toLocaleString()}</p>
            </div>
            <div className="premium-rates-stat-icon-wrapper green">
              <DollarSign className="premium-rates-stat-icon" />
            </div>
          </div>
        </div>
        <div className="premium-rates-stat-card">
          <div className="premium-rates-stat-content">
            <div className="premium-rates-stat-info">
              <p className="premium-rates-stat-title">Total Commission</p>
              <p className="premium-rates-stat-value">KES {totalCommission.toLocaleString()}</p>
            </div>
            <div className="premium-rates-stat-icon-wrapper orange">
              <TrendingUp className="premium-rates-stat-icon" />
            </div>
          </div>
        </div>
        <div className="premium-rates-stat-card">
          <div className="premium-rates-stat-content">
            <div className="premium-rates-stat-info">
              <p className="premium-rates-stat-title">Avg Commission Rate</p>
              <p className="premium-rates-stat-value">{averageCommissionRate}%</p>
            </div>
            <div className="premium-rates-stat-icon-wrapper purple">
              <Building className="premium-rates-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="premium-rates-filters-section">
        <div className="premium-rates-filters-row">
          <div className="premium-rates-search-wrapper">
            <Search className="premium-rates-search-icon" />
            <input
              type="text"
              placeholder="Search rates by company, category, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="premium-rates-search-input"
            />
          </div>
          <div className="premium-rates-filter-controls">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="premium-rates-filter-select"
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="premium-rates-filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="premium-rates-filter-select"
            >
              <option value="company">Sort by Company</option>
              <option value="premium">Sort by Premium</option>
              <option value="commission">Sort by Commission</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rates Table */}
      <div className="premium-rates-table-container">
        <div className="premium-rates-table-wrapper">
          <table className="premium-rates-table">
            <thead className="premium-rates-table-head">
              <tr className="premium-rates-table-row">
                <th className="premium-rates-table-header">Company</th>
                <th className="premium-rates-table-header">Category</th>
                <th className="premium-rates-table-header">Subcategory</th>
                <th className="premium-rates-table-header">Base Premium</th>
                <th className="premium-rates-table-header">Loading</th>
                <th className="premium-rates-table-header">Discounts</th>
                <th className="premium-rates-table-header">Total Premium</th>
                <th className="premium-rates-table-header">Commission</th>
                <th className="premium-rates-table-header">Effective Date</th>
                <th className="premium-rates-table-header">Status</th>
                <th className="premium-rates-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="premium-rates-table-body">
              {sortedRates.map((rate) => (
                <tr key={rate.id} className="premium-rates-table-row">
                  <td className="premium-rates-table-cell">
                    <div className="premium-rates-company-info">
                      <div className="premium-rates-company-name">{rate.company}</div>
                      <div className="premium-rates-company-code">{rate.companyCode}</div>
                    </div>
                  </td>
                  <td className="premium-rates-table-cell">
                    <span className="premium-rates-category-badge">{rate.category}</span>
                  </td>
                  <td className="premium-rates-table-cell">{rate.subcategory}</td>
                  <td className="premium-rates-table-cell premium-amount">KES {rate.basePremium.toLocaleString()}</td>
                  <td className="premium-rates-table-cell loading-amount">KES {rate.loading.toLocaleString()}</td>
                  <td className="premium-rates-table-cell discount-amount">KES {rate.discounts.toLocaleString()}</td>
                  <td className="premium-rates-table-cell total-amount">KES {rate.totalPremium.toLocaleString()}</td>
                  <td className="premium-rates-table-cell">
                    <div className="premium-rates-commission-info">
                      <div className="premium-rates-commission-rate">{rate.commissionRate}%</div>
                      <div className="premium-rates-commission-amount">KES {rate.commissionAmount.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="premium-rates-table-cell">
                    <div className="premium-rates-date-info">
                      <div className="premium-rates-effective-date">{rate.effectiveDate}</div>
                      <div className="premium-rates-expiry-date">{rate.expiryDate}</div>
                    </div>
                  </td>
                  <td className="premium-rates-table-cell">
                    <span className={`premium-rates-status-badge ${rate.status.toLowerCase()}`}>
                      {rate.status}
                    </span>
                  </td>
                  <td className="premium-rates-table-cell">
                    <div className="premium-rates-actions">
                      <button className="premium-rates-action-btn view">
                        <Eye className="premium-rates-action-icon" />
                      </button>
                      <button className="premium-rates-action-btn edit">
                        <Edit className="premium-rates-action-icon" />
                      </button>
                      <button className="premium-rates-action-btn delete">
                        <Trash2 className="premium-rates-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedRates.length === 0 && (
        <div className="premium-rates-empty-state">
          <FileSpreadsheet className="premium-rates-empty-icon" />
          <h3 className="premium-rates-empty-title">No premium rates found</h3>
          <p className="premium-rates-empty-description">
            Try adjusting your search criteria or add a new premium rate.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsurerPremiumRates;
