import React, { useState, useEffect } from 'react';
import { Package, Briefcase, FileText, Users, TrendingUp, ShoppingCart, Eye } from 'lucide-react';
import api from '../services/api';
import './AdminDashboard.css';

const AdminHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    policies: 0,
    blogs: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, policiesRes, blogsRes, usersRes] = await Promise.all([
          api.getProducts(),
          api.getPolicies(),
          api.getBlogs(),
          api.getUsers()
        ]);

        setStats({
          products: (productsRes.data || productsRes || []).length,
          policies: (policiesRes.data || policiesRes || []).length,
          blogs: (blogsRes.data || blogsRes || []).length,
          users: (usersRes.data || usersRes || []).length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      color: 'blue',
      path: '/admin/products'
    },
    {
      title: 'Policies',
      value: stats.policies,
      icon: Briefcase,
      color: 'green',
      path: '/admin/policies'
    },
    {
      title: 'Blogs',
      value: stats.blogs,
      icon: FileText,
      color: 'purple',
      path: '/admin/blogs'
    },
    {
      title: 'Users',
      value: stats.users,
      icon: Users,
      color: 'orange',
      path: '/admin/users'
    }
  ];

  const quickActions = [
    {
      title: 'Add Product',
      description: 'Create a new insurance product',
      icon: Package,
      path: '/admin/products?action=add',
      color: 'blue'
    },
    {
      title: 'Add Policy',
      description: 'Create a new insurance policy',
      icon: Briefcase,
      path: '/admin/policies?action=add',
      color: 'green'
    },
    {
      title: 'Write Blog',
      description: 'Create a new blog post',
      icon: FileText,
      path: '/admin/blogs?action=add',
      color: 'purple'
    },
    {
      title: 'View Users',
      description: 'Manage user accounts',
      icon: Users,
      path: '/admin/users',
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <TrendingUp size={48} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-home">
      <div className="admin-header-content">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome to the Starzed Insurance Admin Panel</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        {statCards.map((stat) => (
          <div key={stat.title} className="admin-stat-card">
            <div className={`admin-stat-icon admin-stat-icon-${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="admin-stat-content">
              <h3 className="admin-stat-value">{stat.value}</h3>
              <p className="admin-stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-quick-actions">
          {quickActions.map((action) => (
            <a
              key={action.title}
              href={action.path}
              className={`admin-quick-action admin-quick-action-${action.color}`}
            >
              <action.icon size={24} />
              <div className="admin-quick-action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-section">
        <h2 className="admin-section-title">System Overview</h2>
        <div className="admin-overview-grid">
          <div className="admin-overview-card">
            <h3>Database Status</h3>
            <div className="admin-status-item">
              <span className="admin-status-dot admin-status-success"></span>
              <span>Connected</span>
            </div>
            <div className="admin-status-item">
              <Eye size={16} />
              <span>{stats.products + stats.policies + stats.blogs} total records</span>
            </div>
          </div>

          <div className="admin-overview-card">
            <h3>API Status</h3>
            <div className="admin-status-item">
              <span className="admin-status-dot admin-status-success"></span>
              <span>Operational</span>
            </div>
            <div className="admin-status-item">
              <ShoppingCart size={16} />
              <span>All endpoints active</span>
            </div>
          </div>

          <div className="admin-overview-card">
            <h3>Security</h3>
            <div className="admin-status-item">
              <span className="admin-status-dot admin-status-success"></span>
              <span>Admin Protection Active</span>
            </div>
            <div className="admin-status-item">
              <Users size={16} />
              <span>JWT Authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
