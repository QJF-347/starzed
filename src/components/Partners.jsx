import React from 'react';
import './Partners.css';
import coverageInKenya from '../assets/images/coverage_in_kenya_image.png';

const Partners = () => {
    return (
        <section className="section partners-section" id="partners">
            <div className="container">
                <div className="features-wrapper flex items-center justify-between gap-12">
                    <div className="features-content">
                        <span className="subtitle">Our Network</span>
                        <h2 className="title">Nationwide Coverage Through Kenya Post</h2>
                        <p className="description mb-6">
                            We have partnered with the Postal Corporation of Kenya to bring insurance services to your doorstep. With over 943 branches across the country, access to our services has never been easier.
                        </p>
                        <ul className="partners-list">
                            <li><strong>Strategic Partnership:</strong> Leveraging the extensive network of Kenya Post.</li>
                            <li><strong>Accessibility:</strong> Reach us in 47 counties.</li>
                            <li><strong>Convenience:</strong> Services available at your local post office.</li>
                        </ul>
                    </div>
                    <div className="features-image">
                        {/* Placeholder for Map Graphic */}
                        <div className="map-placeholder">
                            <img src={coverageInKenya} alt="Coverage in Kenya" />
                            <div className="map-overlay">
                                <span>Nationwide Presence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Partners;
