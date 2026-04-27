import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Shield, CheckCircle, Star, Home } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './PolicyDetail.css';

const PolicyDetail = ({ onOpenQuote }) => {
    const { policyTitle } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolicyProducts = async () => {
            try {
                setLoading(true);
                
                // First, get all products to filter by category
                const productsResponse = await api.getProducts();
                const allProducts = productsResponse.data || [];
                
                // Filter products that match the policy category
                const policyProducts = allProducts.filter(product => 
                    product.category === decodeURIComponent(policyTitle)
                );
                
                setProducts(policyProducts);
                
                // Set policy info for display
                setPolicy({
                    title: decodeURIComponent(policyTitle),
                    description: getPolicyDescription(decodeURIComponent(policyTitle))
                });
                
            } catch (err) {
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPolicyProducts();
    }, [policyTitle]);

    const getPolicyDescription = (title) => {
        const descriptions = {
            'Medical Insurance': 'Comprehensive health cover for individuals, families, and organizations with wide hospital networks and affordable premiums.',
            'Life & Personal Insurance': 'Long-term financial protection for your loved ones with life assurance, pensions, and investment products.',
            'Life Insurance': 'Life insurance coverage providing financial security for your loved ones with various protection plans.',
            'Property Insurance': 'Secure your home, business, and industrial property against fire, theft, and other perils with comprehensive coverage.',
            'Liability Insurance': 'Protection against professional negligence, public liability, and political risks for businesses and professionals.',
            'Motor Insurance': 'Comprehensive coverage for private, commercial, and specialty vehicles including motorcycles and cash in transit.',
            'Business & Financial': 'Specialized insurance solutions for businesses including contractors, bid bonds, and school coverage.',
            'Agriculture Insurance': 'Protect your crops, livestock, and agricultural investments against weather, disease, and theft.',
            'Agricultural Insurance': 'Protect your crops, livestock, and agricultural investments against weather, disease, and theft.',
            'Travel Insurance': 'Comprehensive travel protection for single trips, annual coverage, and specialized plans for students and corporate travel.',
            'General Insurance': 'Comprehensive general insurance coverage for various personal and business needs.',
            'Investment': 'Investment-linked insurance products combining protection with wealth creation opportunities.',
            'Pension': 'Retirement planning and pension solutions for secure financial future.',
            'Marine Insurance': 'Comprehensive marine and cargo insurance for sea transportation and logistics.'
        };
        return descriptions[title] || 'Comprehensive insurance solutions tailored to your needs.';
    };

    const handleBackClick = () => {
        navigate('/policies');
    };

    const handleProductClick = (product) => {
        navigate(`/companies/product/${product._id || product.id}`);
    };

    if (loading) {
        return (
            <div className="policy-detail">
                <div className="container">
                    <div className="text-center">
                        <p>Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="policy-detail">
                <div className="container">
                    <div className="text-center">
                        <p>Error loading products: {error}</p>
                        <button className="cta-btn" onClick={() => navigate('/policies')} style={{ marginTop: '20px' }}>
                            Back to Policies
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="policy-detail">
            {/* Breadcrumb Navigation */}
            <div className="breadcrumb">
                <div className="container">
                    <div className="breadcrumb__content">
                        <button className="breadcrumb__item" onClick={() => navigate('/')}>
                            <Home size={16} />
                            Home
                        </button>
                        <span className="breadcrumb__separator">/</span>
                        <button className="breadcrumb__item" onClick={() => navigate('/policies')}>
                            Policies
                        </button>
                        <span className="breadcrumb__separator">/</span>
                        <span className="breadcrumb__current">{policy?.title}</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="policy-hero">
                <div className="container">
                    <div className="policy-hero__content">
                        <button className="back-button" onClick={handleBackClick}>
                            <ArrowLeft size={20} />
                            Back to Policies
                        </button>
                        <span className="policy-hero__badge">Policy Category</span>
                        <h1 className="policy-hero__title">{policy?.title}</h1>
                        <p className="policy-hero__subtitle">
                            {policy?.description}
                        </p>
                        <div className="policy-features">
                            <div className="policy-feature">
                                <Shield size={18} />
                                <span>Comprehensive Coverage</span>
                            </div>
                            <div className="policy-feature">
                                <CheckCircle size={18} />
                                <span>Affordable Premiums</span>
                            </div>
                            <div className="policy-feature">
                                <Star size={18} />
                                <span>Trusted Providers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="policy-products">
                <div className="container">
                    <div className="policy-products__header">
                        <h2>Available Products</h2>
                        <p>Choose from our range of {policy?.title?.toLowerCase()} products offered by leading insurance companies.</p>
                    </div>

                    <div className="products-grid">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <ProductCard 
                                    key={product._id || product.id || index} 
                                    product={product} 
                                    onOpenQuote={onOpenQuote}
                                />
                            ))
                        ) : (
                            <div className="no-products">
                                <Shield size={48} />
                                <h3>No Products Found</h3>
                                <p>No products are currently available under this policy category.</p>
                                <button className="cta-btn" onClick={() => navigate('/policies')}>
                                    Browse Other Policies
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PolicyDetail;
