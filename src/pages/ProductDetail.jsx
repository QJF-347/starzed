import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Phone, Shield, CheckCircle, Users } from 'lucide-react';
import { getProductById } from '../data/products';
import ReadySection from '../components/ReadySection';
import './ProductDetail.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const product = getProductById(productId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId]);

    if (!product) {
        return (
            <div className="product-detail">
                <div className="container">
                    <div className="not-found">
                        <h2>Product Not Found</h2>
                        <p>The product you are looking for does not exist.</p>
                        <Link to="/products" className="btn-primary">
                            Back to All Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail">
            {/* Hero Section */}
            <section className="product-hero">
                <div className="container">
                    <div className="product-hero__grid">
                        <div className="product-hero__content">
                            <div className="product-badge">
                                <Shield size={16} />
                                <span>{product.category}</span>
                            </div>
                            <h1 className="product-hero__title">{product.title}</h1>
                            <p className="product-hero__description">
                                {product.description || "Get comprehensive protection with our specialized insurance coverage tailored to your needs."}
                            </p>
                            
                            <div className="hero-features">
                                <div className="feature">
                                    <CheckCircle size={18} />
                                    <span>Comprehensive Coverage</span>
                                </div>
                                <div className="feature">
                                    <CheckCircle size={18} />
                                    <span>Affordable Premiums</span>
                                </div>
                                <div className="feature">
                                    <CheckCircle size={18} />
                                    <span>24/7 Claims Support</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="product-hero__image-container">
                            <img 
                                src={product.image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                                alt={product.title}
                                className="product-hero__image"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="product-content">
                <div className="container">
                    <div className="content-layout">
                        <main className="main-content">
                            <div className="features-section">
                                <h2>Coverage Details</h2>
                                <div className="features-grid">
                                    {product.features?.map((feature, index) => (
                                        <div key={index} className="feature-card">
                                            <CheckCircle size={20} />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {product.details && (
                                <div className="details-section">
                                    <h2>Policy Information</h2>
                                    <div className="details-content">
                                        {product.details}
                                    </div>
                                </div>
                            )}
                        </main>

                        <aside className="sidebar">
                            <div className="sidebar-card">
                                <h3 className="sidebar-title">
                                    <Users size={20} />
                                    Get Your Quote
                                </h3>
                                <p className="sidebar-description">
                                    Contact us for a personalized quote and expert advice on this product.
                                </p>
                                
                                <button
                                    className="cta-button"
                                    onClick={() => window.open(`mailto:info@starzed.co.ke?subject=Inquiry about ${product.title}`, '_blank')}
                                >
                                    Request a Quote
                                    <ArrowRight size={18} />
                                </button>

                                <div className="contact-info">
                                    <div className="contact-item">
                                        <Phone size={16} />
                                        <div>
                                            <span className="contact-label">Call us</span>
                                            <a href="tel:+254758555333">+254 758 555 333</a>
                                        </div>
                                    </div>
                                    
                                    <div className="hours">
                                        <span className="hours-label">Business Hours</span>
                                        <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
                                        <span>Sat: 9:00 AM - 1:00 PM</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="sidebar-note">
                                <Shield size={18} />
                                <p>All policies subject to terms and conditions. Contact for full details.</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Related Products or Ready Section */}
            <ReadySection />
        </div>
    );
};

export default ProductDetail;