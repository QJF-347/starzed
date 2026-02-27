import React from 'react';
import { Car, Heart, Home, Shield, Briefcase, Trees, Plane, Users, FileText, Smartphone, ArrowRight } from 'lucide-react';
import './ServiceCard.css';

const iconMap = {
    Car: () => <Car size={28} />,
    Heart: () => <Heart size={28} />,
    Home: () => <Home size={28} />,
    Shield: () => <Shield size={28} />,
    Briefcase: () => <Briefcase size={28} />,
    Trees: () => <Trees size={28} />,
    Plane: () => <Plane size={28} />,
    Users: () => <Users size={28} />,
    FileText: () => <FileText size={28} />,
    Smartphone: () => <Smartphone size={28} />,
    Umbrella: () => <Shield size={28} /> // Fallback for any old references
};

const ServiceCard = ({ service }) => {
    const handleClick = () => {
        window.location.href = service.link;
    };

    const IconComponent = iconMap[service.icon] || iconMap.Shield;

    return (
        <div className="service-card compact" onClick={handleClick}>
            <div className="service-card__header">
                <div className="service-card__icon">
                    <IconComponent />
                </div>
                <div className="service-card__image">
                    <img 
                        src={service.image} 
                        alt={service.title} 
                    />
                </div>
            </div>
            
            <div className="service-card__content">
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
                <div className="service-card__action">
                    <span>Explore</span>
                    <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;