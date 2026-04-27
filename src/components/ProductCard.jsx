import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LucideIcon from './LucideIcon';
import './ProductCard.css';

const ProductCard = ({ product, onOpenQuote }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        // Navigate to companies page showing all products from different companies for this product type
        navigate(`/companies/product/${product._id || product.id}`);
    };

    const handleGetQuote = (e) => {
        e.stopPropagation();
        onOpenQuote(product);
    };

    const handleReadMore = (e) => {
        e.stopPropagation();
        navigate(`/companies/product/${product._id || product.id}`);
    };

    const handleImageError = (e) => {
        // Try multiple fallback images
        const fallbackImages = [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
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

    return (
        <div className="product-card modern" onClick={handleCardClick}>
            <div className="product-card__image-container">
                <img
                    src={product.image}
                    alt={product.title}
                    className="product-card__image"
                    onError={handleImageError}
                    loading="lazy"
                />
                <div className="product-card__overlay">
                    <button
                        className="product-card__quote-btn"
                        onClick={handleGetQuote}
                    >
                        Get Quote
                    </button>
                </div>
            </div>

            <div className="product-card__content">
                <div className="product-card__header">
                    <div className="product-card__icon">
                        <LucideIcon name={product.icon} size={20} />
                    </div>
                    <span className="product-card__category">{product.category}</span>
                </div>

                <h3 className="product-card__title">{product.title}</h3>
                
                <p className="product-card__description">
                    {product.shortDescription}
                </p>

                <div className="product-card__actions">
                    <button
                        className="product-card__read-more-btn"
                        onClick={handleReadMore}
                    >
                        Read More
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
