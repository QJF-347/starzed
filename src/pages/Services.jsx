import React from 'react';
import { services } from '../data/servicesData';
import { Shield } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import ReadySection from '../components/ReadySection';
import './Services.css';

const Services = ({ onOpenQuote }) => {
    return (
        <div className="services-page">
            <section className="services-hero">
                <div className="container">
                    <div className="services-hero__content">
                        <span className="services-hero__badge">What We Do</span>
                        <h1 className="services-hero__title">Our Services</h1>
                        <p className="services-hero__subtitle">
                            We provide comprehensive and innovative insurance solutions designed to protect every aspect of your life and business, giving you the ultimate peace of mind.
                        </p>
                    </div>
                </div>
            </section>

            <section className="services-detailed">
                <div className="container">
                    <div className="services-detailed__header text-center">
                        <h2 className="section-title">Insurance Solutions Tailored For You</h2>
                        <p className="section-description">
                            Explore our wide range of carefully crafted products designed to mitigate risks and secure your future.
                        </p>
                    </div>

                    <div className="services-grid">
                        {services.map((service, index) => (
                            <ServiceCard key={index} service={service} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="services-features">
                <div className="container">
                    <div className="services-features__inner">
                        <div className="services-features__content">
                            <h2 className="section-title">Why Trust Us With Your Protection?</h2>
                            <p className="section-description">
                                Starzed Insurance Brokers combines decades of industry expertise with an unwavering commitment to client success. We don't just sell policies; we build lasting partnerships.
                            </p>
                            <ul className="features-list">
                                <li>
                                    <div className="feature-icon"><Shield size={20} /></div>
                                    <div>
                                        <h4>Unbiased Advice</h4>
                                        <p>As independent brokers, we compare policies across multiple underwriters to find the best fit for your specific needs.</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="feature-icon"><Shield size={20} /></div>
                                    <div>
                                        <h4>Fast Claims Processing</h4>
                                        <p>Our dedicated claims team ensures you get prompt support and fair settlement when you need it most.</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="feature-icon"><Shield size={20} /></div>
                                    <div>
                                        <h4>Personalized Service</h4>
                                        <p>We take the time to deeply understand your unique risk profile before recommending any insurance coverage.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="services-features__image-wrapper">
                            <img src="https://images.unsplash.com/photo-1556761175-5973ecc0f329?auto=format&fit=crop&q=80&w=800" alt="Insurance Consultation" className="services-features__image" />
                        </div>
                    </div>
                </div>
            </section>

            <ReadySection onOpenQuote={onOpenQuote} />
        </div>
    );
};

export default Services;
