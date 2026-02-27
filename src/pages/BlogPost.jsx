import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';
import { getBlogById } from '../data/blogs';
import './BlogPost.css';

const BlogPost = () => {
    const { blogId } = useParams();
    const blog = getBlogById(parseInt(blogId));

    if (!blog) {
        return (
            <div className="blog-post-section">
                <div className="container">
                    <div className="blog-not-found">
                        <h1>Blog Post Not Found</h1>
                        <p>The blog post you're looking for doesn't exist.</p>
                        <Link to="/blogs" className="back-to-blogs">
                            <ArrowLeft size={16} /> Back to Blogs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const fullContent = `
        <p>${blog.excerpt}</p>
        
        <h3>Understanding the Basics</h3>
        <p>When it comes to insurance, understanding the fundamentals is crucial for making informed decisions. Insurance is essentially a contract between you and an insurance company, where you pay regular premiums in exchange for financial protection against specific risks.</p>
        
        <p>This protection can cover everything from your health and life to your property and business operations. The key is to choose the right type and amount of coverage that meets your specific needs.</p>
        
        <h3>Types of Coverage Available</h3>
        <p>There are numerous types of insurance policies available, each designed to protect against different risks:</p>
        
        <ul>
            <li><strong>Life Insurance:</strong> Provides financial support to your beneficiaries after your passing</li>
            <li><strong>Health Insurance:</strong> Covers medical expenses and healthcare costs</li>
            <li><strong>Motor Insurance:</strong> Protects against vehicle damage and liability</li>
            <li><strong>Property Insurance:</strong> Safeguards your home and belongings against damage or theft</li>
            <li><strong>Business Insurance:</strong> Protects your business operations and assets</li>
        </ul>
        
        <h3>Choosing the Right Policy</h3>
        <p>Selecting the right insurance policy requires careful consideration of your personal circumstances, financial situation, and risk tolerance. Here are some factors to consider:</p>
        
        <p>First, assess your current financial situation and determine how much coverage you actually need. Consider your assets, liabilities, and future financial goals. This will help you determine the appropriate coverage amounts.</p>
        
        <p>Next, compare different insurance providers and their offerings. Look at factors such as premium costs, coverage limits, deductibles, and customer service reputation. Don't just focus on the price – the cheapest option may not always provide the best coverage.</p>
        
        <h3>The Claims Process</h3>
        <p>Understanding how the claims process works is essential for ensuring you can access your coverage when you need it most. Most insurance companies have streamlined claims processes, but it's important to know what to expect.</p>
        
        <p>When filing a claim, you'll typically need to provide documentation of the incident, proof of loss, and any other relevant information. The insurance company will then review your claim and determine the appropriate payout based on your policy terms.</p>
        
        <h3>Conclusion</h3>
        <p>Insurance is a critical component of financial planning and risk management. By understanding the different types of coverage available and choosing policies that meet your specific needs, you can protect yourself and your loved ones from unexpected financial hardships.</p>
        
        <p>Remember that insurance needs change over time, so it's important to review your policies regularly and make adjustments as needed. Working with a qualified insurance professional can help ensure you have the right coverage in place.</p>
    `;

    return (
        <section className="blog-post-section">
            <div className="container">
                {/* Back Navigation */}
                <div className="blog-navigation">
                    <Link to="/blogs" className="back-to-blogs">
                        <ArrowLeft size={16} /> Back to Blogs
                    </Link>
                </div>

                {/* Blog Header */}
                <header className="blog-header">
                    <div className="blog-meta">
                        <span className="blog-category">{blog.category}</span>
                        <div className="meta-info">
                            <span className="meta-item">
                                <Calendar size={14} /> {blog.date}
                            </span>
                            <span className="meta-item">
                                <Clock size={14} /> {blog.readTime}
                            </span>
                            <span className="meta-item">
                                <User size={14} /> {blog.author}
                            </span>
                        </div>
                    </div>
                    
                    <h1 className="blog-title">{blog.title}</h1>
                    
                    <div className="blog-actions">
                        <button className="action-btn">
                            <Share2 size={18} />
                            <span>Share</span>
                        </button>
                        <button className="action-btn">
                            <Heart size={18} />
                            <span>Like</span>
                        </button>
                        <button className="action-btn">
                            <MessageCircle size={18} />
                            <span>Comment</span>
                        </button>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="blog-featured-image">
                    <img src={blog.image} alt={blog.title} />
                </div>

                {/* Blog Content */}
                <article className="blog-content">
                    <div 
                        className="blog-text"
                        dangerouslySetInnerHTML={{ __html: fullContent }}
                    />
                </article>

                {/* Blog Footer */}
                <footer className="blog-footer">
                    <div className="author-section">
                        <div className="author-avatar">
                            <User size={24} />
                        </div>
                        <div className="author-info">
                            <h4>{blog.author}</h4>
                            <p>Insurance Expert at Starzed</p>
                        </div>
                    </div>
                    
                    <div className="blog-tags">
                        <span className="tag">Insurance</span>
                        <span className="tag">{blog.category}</span>
                        <span className="tag">Tips</span>
                        <span className="tag">Guide</span>
                    </div>
                </footer>

                {/* Related Posts */}
                <section className="related-posts">
                    <h3>Related Articles</h3>
                    <div className="related-grid">
                        {/* This would typically fetch related blogs */}
                        <div className="related-card">
                            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400" alt="Related post" />
                            <h4>Understanding Business Insurance</h4>
                            <p>Learn how to protect your business from unexpected risks.</p>
                        </div>
                        <div className="related-card">
                            <img src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=400" alt="Related post" />
                            <h4>Life Insurance Basics</h4>
                            <p>Everything you need to know about life assurance policies.</p>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default BlogPost;
