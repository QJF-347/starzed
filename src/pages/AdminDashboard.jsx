import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Briefcase,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Globe,
  Settings,
  Building2,
  User
} from 'lucide-react';
import logo from '../assets/images/STARZED_LOGO-removebg-preview.png';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      description: 'Overview and statistics'
    },
    {
      title: 'Products',
      icon: Package,
      path: '/admin/products',
      description: 'Manage insurance products'
    },
    {
      title: 'Policies',
      icon: Briefcase,
      path: '/admin/policies',
      description: 'Manage insurance policies'
    },
    {
      title: 'Companies',
      icon: Building2,
      path: '/admin/companies',
      description: 'Manage insurance companies'
    },
    {
      title: 'Blogs',
      icon: FileText,
      path: '/admin/blogs',
      description: 'Manage blog posts'
    },
    {
      title: 'Users',
      icon: Users,
      path: '/admin/users',
      description: 'Manage user accounts'
    },
    {
      title: 'Initial Setup',
      icon: Settings,
      path: '/admin/setup',
      description: 'Database initialization'
    },
    {
      title: 'Agent Portal',
      icon: User,
      path: '/agent',
      description: 'Go to agent dashboard'
    },
    {
      title: 'Back to Website',
      icon: Globe,
      path: '/',
      description: 'View public site'
    }
  ];

  return (
    <div className="admin-dashboard">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <h1>Starzed Admin</h1>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
        </button>
      </div>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <img src={logo} alt="Starzed Logo" className="admin-logo-img" />
            <span>Starzed Admin</span>
          </div>
        </div>

        <nav className="admin-nav">
          <ul className="admin-nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="admin-nav-item">
                <Link
                  to={item.path}
                  className="admin-nav-link"
                >
                  <item.icon size={20} />
                  <span className="nav-title">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          {user && (
            <div className="admin-user-info">
              <div className="user-avatar">
                {user.first_name?.charAt(0) || ''}{user.last_name?.charAt(0) || ''}
              </div>
              <div className="user-details">
                <span className="user-name">
                  {user.first_name} {user.last_name}
                </span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
          )}
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Menu */}
      {mobileNavOpen && (
        <div className="mobile-nav-menu active">
          <div className="mobile-nav-content">
            <div className="mobile-nav-header">
              <h2 className="mobile-nav-title">Navigation</h2>
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileNavOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="mobile-nav-grid">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="mobile-nav-item"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <item.icon size={24} />
                  <div className="mobile-nav-item-title">{item.title}</div>
                </Link>
              ))}
            </div>

            <div className="mobile-nav-footer">
              {user && (
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {user.first_name?.charAt(0) || ''}{user.last_name?.charAt(0) || ''}
                  </div>
                  <div className="mobile-user-details">
                    <div className="mobile-user-name">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="mobile-user-role">{user.role}</div>
                  </div>
                </div>
              )}
              <button className="mobile-logout-btn" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
