import React from 'react';
import { Car, Heart, Home, Umbrella, FileText, Smartphone } from 'lucide-react';
import './Services.css';

const services = [
    {
        title: 'Motor Insurance',
        description: 'Comprehensive coverage for your vehicles against accidents, theft, and third-party liabilities.',
        icon: <Car size={32} />,
        link: '#'
    },
    {
        title: 'Life & Health',
        description: 'Protect yourself and your loved ones with our flexible life and health insurance plans.',
        icon: <Heart size={32} />,
        link: '#'
    },
    {
        title: 'Property',
        description: 'Secure your home and business assets against fire, burglary, and natural disasters.',
        icon: <Home size={32} />,
        link: '#'
    },
    {
        title: 'Microinsurance',
        description: 'Affordable insurance products tailored for small businesses and individuals.',
        icon: <Umbrella size={32} />,
        link: '#'
    },
    {
        title: 'Claims Advocacy',
        description: 'Professional support to ensure your claims are processed fairly and efficiently.',
        icon: <FileText size={32} />,
        link: '#'
    },
    {
        title: 'Digital Platforms',
        description: 'Access our services anywhere, anytime through our convenient digital channels.',
        icon: <Smartphone size={32} />,
        link: '#'
    }
];

const Services = () => {
    return (
        <section className="section services-section" id="services">
            <div className="container">
                <div className="section-header text-center">
                    <span className="subtitle">Our Expertise</span>
                    <h2 className="title">Comprehensive Insurance Services</h2>
                    <p className="description">
                        We offer a wide range of insurance solutions tailored to meet your unique needs.
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="icon-wrapper">
                                {service.icon}
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            <a href={service.link} className="learn-more">Learn More →</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
