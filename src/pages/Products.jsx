import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Products.css';

import { getProductsByCategory, products } from '../data/products';

const Products = () => {
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');
    const navigate = useNavigate();

    // Filter products based on category if it exists
    const displayProducts = categoryQuery
        ? getProductsByCategory(categoryQuery)
        : products;

    return (
        <section className="products-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Our Services</span>
                    <h2 className="section-title">
                        {categoryQuery ? `${categoryQuery} Products` : 'Insurance Products & Services'}
                    </h2>
                    <p className="section-description">
                        We provide comprehensive insurance solutions backed by 30+ years of experience.
                    </p>
                </div>

                <div className="products-grid">
                    {displayProducts.length > 0 ? displayProducts.map((product, index) => (
                        <article key={product.id || index} className="product-card">
                            <div className="card-header">
                                <div className="card-icon">
                                    {product.icon}
                                </div>
                                <h3 className="card-title">{product.title}</h3>
                            </div>

                            <p className="card-description">
                                {product.shortDescription}
                            </p>

                            <div className="card-features">
                                <ul className="features-list">
                                    {product.features.slice(0, 3).map((feature, featureIndex) => (
                                        <li key={featureIndex} className="feature-item">
                                            <ChevronRight size={14} />
                                            <span>{feature.split(':')[0]}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                className="card-button"
                                onClick={() => navigate(`/products/${product.id}`)}
                            >
                                View Details
                                <ChevronRight size={16} />
                            </button>
                        </article>
                    )) : (
                        <div className="no-products" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
                            <p style={{ marginBottom: '20px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>No products found for this category.</p>
                            <button className="cta-btn" onClick={() => navigate('/products')}>View All Products</button>
                        </div>
                    )}
                </div>

                <div className="section-footer">
                    <div className="disclaimer">
                        <p>All insurance products are subject to policy terms and conditions. Contact our advisors for detailed information.</p>
                    </div>
                    {/* Show View All if filtered */}
                    {categoryQuery && (
                        <div className="action-buttons" style={{ marginTop: '20px' }}>
                            <button className="login-btn" onClick={() => navigate('/products')}>View All Products</button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Products;