import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import api from '../services/api';
import './Blogs.css';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleImageError = (e) => {
        // Try multiple fallback images
        const fallbackImages = [
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
        ];
        
        // If current src is already a fallback, try the next one
        const currentSrc = e.target.src;
        const fallbackIndex = fallbackImages.findIndex(img => currentSrc.includes(img));
        
        if (fallbackIndex >= 0 && fallbackIndex < fallbackImages.length - 1) {
            e.target.src = fallbackImages[fallbackIndex + 1];
        } else if (fallbackIndex === -1) {
            e.target.src = fallbackImages[0];
        }
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.getBlogs();
                setBlogs(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const featuredBlog = blogs.find(blog => blog.featured);
    const recentBlogs = blogs.filter(blog => !blog.featured);

    if (loading) {
        return (
            <section className="blogs-section">
                <div className="container">
                    <div className="text-center">
                        <p>Loading blogs...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="blogs-section">
                <div className="container">
                    <div className="text-center">
                        <p>Error loading blogs: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="blogs-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Our Knowledge Base</span>
                    <h2 className="section-title">Latest Insights & News</h2>
                    <p className="section-description">
                        Stay informed with latest updates, tips, and insights from our insurance experts.
                    </p>
                </div>

                {/* Featured Blog */}
                {featuredBlog && (
                    <div className="featured-blog">
                        <div className="featured-image-wrapper">
                            <img 
                                src={featuredBlog.image} 
                                alt={featuredBlog.title} 
                                className="featured-image"
                                onError={handleImageError}
                                loading="lazy"
                            />
                            <span className="blog-category badge-featured">{featuredBlog.category}</span>
                        </div>
                        <div className="featured-content">
                            <div className="blog-meta">
                                <span className="meta-item"><Calendar size={14} /> {featuredBlog.date}</span>
                                <span className="meta-item"><Clock size={14} /> {featuredBlog.readTime}</span>
                                <span className="meta-item"><User size={14} /> {featuredBlog.author}</span>
                            </div>
                            <h3 className="featured-title">{featuredBlog.title}</h3>
                            <p className="featured-excerpt">{featuredBlog.excerpt}</p>
                            <Link to={`/blogs/${featuredBlog.id}`} className="read-more-btn">
                                Read Full Article <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Recent Blogs Grid */}
                <div className="blogs-grid">
                    {recentBlogs.map((blog) => (
                        <article key={blog.id} className="blog-card">
                            <div className="blog-image-wrapper">
                                <img 
                                    src={blog.image} 
                                    alt={blog.title} 
                                    className="blog-image"
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                                <span className="blog-category">{blog.category}</span>
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <span className="meta-item"><Calendar size={14} /> {blog.date}</span>
                                    <span className="meta-item"><Clock size={14} /> {blog.readTime}</span>
                                </div>
                                <h3 className="blog-title">{blog.title}</h3>
                                <p className="blog-excerpt">{blog.excerpt}</p>
                                <div className="blog-footer">
                                    <span className="blog-author"><User size={14} /> {blog.author}</span>
                                    <Link to={`/blogs/${blog.id}`} className="read-more-link" aria-label={`Read more about ${blog.title}`}>
                                        Read More <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blogs;
