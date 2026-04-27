import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';
import apiService from '../services/api';

const Products = ({ onOpenQuote }) => {
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');
    const productId = searchParams.get('id');
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Decode URL parameter to handle special characters like &
    const decodedCategory = categoryQuery ? decodeURIComponent(categoryQuery) : null;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;

                if (productId) {
                    data = await apiService.getProductById(productId);
                    setProducts(data.success ? [data.data] : []);
                } else if (decodedCategory) {
                    data = await apiService.getProductsByCategory(decodedCategory);
                    setProducts(data.success ? data.data : []);
                } else {
                    data = await apiService.getProducts();
                    setProducts(data.success ? data.data : []);
                }
            } catch (err) {
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [productId, decodedCategory]);

    // Filter products based on category or product ID
    let displayProducts = products;
    let pageTitle = 'Insurance Products & Policies';

    if (productId) {
        pageTitle = products.length > 0 ? products[0].name || products[0].title : 'Product Not Found';
    } else if (decodedCategory) {
        pageTitle = `${decodedCategory} Products`;
    }

    return (
        <section className="products-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Our Policies</span>
                    <h2 className="section-title">{pageTitle}</h2>
                    <p className="section-description">
                        We provide comprehensive insurance solutions backed by 30+ years of experience.
                    </p>
                </div>

                <div className="products-grid">
                    {loading ? (
                        <div className="loading" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
                            <p>Loading products...</p>
                        </div>
                    ) : error ? (
                        <div className="error" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
                            <p style={{ color: 'red', marginBottom: '20px' }}>Error: {error}</p>
                            <button className="cta-btn" onClick={() => window.location.reload()}>Try Again</button>
                        </div>
                    ) : displayProducts.length > 0 ? displayProducts.map((product, index) => (
                        <ProductCard key={product.id || index} product={product} onOpenQuote={onOpenQuote} />
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