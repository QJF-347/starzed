import React from 'react';
import { TrendingUp, Globe, Users, Mail, ArrowRight, Heart, Award, Shield } from 'lucide-react';
import './Careers.css';

const benefits = [
    {
        icon: <TrendingUp size={24} />,
        title: "Career Growth",
        description: "Continuous learning and clear career progression paths"
    },
    {
        icon: <Award size={24} />,
        title: "Competitive Packages",
        description: "Attractive compensation and comprehensive benefits"
    },
    {
        icon: <Globe size={24} />,
        title: "Nationwide Impact",
        description: "Make a difference across all 47 counties in Kenya"
    },
    {
        icon: <Users size={24} />,
        title: "Team Culture",
        description: "Collaborative environment that values every voice"
    },
    {
        icon: <Heart size={24} />,
        title: "Work-Life Balance",
        description: "Flexible arrangements and wellness programs"
    },
    {
        icon: <Shield size={24} />,
        title: "Job Security",
        description: "Stable industry with long-term career prospects"
    }
];

const departments = [
    "Claims & Underwriting",
    "Sales & Business Development",
    "Customer Service",
    "Finance & Administration",
    "Marketing & Communications",
    "Technology & Innovation"
];

const Careers = () => {
    return (
        <div className="careers">
            {/* Hero Section */}
            <section className="careers__hero">
                <div className="container">
                    <div className="careers__hero-content">
                        <span className="careers__badge">Join Our Team</span>
                        <h1 className="careers__title">Build Your Career with Starzed</h1>
                        <p className="careers__subtitle">
                            Join Kenya's leading insurance brokerage and be part of a team that values
                            integrity, innovation, and making a real impact.
                        </p>
                        <div className="careers__hero-stats">
                            <div className="stat-card">
                                <span className="stat__number">30+</span>
                                <span className="stat__label">Years in Business</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat__number">943+</span>
                                <span className="stat__label">Service Points</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat__number">47</span>
                                <span className="stat__label">Counties Covered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="careers__about">
                <div className="container">
                    <div className="careers__about-wrapper">
                        <div className="careers__about-text">
                            <h2 className="section-title">Why Choose Starzed?</h2>
                            <p className="section-description">
                                At Starzed Insurance Brokers, we believe our people are our greatest strength.
                                We foster an environment where talent thrives, ideas are valued, and every team
                                member contributes to our mission of making insurance accessible to all Kenyans.
                            </p>
                        </div>
                        <div className="careers__departments">
                            <h3 className="departments__title">Explore Opportunities</h3>
                            <div className="departments__grid">
                                {departments.map((dept, index) => (
                                    <div key={index} className="department__item">
                                        <div className="department__icon">
                                            <ArrowRight size={16} />
                                        </div>
                                        <span>{dept}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="careers__benefits">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-label">Perks & Benefits</span>
                        <h2 className="section-title">Employee Benefits</h2>
                        <p className="section-description">
                            We invest in our team's growth, well-being, and professional development
                        </p>
                    </div>
                    <div className="benefits__grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit__card">
                                <div className="benefit__icon">
                                    {benefit.icon}
                                </div>
                                <h3 className="benefit__title">{benefit.title}</h3>
                                <p className="benefit__description">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Current Openings */}
            <section className="careers__openings">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-label">Join Us</span>
                        <h2 className="section-title">Current Open Positions</h2>
                        <p className="section-description">
                            Join our team and help shape the future of insurance in Kenya
                        </p>
                    </div>
                    <div className="openings__content">
                        <div className="no-openings">
                            <div className="no-openings__icon">
                                <Users size={48} />
                            </div>
                            <h3 className="no-openings__title">No Current Openings</h3>
                            <p className="no-openings__description">
                                We're not actively hiring at the moment, but we're always interested in
                                connecting with talented individuals. Check back regularly or send us your
                                resume for future opportunities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="careers__cta">
                <div className="container">
                    <div className="cta__content">
                        <h2 className="cta__title">Join Our Talent Pool</h2>
                        <p className="cta__description">
                            Send us your resume and we'll keep you in mind for future opportunities
                            that match your skills and experience.
                        </p>
                        <a
                            href="mailto:careers@starzed.co.ke"
                            className="cta__button"
                        >
                            <Mail size={20} />
                            <span>Submit Your CV</span>
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;