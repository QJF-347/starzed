import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LucideIcon from './LucideIcon';
import './PolicyCard.css';

const PolicyCard = ({ policy }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to policy detail page showing all products under this policy
        navigate(`/policies/${encodeURIComponent(policy.title)}`);
    };

    const handleImageError = (e) => {
        // Try multiple fallback images
        const fallbackImages = [
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
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
        <div className="service-card compact" onClick={handleClick}>
            <div className="service-card__header">
                <div className="service-card__icon">
                    <LucideIcon name={policy.icon} size={28} />
                </div>
                <div className="service-card__image">
                    <img
                        src={policy.image}
                        alt={policy.title}
                        onError={handleImageError}
                        loading="lazy"
                    />
                </div>
            </div>

            <div className="service-card__content">
                <h3 className="service-card__title">{policy.title}</h3>
                <p className="service-card__description">{policy.description}</p>
                <div className="service-card__action">
                    <span>Explore</span>
                    <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
};

export default PolicyCard;