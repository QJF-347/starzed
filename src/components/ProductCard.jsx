import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to products page with product ID as query parameter
        navigate(`/products?id=${product.id}`);
    };

    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';
    };

    return (
        <div className="product-card compact" onClick={handleClick}>
            <div className="product-card__header">
                <div className="product-card__image">
                    <img 
                        src={product.image} 
                        alt={product.title}
                        onError={handleImageError}
                        loading="lazy"
                    />
                </div>
                <div className="product-card__icon">
                    {product.icon}
                </div>
            </div>
            
            <div className="product-card__content">
                <h3 className="product-card__title">{product.title}</h3>
                <p className="product-card__description">{product.shortDescription}</p>
                
                <div className="product-card__features">
                    <ul className="features-list">
                        {product.features.slice(0, 2).map((feature, index) => (
                            <li key={index} className="feature-item">
                                <span>{feature.split(':')[0]}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="product-card__action">
                    <span>View Details</span>
                    <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
