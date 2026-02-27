import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';

import { getProductsByCategory, getProductById, products } from '../data/products';

const Products = () => {
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');
    const productId = searchParams.get('id');
    const navigate = useNavigate();

    // Decode URL parameter to handle special characters like &
    const decodedCategory = categoryQuery ? decodeURIComponent(categoryQuery) : null;

    // Filter products based on category or product ID
    let displayProducts = products;
    let pageTitle = 'Insurance Products & Services';
    
    if (productId) {
        // Show single product
        const singleProduct = getProductById(productId);
        displayProducts = singleProduct ? [singleProduct] : [];
        pageTitle = singleProduct ? singleProduct.title : 'Product Not Found';
    } else if (decodedCategory) {
        // Show products by category
        displayProducts = getProductsByCategory(decodedCategory);
        pageTitle = `${decodedCategory} Products`;
    }

    return (
        <section className="products-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Our Services</span>
                    <h2 className="section-title">{pageTitle}</h2>
                    <p className="section-description">
                        We provide comprehensive insurance solutions backed by 30+ years of experience.
                    </p>
                </div>

                <div className="products-grid">
                    {displayProducts.length > 0 ? displayProducts.map((product, index) => (
                        <ProductCard key={product.id || index} product={product} />
                    )) : (
                        <div className="no-products" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
                            <p style={{ marginBottom: '20px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                                {productId ? 'Product not found.' : 'No products found for this category.'}
                            </p>
                            <button className="cta-btn" onClick={() => navigate('/products')}>View All Products</button>
                        </div>
                    )}
                </div>

                <div className="section-footer">
                    <div className="disclaimer">
                        <p>All insurance products are subject to policy terms and conditions. Contact our advisors for detailed information.</p>
                    </div>
                    {/* Show View All if filtered */}
                    {(decodedCategory || productId) && (
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