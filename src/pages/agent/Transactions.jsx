import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Eye, Edit, CreditCard, Calendar, DollarSign, User, FileText, CheckCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import './Transactions.css';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = (transaction.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.policyNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'premium':
        return 'text-blue-600 bg-blue-100';
      case 'claim':
        return 'text-purple-600 bg-purple-100';
      case 'refund':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <p>Manage and track all financial transactions</p>
      </div>

      <div className="transactions-actions">
        <div className="search-filter-container">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
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
          <button className="export-btn">
            <Download size={20} />
            Export
          </button>
          <button className="add-btn">
            <Plus size={20} />
            Add Transaction
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="premium">Premium</option>
              <option value="claim">Claim</option>
              <option value="refund">Refund</option>
            </select>
          </div>
        </div>
      )}

      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Client</th>
              <th>Policy</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="transaction-id">
                  <FileText size={16} />
                  {transaction.transactionId}
                </td>
                <td>
                  <div className="client-info">
                    <div className="client-name">{transaction.clientName}</div>
                    <div className="client-email">{transaction.clientEmail}</div>
                  </div>
                </td>
                <td>
                  <div className="policy-info">
                    <div className="policy-number">{transaction.policyNumber}</div>
                    <div className="policy-type">{transaction.policyType}</div>
                  </div>
                </td>
                <td>
                  <span className={`type-badge ${getTypeColor(transaction.type)}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="amount">
                  <DollarSign size={16} />
                  KES {transaction.amount.toLocaleString()}
                </td>
                <td>
                  <div className="payment-method">
                    <CreditCard size={16} />
                    {transaction.method}
                  </div>
                </td>
                <td className="date">
                  <Calendar size={16} />
                  {transaction.date}
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(transaction.status)}`}>
                    {transaction.status === 'completed' && <CheckCircle size={14} />}
                    {transaction.status === 'pending' && <Clock size={14} />}
                    {transaction.status === 'failed' && <AlertTriangle size={14} />}
                    {transaction.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-cell">
                    <button className="view-btn" title="View Details">
                      <Eye size={16} />
                    </button>
                    <button className="edit-btn" title="Edit Transaction">
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="no-results">
          <FileText size={48} />
          <h3>No transactions found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
