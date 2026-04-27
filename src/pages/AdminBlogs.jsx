import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Save, Eye, Star, Calendar, Clock, User } from 'lucide-react';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';
import '../components/ImageUpload.css';
import './AdminDashboard.css';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: '',
    readTime: '',
    category: '',
    image: '',
    tags: [],
    featured: false
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.getBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = () => {
    const nextId = Math.max(...blogs.map(b => b.id), 0) + 1;
    setFormData({
      id: nextId,
      title: '',
      excerpt: '',
      content: '',
      author: '',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: '5 min read',
      category: '',
      image: '',
      tags: [],
      featured: false
    });
    setShowAddModal(true);
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      date: blog.date,
      readTime: blog.readTime,
      category: blog.category,
      image: blog.image,
      tags: blog.tags || [],
      featured: blog.featured || false
    });
    setShowEditModal(true);
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowViewModal(true);
  };

  const handleDeleteBlog = async (blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await api.deleteBlog(blog.id);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showAddModal) {
        await api.createBlog(formData);
      } else {
        await api.updateBlog(selectedBlog.id, formData);
      }
      fetchBlogs();
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const filteredBlogs = blogs.filter(blog =>
    (blog.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.author || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="admin-loading">Loading blogs...</div>;
  }

  return (
    <div className="admin-blogs">
      <div className="admin-header-content">
        <div>
          <h1 className="admin-page-title">Blogs</h1>
          <p className="admin-page-subtitle">Manage blog posts</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAddBlog}>
          <Plus size={20} />
          Add Blog
        </button>
      </div>

      {/* Search */}
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Date</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <div className="admin-blog-title">
                    <strong>{blog.title}</strong>
                    <small>{blog.excerpt}</small>
                  </div>
                </td>
                <td>
                  <span className="admin-badge admin-badge-info">
                    {blog.category}
                  </span>
                </td>
                <td>
                  <div className="admin-blog-meta">
                    <User size={14} />
                    {blog.author}
                  </div>
                </td>
                <td>
                  <div className="admin-blog-meta">
                    <Calendar size={14} />
                    {blog.date}
                  </div>
                </td>
                <td>
                  <span className={`admin-badge ${blog.featured ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                    {blog.featured ? <Star size={12} /> : null}
                    {blog.featured ? 'Featured' : 'Standard'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleViewBlog(blog)}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="admin-btn-icon"
                      onClick={() => handleEditBlog(blog)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="admin-btn-icon admin-btn-icon-danger"
                      onClick={() => handleDeleteBlog(blog)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>{showAddModal ? 'Add Blog' : 'Edit Blog'}</h2>
              <button
                className="admin-btn-icon"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              {/* Basic Information */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Basic Information</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Blog ID</label>
                    <input
                      type="number"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="e.g., 1, 2, 3"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Enter blog title"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="e.g., Insurance Tips, Industry News"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Author name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Content</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className="admin-form-textarea"
                    rows="3"
                    placeholder="Brief summary of the blog post"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Full Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="admin-form-textarea"
                    rows="8"
                    placeholder="Complete blog content"
                    required
                  />
                </div>
              </div>

              {/* Metadata */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Metadata</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Date</label>
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="March 15, 2024"
                      required
                    />
                    <small className="admin-form-counter">Format: Month Day, Year</small>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Read Time</label>
                    <input
                      type="text"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="5 min read"
                      required
                    />
                    <small className="admin-form-counter">Estimated reading time</small>
                  </div>
                </div>
              </div>

              {/* Visual Assets */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Visual Assets</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Blog Image</label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(imageData) => setFormData(prev => ({ ...prev, image: imageData }))}
                    onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                    placeholder="Drag & drop blog image here or click to browse"
                    className="admin-blog-image-upload"
                  />
                  <small className="admin-form-counter">Upload blog image with drag & drop or copy & paste</small>
                </div>
              </div>

              {/* Tags */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Tags</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="admin-form-input"
                    placeholder="insurance, tips, guide"
                  />
                  <small className="admin-form-counter">Add blog tags separated by commas</small>
                </div>
              </div>

              {/* Options */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">Blog Options</h3>
                <div className="admin-form-group">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    <span>Mark as Featured Blog Post</span>
                  </label>
                  <small className="admin-form-counter">Featured blogs will be highlighted on the website</small>
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={16} />
                  {showAddModal ? 'Add Blog' : 'Update Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedBlog && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Blog Details</h2>
              <button
                className="admin-btn-icon"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-view-content">
              <div className="admin-view-section">
                <h3>Basic Information</h3>
                <div className="admin-view-grid">
                  <div>
                    <strong>ID:</strong> {selectedBlog.id}
                  </div>
                  <div>
                    <strong>Title:</strong> {selectedBlog.title}
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedBlog.category}
                  </div>
                  <div>
                    <strong>Featured:</strong> {selectedBlog.featured ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              <div className="admin-view-section">
                <h3>Meta Information</h3>
                <div className="admin-view-grid">
                  <div>
                    <strong>Author:</strong> {selectedBlog.author}
                  </div>
                  <div>
                    <strong>Date:</strong> {selectedBlog.date}
                  </div>
                  <div>
                    <strong>Read Time:</strong> {selectedBlog.readTime}
                  </div>
                </div>
              </div>

              <div className="admin-view-section">
                <h3>Excerpt</h3>
                <p>{selectedBlog.excerpt}</p>
              </div>

              <div className="admin-view-section">
                <h3>Content</h3>
                <div className="admin-blog-content">
                  {selectedBlog.content}
                </div>
              </div>

              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="admin-view-section">
                  <h3>Tags</h3>
                  <div className="admin-blog-tags">
                    {selectedBlog.tags.map((tag, index) => (
                      <span key={index} className="admin-badge admin-badge-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="admin-view-section">
                <h3>Image</h3>
                <img 
                  src={selectedBlog.image} 
                  alt={selectedBlog.title}
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
