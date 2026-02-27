import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { getFeaturedBlog, getRecentBlogs } from '../data/blogs';
import './Blogs.css';

const Blogs = () => {
    const featuredBlog = getFeaturedBlog();
    const recentBlogs = getRecentBlogs();

    return (
        <section className="blogs-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Our Knowledge Base</span>
                    <h2 className="section-title">Latest Insights & News</h2>
                    <p className="section-description">
                        Stay informed with the latest updates, tips, and insights from our insurance experts.
                    </p>
                </div>

                {/* Featured Blog */}
                {featuredBlog && (
                    <div className="featured-blog">
                        <div className="featured-image-wrapper">
                            <img src={featuredBlog.image} alt={featuredBlog.title} className="featured-image" />
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
                                <img src={blog.image} alt={blog.title} className="blog-image" />
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
