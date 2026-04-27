import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, ArrowLeft, Search, Plus, Edit, Trash2, Eye, Download, Upload, FileText, File, Image, FileSpreadsheet, FileArchive, Calendar, User, Tag, Filter, Building, Users, DollarSign, TrendingUp } from 'lucide-react';
import './AgentFiles.css';

const AgentFiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');

  const [files] = useState([]);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || file.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.uploadedDate) - new Date(a.uploadedDate);
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      case 'client':
        return a.client.localeCompare(b.client);
      case 'downloads':
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="agent-files-file-icon" />;
      case 'docx':
      case 'doc':
        return <FileText className="agent-files-file-icon" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="agent-files-file-icon" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="agent-files-file-icon" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="agent-files-file-icon" />;
      default:
        return <File className="agent-files-file-icon" />;
    }
  };

  const formatFileSize = (size) => {
    return size;
  };

  const totalFiles = filteredFiles.length;
  const totalSize = filteredFiles.reduce((sum, file) => sum + parseFloat(file.size), 0).toFixed(1);
  const totalDownloads = filteredFiles.reduce((sum, file) => sum + file.downloads, 0);
  const starredFiles = filteredFiles.filter(file => file.starred).length;

  return (
    <div className="agent-files-container">
      {/* Header */}
      <div className="agent-files-header">
        <div className="agent-files-header-content">
          <div className="agent-files-header-left">
            <h1 className="agent-files-title">Agent Files</h1>
            <p className="agent-files-subtitle">Manage and organize all your insurance documents</p>
          </div>
          <div className="agent-files-header-actions">
            <button className="agent-files-btn">
              <Upload className="agent-files-btn-icon" />
              Upload Files
            </button>
            <button className="agent-files-btn primary">
              <Plus className="agent-files-btn-icon" />
              New Folder
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="agent-files-stats-grid">
        <div className="agent-files-stat-card">
          <div className="agent-files-stat-content">
            <div className="agent-files-stat-info">
              <p className="agent-files-stat-title">Total Files</p>
              <p className="agent-files-stat-value">{totalFiles}</p>
            </div>
            <div className="agent-files-stat-icon-wrapper blue">
              <FileText className="agent-files-stat-icon" />
            </div>
          </div>
        </div>
        <div className="agent-files-stat-card">
          <div className="agent-files-stat-content">
            <div className="agent-files-stat-info">
              <p className="agent-files-stat-title">Total Size</p>
              <p className="agent-files-stat-value">{totalSize} MB</p>
            </div>
            <div className="agent-files-stat-icon-wrapper green">
              <FolderOpen className="agent-files-stat-icon" />
            </div>
          </div>
        </div>
        <div className="agent-files-stat-card">
          <div className="agent-files-stat-content">
            <div className="agent-files-stat-info">
              <p className="agent-files-stat-title">Total Downloads</p>
              <p className="agent-files-stat-value">{totalDownloads}</p>
            </div>
            <div className="agent-files-stat-icon-wrapper orange">
              <Download className="agent-files-stat-icon" />
            </div>
          </div>
        </div>
        <div className="agent-files-stat-card">
          <div className="agent-files-stat-content">
            <div className="agent-files-stat-info">
              <p className="agent-files-stat-title">Starred Files</p>
              <p className="agent-files-stat-value">{starredFiles}</p>
            </div>
            <div className="agent-files-stat-icon-wrapper purple">
              <Tag className="agent-files-stat-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="agent-files-search-section">
        <div className="agent-files-search-wrapper">
          <Search className="agent-files-search-icon" />
          <input
            type="text"
            placeholder="Search files by name, client, policy number, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="agent-files-search-input"
          />
        </div>
      </div>

      {/* Files Table */}
      <div className="agent-files-table-container">
        <div className="agent-files-table-wrapper">
          <table className="agent-files-table">
            <thead className="agent-files-table-head">
              <tr className="agent-files-table-row">
                <th className="agent-files-table-header">File Name</th>
                <th className="agent-files-table-header">Type</th>
                <th className="agent-files-table-header">Client</th>
                <th className="agent-files-table-header">Policy Number</th>
                <th className="agent-files-table-header">Category</th>
                <th className="agent-files-table-header">Size</th>
                <th className="agent-files-table-header">Uploaded Date</th>
                <th className="agent-files-table-header">Downloads</th>
                <th className="agent-files-table-header">Status</th>
                <th className="agent-files-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="agent-files-table-body">
              {sortedFiles.map((file) => (
                <tr key={file.id} className="agent-files-table-row">
                  <td className="agent-files-table-cell">
                    <div className="agent-files-file-info">
                      <div className="agent-files-file-icon-wrapper">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="agent-files-file-details">
                        <div className="agent-files-file-name">{file.name}</div>
                        <div className="agent-files-file-description">{file.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="agent-files-table-cell">
                    <span className="agent-files-file-type-badge">{file.type.toUpperCase()}</span>
                  </td>
                  <td className="agent-files-table-cell">{file.client}</td>
                  <td className="agent-files-table-cell">{file.policyNumber}</td>
                  <td className="agent-files-table-cell">{file.category}</td>
                  <td className="agent-files-table-cell">{formatFileSize(file.size)}</td>
                  <td className="agent-files-table-cell">{file.uploadedDate}</td>
                  <td className="agent-files-table-cell">{file.downloads}</td>
                  <td className="agent-files-table-cell">
                    <span className={`agent-files-status-badge ${file.status.toLowerCase()}`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="agent-files-table-cell">
                    <div className="agent-files-actions">
                      <button className="agent-files-action-btn view">
                        <Eye className="agent-files-action-icon" />
                      </button>
                      <button className="agent-files-action-btn download">
                        <Download className="agent-files-action-icon" />
                      </button>
                      <button className="agent-files-action-btn edit">
                        <Edit className="agent-files-action-icon" />
                      </button>
                      <button className="agent-files-action-btn delete">
                        <Trash2 className="agent-files-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedFiles.length === 0 && (
        <div className="agent-files-empty-state">
          <FolderOpen className="agent-files-empty-icon" />
          <h3 className="agent-files-empty-title">No files found</h3>
          <p className="agent-files-empty-description">
            Try adjusting your search criteria or upload new files.
          </p>
        </div>
      )}
    </div>
  );
};

export default AgentFiles;
