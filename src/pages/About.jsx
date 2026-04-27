import React from 'react';
import CoreValues from '../components/CoreValues';
import Partners from '../components/Partners';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1 className="about-hero__title">About Starzed</h1>
                    <p className="about-hero__subtitle">
                        Your trusted partner in securing what matters most. We combine decades of experience with modern insurance solutions.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="story-section">
                <div className="container">
                    <div className="story-content">
                        <h2 className="story-title">Our Story</h2>
                        <p className="story-text">
                            Founded with a vision to make insurance accessible and understandable for everyone, Starzed has grown into one of Kenya's most trusted insurance brokerages. We believe that insurance isn't just about protection—it's about peace of mind and enabling you to pursue your dreams without fear.
                        </p>
                        <p className="story-text">
                            With over 30 years of combined experience, our team of dedicated professionals works tirelessly to find the perfect coverage for your specific needs, whether you're looking for personal protection or comprehensive business solutions.
                        </p>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-number">30+</span>
                                <span className="stat-label">Years Experience</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">10k+</span>
                                <span className="stat-label">Happy Clients</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">943+</span>
                                <span className="stat-label">Branches Nationwide</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <CoreValues />

            {/* Partners Section */}
            <Partners />
        </div>
    );
};

export default About;
