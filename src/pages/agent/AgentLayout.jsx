import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Car, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  Calendar,
  Shield,
  Phone,
  Home,
  Folder,
  ChevronDown
} from 'lucide-react';
import './AgentLayout.css';

const AgentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fileDropdownOpen, setFileDropdownOpen] = useState(false);
  const [transactionFilesDropdownOpen, setTransactionFilesDropdownOpen] = useState(false);
  const [receiptsAndPaymentsDropdownOpen, setReceiptsAndPaymentsDropdownOpen] = useState(false);
  const [policyTransactionsDropdownOpen, setPolicyTransactionsDropdownOpen] = useState(false);
  const [certificatesDropdownOpen, setCertificatesDropdownOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/agent', icon: LayoutDashboard },
    { 
      name: 'File Management', 
      href: '/agent/file-management', 
      icon: Folder,
      children: [
        { name: 'Insurer/Insurance Company', href: '/agent/insurer-companies' },
        { name: 'Insurance Types', href: '/agent/insurance-types' },
        { name: 'Product File', href: '/agent/product-file' },
        // { name: 'Cover File', href: '/agent/cover-file' },
        { name: 'Extra Premium File', href: '/agent/extra-premium-file' },
        { name: 'Clients', href: '/agent/clients' },
        { name: 'Motor Vehicles', href: '/agent/motor' },
        { name: 'Posta Branches', href: '/agent/posta-branches' }
      ]
    },
    {
      name: 'Transaction Files', 
      href: '/agent/transaction-files', 
      icon: CreditCard,
      children: [
        { 
          name: 'Policy Transactions', 
          href: '/agent/transaction-files/policy-transactions',
          children: [
            { name: 'Policy Transaction', href: '/agent/transaction-files/policy-transactions/policy-transaction' },
            { name: 'Policy Renewal', href: '/agent/transaction-files/policy-transactions/policy-renewal' },
            { name: 'Policy Endorsement', href: '/agent/transaction-files/policy-transactions/policy-endorsement' },
            { name: 'Policy Renewal Note', href: '/agent/transaction-files/policy-transactions/policy-renewal-note' }
          ]
        },
        { 
          name: 'Certificates', 
          href: '/agent/transaction-files/certificates',
          children: [
            { name: 'Issue Certificate', href: '/agent/transaction-files/certificates/issue' },
            { name: 'Certificate Declaration', href: '/agent/transaction-files/certificates/declaration' },
            { name: 'Certificate Status', href: '/agent/transaction-files/certificates/status' }
          ]
        },
        { 
          name: 'Receipts and Payments', 
          href: '/agent/transaction-files/receipts-payments',
          children: [
            { name: 'Customers Receipts', href: '/agent/transaction-files/receipts-payments/customers-receipts' },
            { name: 'Premium', href: '/agent/transaction-files/receipts-payments/premium' },
            { name: 'Premium Payment Logs', href: '/agent/transaction-files/receipts-payments/premium-payment-logs' },
            { name: 'Insurer Payment', href: '/agent/transaction-files/receipts-payments/insurer-payment' },
            { name: 'Payment Link Generator', href: '/agent/transaction-files/receipts-payments/payment-link-generator' }
          ]
        },
        { 
          name: 'Claims', 
          href: '/agent/transaction-files/claims'
        },
        { 
          name: 'Policies', 
          href: '/agent/transaction-files/policies'
        }
      ]
    },
    { name: 'Settings', href: '/agent/settings', icon: Settings },
    { name: 'Main Website', href: '/', icon: Home, external: true },
  ];

  const isActive = (path) => {
    if (path === '/agent') {
      return location.pathname === '/agent' || location.pathname === '/agent/';
    }
    // Check for exact match or if the path is a prefix followed by a slash
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="agent-layout">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Shield className="sidebar-logo" />
            <div>
              <h1 className="sidebar-title">Starzed Agent</h1>
              <p className="sidebar-subtitle">Insurance Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-list">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isFileManagementActive = item.name === 'File Management' && 
                item.children.some(child => location.pathname.startsWith(child.href));
              const isTransactionFilesActive = item.name === 'Transaction Files' && 
                item.children.some(child => location.pathname.startsWith(child.href));
              
              const getDropdownState = (itemName) => {
                switch(itemName) {
                  case 'File Management': return fileDropdownOpen;
                  case 'Transaction Files': return transactionFilesDropdownOpen;
                  case 'Policy Transactions': return policyTransactionsDropdownOpen;
                  case 'Certificates': return certificatesDropdownOpen;
                  case 'Receipts and Payments': return receiptsAndPaymentsDropdownOpen;
                  default: return false;
                }
              };
              
              const toggleDropdown = (itemName) => {
                switch(itemName) {
                  case 'File Management': 
                    setFileDropdownOpen(!fileDropdownOpen);
                    setTransactionFilesDropdownOpen(false);
                    setPolicyTransactionsDropdownOpen(false);
                    setCertificatesDropdownOpen(false);
                    setReceiptsAndPaymentsDropdownOpen(false);
                    break;
                  case 'Transaction Files': 
                    setTransactionFilesDropdownOpen(!transactionFilesDropdownOpen);
                    setFileDropdownOpen(false);
                    // Don't close nested dropdowns when toggling Transaction Files
                    break;
                  case 'Policy Transactions': 
                    setPolicyTransactionsDropdownOpen(!policyTransactionsDropdownOpen);
                    setFileDropdownOpen(false);
                    // Don't close Transaction Files when toggling Policy Transactions
                    break;
                  case 'Certificates': 
                    setCertificatesDropdownOpen(!certificatesDropdownOpen);
                    setFileDropdownOpen(false);
                    // Don't close Transaction Files when toggling Certificates
                    break;
                  case 'Receipts and Payments': 
                    setReceiptsAndPaymentsDropdownOpen(!receiptsAndPaymentsDropdownOpen);
                    setFileDropdownOpen(false);
                    // Don't close Transaction Files when toggling Receipts and Payments
                    break;
                }
              };
              
              const isActiveDropdown = (itemName) => {
                switch(itemName) {
                  case 'File Management': return isFileManagementActive;
                  case 'Transaction Files': return isTransactionFilesActive;
                  case 'Policy Transactions': return policyTransactionsDropdownOpen;
                  case 'Certificates': return certificatesDropdownOpen;
                  case 'Receipts and Payments': return receiptsAndPaymentsDropdownOpen;
                  default: return false;
                }
              };
              
              return (
                <React.Fragment key={item.name}>
                  {item.name === 'Main Website' && (
                    <div className="nav-divider" />
                  )}
                  {hasChildren ? (
                    <div className="nav-dropdown">
                      <button
                        className={`nav-item dropdown-toggle ${isActiveDropdown(item.name) ? 'active' : ''}`}
                        onClick={() => toggleDropdown(item.name)}
                      >
                        <Icon className="nav-icon" />
                        {item.name}
                        <ChevronDown className={`nav-chevron ${getDropdownState(item.name) ? 'open' : ''}`} />
                      </button>
                      {getDropdownState(item.name) && (
                        <div className="nav-dropdown-menu">
                          {item.children.map((child) => {
                            const childHasChildren = child.children && child.children.length > 0;
                            return childHasChildren ? (
                              <div key={child.name} className="nav-dropdown nested">
                                <button
                                  className={`nav-item dropdown-toggle ${isActiveDropdown(child.name) ? 'active' : ''}`}
                                  onClick={() => toggleDropdown(child.name)}
                                >
                                  {child.name}
                                  <ChevronDown className={`nav-chevron ${getDropdownState(child.name) ? 'open' : ''}`} />
                                </button>
                                {getDropdownState(child.name) && (
                                  <div className="nav-dropdown-menu nested">
                                    {child.children.map((grandchild) => (
                                      <Link
                                        key={grandchild.name}
                                        to={grandchild.href}
                                        className={`nav-item submenu-item ${location.pathname.startsWith(grandchild.href) ? 'active' : ''}`}
                                        onClick={() => setSidebarOpen(false)}
                                      >
                                        {grandchild.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={`nav-item submenu-item ${location.pathname.startsWith(child.href) ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`nav-item ${isActive(item.href) && !item.external ? 'active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="nav-icon" />
                      {item.name}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">
              JA
            </div>
            <div className="user-details">
              <p className="user-name">John Agent</p>
              <p className="user-email">agent@starzedinsurance.com</p>
            </div>
          </div>
          <button className="logout-btn">
            <LogOut className="logout-icon" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <header className="top-bar">
          <div className="top-bar-content">
            <button
              onClick={() => setSidebarOpen(true)}
              className="menu-btn"
            >
              <Menu className="menu-icon" />
            </button>
            <div className="top-bar-brand">
              <Shield className="top-bar-logo" />
              <span className="top-bar-title">Agent Portal</span>
            </div>
            <div className="spacer" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;
