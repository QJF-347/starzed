import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { ArrowLeft, Shield, Users, CheckCircle, Heart, AlertTriangle, Building, Briefcase, Car, Truck, Plane, Trees, Dog, GraduationCap, Home, Factory, PiggyBank, TrendingUp, UserCheck, HandCoins, Sprout, FileText } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = ({ onOpenQuote }) => {
    const { productId, companyId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductData = async () => {
            console.log('=== ProductDetail: Starting fetch ===');
            console.log('ProductId:', productId);
            console.log('CompanyId:', companyId);
            console.log('API Service:', apiService);
            
            // Test API service
            try {
                console.log('Testing API service...');
                const healthCheck = await apiService.healthCheck();
                console.log('Health check response:', healthCheck);
            } catch (healthErr) {
                console.error('Health check failed:', healthErr);
            }
            
            try {
                setLoading(true);
                let productData;
                let companyData = null;

                if (companyId && productId) {
                    console.log('Fetching company product...');
                    productData = await apiService.getCompanyProduct(companyId, productId);
                    console.log('Company product response:', productData);
                    
                    // Also fetch company details
                    try {
                        console.log('Fetching company details...');
                        const companyResponse = await apiService.getCompany(companyId);
                        console.log('Company response:', companyResponse);
                        if (companyResponse.success) {
                            companyData = companyResponse.data;
                            console.log('Company data set:', companyData);
                        }
                    } catch (companyErr) {
                        console.log('Company data not available:', companyErr);
                    }
                } else if (productId) {
                    console.log('Fetching product by ID...');
                    productData = await apiService.getProductById(productId);
                    console.log('Product by ID response:', productData);
                } else {
                    throw new Error("No product ID provided");
                }

                console.log('Final productData:', productData);
                console.log('Final companyData:', companyData);

                if (productData && productData.success) {
                    setProduct(productData.data);
                    setCompany(companyData);
                    console.log('State updated - Product:', productData.data);
                    console.log('State updated - Company:', companyData);
                } else {
                    console.error('Product data failed:', productData);
                    throw new Error(productData?.message || "Failed to load product details");
                }
            } catch (err) {
                console.error("=== ERROR FETCHING PRODUCT DETAILS ===");
                console.error("Error:", err);
                console.error("Error message:", err.message);
                console.error("Error stack:", err.stack);
                setError(err.message || "An error occurred while fetching details.");
            } finally {
                setLoading(false);
                console.log('=== Fetch completed ===');
            }
        };

        fetchProductData();
    }, [productId, companyId]);

    if (loading) {
        return (
            <div className="product-detail-page loading-state">
                <div className="spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page error-state container">
                <div className="error-card">
                    <h2>Product Not Found</h2>
                    <p>{error || "We couldn't find the product you're looking for."}</p>
                    <button className="primary-btn" onClick={() => navigate('/products')}>
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    // Console log current state for debugging
    console.log('=== RENDER STATE ===');
    console.log('Product:', product);
    console.log('Company:', company);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('==================');

    // Extract data from the nested API response structure
    const productData = product?.product || product;
    console.log('Full productData object:', productData);
    console.log('ProductData keys:', Object.keys(productData || {}));
    
    const title = productData?.title || productData?.name || 'Insurance Policy';
    const description = productData?.shortDescription || productData?.description || 'Comprehensive coverage tailored to your needs.';
    const longDescription = productData?.description || productData?.longDescription || description;
    const features = productData?.features || [];
    const benefits = productData?.benefits || features;
    const eligibility = Array.isArray(productData?.eligibility) 
    ? productData.eligibility 
    : productData?.eligibility 
      ? Object.values(productData.eligibility) 
      : [];
    const coverage = Array.isArray(productData?.coverage) 
    ? productData.coverage 
    : productData?.coverage 
      ? [productData.coverage] 
      : [];
    const image = productData?.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';
    const companyName = company?.name || 'Starzed Insurance';
    const companyLogo = company?.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';
    
    console.log('Extracted data:');
    console.log('- Title:', title);
    console.log('- Description:', description);
    console.log('- Long Description:', longDescription);
    console.log('- Features:', features);
    console.log('- Benefits:', benefits);
    console.log('- Eligibility:', eligibility);
    console.log('- Coverage:', coverage);
    console.log('- Image:', image);
    
    // Get appropriate icon for product category
    const getProductIcon = (category) => {
        const iconMap = {
            'Medical Insurance': <Heart size={32} />,
            'Life & Personal Insurance': <Shield size={32} />,
            'Property Insurance': <Home size={32} />,
            'Liability Insurance': <FileText size={32} />,
            'Motor Insurance': <Car size={32} />,
            'Business & Financial Insurance': <Briefcase size={32} />,
            'Agriculture insurance': <Trees size={32} />,
            'Travel insurance': <Plane size={32} />
        };
        return iconMap[category] || <Shield size={32} />;
    };

    const handleImageError = (e) => {
        // Try multiple fallback images if the primary image fails
        const fallbackImages = [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
        ];

        const currentSrc = e.target.src;
        const fallbackIndex = fallbackImages.findIndex(img => currentSrc.includes(img));

        if (fallbackIndex >= 0 && fallbackIndex < fallbackImages.length - 1) {
            e.target.src = fallbackImages[fallbackIndex + 1];
        } else if (fallbackIndex === -1) {
            e.target.src = fallbackImages[0];
        }
    };

    return (
        <div className="product-detail-page">
            {/* Header with Company Logo and Name */}
            <header className="product-header">
                <div className="container">
                    <div className="company-info">
                        <img 
                            src={companyLogo} 
                            alt={companyName} 
                            className="company-logo"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';
                            }}
                        />
                        <div className="company-details">
                            <h1 className="company-name">{companyName}</h1>
                            <p className="company-tagline">Insurance Solutions You Can Trust</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Product Section */}
            <section className="product-section">
                <div className="container">
                    <div className="product-layout">
                        {/* Product Image */}
                        <div className="product-image-container">
                            <img 
                                src={image} 
                                alt={title} 
                                className="product-image"
                                onError={handleImageError}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="product-info">
                            <div className="product-category">
                                <span className="category-icon">{getProductIcon(productData?.category)}</span>
                                <span className="category-text">{productData?.category || 'Insurance Plan'}</span>
                            </div>
                            
                            <h2 className="product-title">{title}</h2>
                            <p className="product-description">{description}</p>

                            {/* Action Buttons */}
                            <div className="product-actions">
                                <button className="primary-btn" onClick={() => onOpenQuote(productData)}>
                                    Get Quote
                                </button>
                                <button className="secondary-btn" onClick={() => navigate(-1)}>
                                    <ArrowLeft size={20} />
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Description */}
            <section className="description-section">
                <div className="container">
                    <div className="content-card">
                        <h3>About This Plan</h3>
                        <p className="detailed-description">{longDescription}</p>
                    </div>
                </div>
            </section>

            {/* Features, Eligibility, and Coverage */}
            <section className="details-section">
                <div className="container">
                    <div className="details-grid">
                        {/* Features */}
                        {features && features.length > 0 && (
                            <div className="detail-card">
                                <div className="card-header">
                                    <div className="card-icon features-icon">
                                        <CheckCircle size={24} />
                                    </div>
                                    <h3>Key Features</h3>
                                </div>
                                <div className="card-content">
                                    <ul className="feature-list">
                                        {features.map((feature, idx) => (
                                            <li key={idx} className="feature-item">
                                                <span className="feature-bullet">✓</span>
                                                <span>{feature.includes(':') ? feature.split(':')[1].trim() : feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Eligibility */}
                        {eligibility && eligibility.length > 0 && (
                            <div className="detail-card">
                                <div className="card-header">
                                    <div className="card-icon eligibility-icon">
                                        <Users size={24} />
                                    </div>
                                    <h3>Eligibility</h3>
                                </div>
                                <div className="card-content">
                                    <ul className="eligibility-list">
                                        {eligibility.map((criteria, idx) => (
                                            <li key={idx} className="eligibility-item">
                                                <span className="eligibility-number">{idx + 1}</span>
                                                <span>{criteria}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Coverage */}
                        {coverage && coverage.length > 0 && (
                            <div className="detail-card">
                                <div className="card-header">
                                    <div className="card-icon coverage-icon">
                                        <Shield size={24} />
                                    </div>
                                    <h3>Coverage</h3>
                                </div>
                                <div className="card-content">
                                    <ul className="coverage-list">
                                        {coverage.map((item, idx) => (
                                            <li key={idx} className="coverage-item">
                                                <span className="coverage-bullet">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;
