import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, Calendar, TrendingUp, TrendingDown, DollarSign, Users, FileText, BarChart3, PieChart, Activity, ArrowLeft } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [showFilters, setShowFilters] = useState(false);

  // Stats data
  const [stats, setStats] = useState({
    totalReports: 24,
    thisMonth: 9,
    downloads: 157,
    scheduledReports: 4
  });

  const [reports, setReports] = useState([]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'sales':
        return 'text-green-600 bg-green-100';
      case 'renewals':
        return 'text-blue-600 bg-blue-100';
      case 'claims':
        return 'text-purple-600 bg-purple-100';
      case 'clients':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'generating':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownload = (report) => {
    if (report.downloadUrl) {
      console.log(`Downloading report: ${report.name}`);
    }
  };

  const handleGenerateSalesReport = () => {
    console.log('Generating Sales Report...');
    // Navigate to sales report generation page or open modal
  };

  const handleGeneratePerformanceReport = () => {
    console.log('Generating Performance Analysis...');
    // Navigate to performance report generation page or open modal
  };

  const handleGeneratePortfolioReport = () => {
    console.log('Generating Portfolio Summary...');
    // Navigate to portfolio report generation page or open modal
  };

  const handleGenerateClientReport = () => {
    console.log('Generating Client Insights...');
    // Navigate to client insights report generation page or open modal
  };

  const handleScheduleReports = () => {
    console.log('Opening Schedule Reports modal...');
    // Open schedule reports modal
  };

  const handleViewReport = (report) => {
    console.log(`Viewing report: ${report.name}`);
    // Open report viewer or navigate to report details
  };

  const handleEditReport = (report) => {
    console.log(`Editing report: ${report.name}`);
    // Open edit modal or navigate to edit page
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesPeriod = filterPeriod === 'all' || report.period.toLowerCase().includes(filterPeriod);
    return matchesSearch && matchesType && matchesPeriod;
  });

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reports & Analytics</h1>
        <p>Generate and analyze business reports</p>
      </div>

      <div className="reports-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FileText />
          </div>
          <div className="stat-content">
            <h3>Total Reports</h3>
            <p>{stats.totalReports}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon monthly">
            <Calendar />
          </div>
          <div className="stat-content">
            <h3>This Month</h3>
            <p>{stats.thisMonth}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon downloads">
            <Download />
          </div>
          <div className="stat-content">
            <h3>Downloads</h3>
            <p>{stats.downloads}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon scheduled">
            <Activity />
          </div>
          <div className="stat-content">
            <h3>Scheduled</h3>
            <p>{stats.scheduledReports}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <button className="action-card" onClick={handleGenerateSalesReport}>
            <BarChart3 size={24} />
            <span>Sales Report</span>
          </button>
          <button className="action-card" onClick={handleGeneratePerformanceReport}>
            <TrendingUp size={24} />
            <span>Performance Analysis</span>
          </button>
          <button className="action-card" onClick={handleGeneratePortfolioReport}>
            <PieChart size={24} />
            <span>Portfolio Summary</span>
          </button>
          <button className="action-card" onClick={handleGenerateClientReport}>
            <Users size={24} />
            <span>Client Insights</span>
          </button>
        </div>
      </div>

      <div className="reports-actions">
        <div className="search-filter-container">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        <div className="action-buttons">
          <button className="generate-btn">
            <Plus size={20} />
            Generate Report
          </button>
          <button className="schedule-btn" onClick={handleScheduleReports}>
            <Calendar size={20} />
            Schedule Reports
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Report Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="sales">Sales</option>
              <option value="renewals">Renewals</option>
              <option value="claims">Claims</option>
              <option value="clients">Clients</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Period</label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      )}

      <div className="reports-table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Period</th>
              <th>Generated</th>
              <th>File Size</th>
              <th>Format</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td className="report-name">
                  <FileText size={16} />
                  {report.name}
                </td>
                <td>
                  <span className={`type-badge ${getTypeColor(report.type)}`}>
                    {report.type}
                  </span>
                </td>
                <td className="description">
                  {report.description}
                </td>
                <td className="period">
                  <Calendar size={16} />
                  {report.period}
                </td>
                <td className="date">
                  {report.generatedDate}
                </td>
                <td className="file-size">
                  {report.fileSize}
                </td>
                <td className="format">
                  {report.format}
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-cell">
                    <button className="view-btn" title="View Report" onClick={() => handleViewReport(report)}>
                      <Eye size={16} />
                    </button>
                    <button 
                      className="download-btn" 
                      title="Download Report"
                      onClick={() => handleDownload(report)}
                      disabled={!report.downloadUrl}
                    >
                      <Download size={16} />
                    </button>
                    <button className="edit-btn" title="Edit Report" onClick={() => handleEditReport(report)}>
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="no-results">
          <FileText size={48} />
          <h3>No reports found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
