import React from 'react';
import { services } from '../data/servicesData';
import ServiceCard from './ServiceCard';
import './Services.css';

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
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
