import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Building2, Star, Phone, Mail, Globe, ArrowLeft, Shield, CheckCircle, Home, ArrowRight } from 'lucide-react';
import './Companies.css';

const getValidLogoUrl = (logo) => {
  if (!logo) return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';

  // Check for invalid base64 URLs
  if (logo.startsWith('data:image/png;base') && logo.length < 50) {
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';
  }

  // Check for other invalid data URLs
  if (logo.startsWith('data:') && !logo.includes('base64,')) {
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';
  }

  return logo;
};

const Companies = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productName, setProductName] = useState('');
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!productId) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        // First try to get companies by product
        const response = await api.getCompaniesByProduct(productId);
        const companiesData = response.data || [];

        // If only 1 company found, try to find more companies with similar products
        if (companiesData.length === 1) {
          try {
            // Get all companies to check for similar products
            const allCompaniesResponse = await api.getCompanies();
            const allCompanies = allCompaniesResponse.data || [];

            // Find companies with similar product names
            const similarCompanies = allCompanies.filter(company =>
              company.company_plans && company.company_plans.some(plan =>
                plan.generic_product_id?.title && (
                  plan.generic_product_id.title.toLowerCase().includes('group personal') ||
                  plan.generic_product_id.title.toLowerCase().includes('personal accident')
                )
              )
            );

            // If we found more companies, use them
            if (similarCompanies.length > companiesData.length) {
              setCompanies(similarCompanies);
              setProductName('Group Personal Accident');
            } else {
              setCompanies(companiesData);
            }
          } catch (fallbackErr) {
            setCompanies(companiesData);
          }
        } else {
          setCompanies(companiesData);
        }

        // Try to get product name for display
        let productFound = false;
        try {
          const productResponse = await api.getProductById(productId);
          setProductName(productResponse.data?.title || 'Product');
          productFound = true;
        } catch (err) {
          console.warn('Could not fetch product name:', err);
        }

        // If no companies found or product not found, show similar products
        if (companiesData.length === 0 || !productFound) {
          try {
            const allProductsResponse = await api.getProducts();
            const allProducts = allProductsResponse.data || [];

            // Find similar products by category or title
            const similar = allProducts.filter(p => {
              const productIdMatch = p._id === productId || p.id === productId;
              if (productIdMatch) {
                setProductName(p.title);
                return true;
              }
              return false;
            });

            // If still no product found, get products from same categories
            if (similar.length === 0) {
              const categoryProducts = allProducts.filter(p =>
                p.category.toLowerCase().includes('personal') ||
                p.category.toLowerCase().includes('life') ||
                p.title.toLowerCase().includes('accident')
              );
              setSimilarProducts(categoryProducts.slice(0, 6));
              setProductName('Group Personal Accident');
            } else {
              setSimilarProducts(allProducts.slice(0, 6));
            }
          } catch (fallbackErr) {
            console.warn('Could not fetch fallback products:', fallbackErr);
            setSimilarProducts([]);
          }
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError(err.message);

        // Even on error, try to show some products
        try {
          const allProductsResponse = await api.getProducts();
          setSimilarProducts(allProductsResponse.data?.slice(0, 6) || []);
          setProductName('Insurance Products');
        } catch (fallbackErr) {
          console.warn('Could not fetch any products:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [productId]);

  const handleCompanyProductClick = (companyId, productRef) => {
    // For string references, use the string directly
    // For structured objects, use the productId
    const productId = typeof productRef === 'string' ? productRef : productRef;
    navigate(`/companies/${companyId}/product/${productId}`);
  };

  const handleBackClick = () => {
    navigate('/policies');
  };

  if (loading) {
    return (
      <div className="companies-page">
        <div className="container">
          <div className="text-center">
            <p>Loading companies...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="companies-page">
        <div className="container">
          <div className="text-center">
            <p>Error loading companies: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="companies-page">
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
            <span className="breadcrumb__current">{productName} Products</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="companies-hero">
        <div className="container">
          <div className="companies-hero__content">
            <button className="back-button" onClick={handleBackClick}>
              <ArrowLeft size={20} />
              Back to Policies
            </button>
            <span className="companies-hero__badge">Compare Insurance Providers</span>
            <h1 className="companies-hero__title">
              {productName} - Choose Your Provider
            </h1>
            <p className="companies-hero__subtitle">
              Compare {productName} offerings from leading insurance companies. Find the best coverage, premiums, and benefits that match your needs.
            </p>
            <div className="companies-hero__features">
              <div className="hero-feature">
                <Shield size={18} />
                <span>Compare Multiple Providers</span>
              </div>
              <div className="hero-feature">
                <CheckCircle size={18} />
                <span>Best Price Guarantee</span>
              </div>
              <div className="hero-feature">
                <Star size={18} />
                <span>Trusted Companies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="companies-list">
        <div className="container">
          {companies.length === 0 ? (
            <div className="no-companies">
              <Building2 size={48} />
              <h3>No Companies Found</h3>
              <p>
                {companies.length === 0
                  ? `No companies currently offer the ${productName} product.`
                  : 'This product is temporarily unavailable.'
                }
              </p>

              {/* Show similar products if available */}
              {similarProducts.length > 0 && (
                <div className="similar-products">
                  <h4>Explore These Insurance Products</h4>
                  <p>Discover similar insurance options that may meet your needs</p>
                  <div className="similar-products-grid">
                    {similarProducts.map((product) => (
                      <div
                        key={product._id || product.id}
                        className="similar-product-card"
                        onClick={() => navigate(`/companies/product/${product._id || product.id}`)}
                      >
                        <h5>{product.title}</h5>
                        <p>{product.shortDescription}</p>
                        <span className="product-category">{product.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="error-actions">
                <button className="cta-btn" onClick={() => navigate('/policies')}>
                  Browse All Policies
                </button>
                <button className="login-btn" onClick={() => navigate('/products')}>
                  Browse All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="companies-grid">
              {companies.map((company) => (
                <div key={company._id} className="company-card">
                  <div className="company-card__header">
                    <div className="company-card__logo">
                      <img
                        src={getValidLogoUrl(company.logo)}
                        alt={company.displayName}
                        onError={(e) => {
                          // Try fallback images
                          const fallbackImages = [
                            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
                            'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&q=80',
                            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
                          ];
                          const currentSrc = e.target.src;
                          const fallbackIndex = fallbackImages.findIndex(img => currentSrc.includes(img));
                          if (fallbackIndex >= 0 && fallbackIndex < fallbackImages.length - 1) {
                            e.target.src = fallbackImages[fallbackIndex + 1];
                          } else if (fallbackIndex === -1) {
                            e.target.src = fallbackImages[0];
                          }
                        }}
                      />
                    </div>
                    <div className="company-card__info">
                      <h3 className="company-card__name">{company.displayName}</h3>
                    </div>
                  </div>

                  <div className="company-card__products">
                    <h4>{productName} Plans:</h4>
                    <div className="product-list">
                      {company.company_plans && company.company_plans
                        .filter(plan => {
                          // Check if this plan matches the selected productId OR is a Group Personal Accident product
                          if (typeof plan === 'string') {
                            return plan === productId ||
                              plan.includes('group-personal-accident') ||
                              plan === 'group-personal-accident';
                          } else {
                            return plan.generic_product_id?._id === productId ||
                              plan.generic_product_id?.id === productId ||
                              (plan.generic_product_id?.title && plan.generic_product_id.title.toLowerCase().includes('group personal accident'));
                          }
                        })
                        .map((plan, index) => {
                          let planData;
                          if (typeof plan === 'string') {
                            planData = {
                              _id: plan,
                              id: plan,
                              branded_name: productName,
                              description: 'Comprehensive group accident protection for organizations',
                              features: ['Accident Coverage', 'Death Benefits', 'Medical Expenses', '24/7 Protection'],
                              benefits: ['Group Protection', 'Affordable Premiums', 'Quick Claims'],
                              coverage: 'Accidental death, disability, medical expenses',
                              premium: 'Contact for pricing',
                              popular: false
                            };
                          } else {
                            planData = plan;
                          }

                          // Get plan data with fallbacks
                          const productTitle = planData.branded_name || planData.generic_product_id?.title || productName;
                          const productDescription = planData.description || planData.generic_product_id?.shortDescription || 'Comprehensive insurance coverage for your protection needs.';
                          const productFeatures = planData.features || planData.generic_product_id?.features || ['Comprehensive Coverage', '24/7 Support', 'Quick Claims Processing'];
                          const productCoverage = planData.coverage || planData.generic_product_id?.coverage || 'Comprehensive coverage for accidents and emergencies';
                          const productPremium = planData.premium || planData.generic_product_id?.premium || 'Contact for pricing';

                          return (
                            <div
                              key={planData._id || index}
                              className="enhanced-product-card"
                              onClick={() => handleCompanyProductClick(company._id, typeof plan === 'string' ? plan : plan.generic_product_id?._id || plan.generic_product_id || plan._id)}
                            >
                              <div className="enhanced-product-card__header">
                                <div className="enhanced-product-card__title">
                                  <h5>{productTitle}</h5>
                                  {planData.popular && <span className="popular-badge">Popular</span>}
                                </div>
                              </div>

                              <div className="enhanced-product-card__description">
                                <p>{productDescription}</p>
                              </div>

                              <div className="enhanced-product-card__features">
                                {productFeatures.slice(0, 3).map((feature, idx) => (
                                  <div key={idx} className="enhanced-feature-tag">
                                    <CheckCircle size={18} />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="enhanced-product-card__footer">
                                <div className="coverage-info">
                                  <Shield size={18} />
                                  <span>{productCoverage}</span>
                                </div>
                                <div className="action-buttons">
                                  <button
                                    className="get-quote-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle get quote functionality
                                    }}
                                  >
                                    Get Quote
                                  </button>
                                  <div className="action-button">
                                    <span>View Details</span>
                                    <ArrowRight size={14} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Companies;
