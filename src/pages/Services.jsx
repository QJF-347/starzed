import React from 'react';
import { Shield, Briefcase, HeartPulse, Home, Car, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import ReadySection from '../components/ReadySection';
import './Services.css';

const servicesData = [
    {
        id: 'motor',
        category: 'Motor Insurance',
        icon: <Car size={32} />,
        bgImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=400",
        title: "Motor Insurance",
        description: "Comprehensive coverage for your personal and commercial vehicles against accidents, theft, and third-party liabilities.",
        features: [
            "Comprehensive Cover",
            "Third Party, Fire & Theft",
            "Commercial Motor Cover",
            "PSV Insurance"
        ],
        color: "var(--primary)"
    },
    {
        id: 'health',
        category: 'Accidental & Medical Insurance',
        icon: <HeartPulse size={32} />,
        bgImage: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=400",
        title: "Health & Medical",
        description: "Protect your family and employees with our extensive medical covers offering inpatient and outpatient services.",
        features: [
            "Individual Health Cover",
            "Family Packages",
            "Corporate Medical Cover",
            "Maternity Benefits"
        ],
        color: "var(--secondary)"
    },
    {
        id: 'property',
        category: 'Non-Motor Insurance',
        icon: <Home size={32} />,
        bgImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
        title: "Property & Non-Motor",
        description: "Safeguard your most valuable assets, from your home to commercial buildings, against fire, theft, and natural disasters.",
        features: [
            "Homeowners Cover",
            "Fire & Perils",
            "Burglary Insurance",
            "All Risks Cover"
        ],
        color: "#0d9488"
    },
    {
        id: 'business',
        category: 'Non-Motor Insurance',
        icon: <Briefcase size={32} />,
        bgImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
        title: "Business Insurance",
        description: "Tailored solutions for enterprises of all sizes to protect against operational risks and liabilities.",
        features: [
            "Workmen's Compensation (WIBA)",
            "Professional Indemnity",
            "Directors & Officers Liability",
            "Contractors All Risks"
        ],
        color: "var(--primary-dark)"
    },
    {
        id: 'life',
        category: 'Accidental & Medical Insurance',
        icon: <Shield size={32} />,
        bgImage: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=400",
        title: "Life Assurance",
        description: "Secure your legacy and provide financial stability for your loved ones in the event of the unforeseen.",
        features: [
            "Term Life Insurance",
            "Whole Life Policy",
            "Education Policies",
            "Group Life Assurance"
        ],
        color: "#be123c"
    },
    {
        id: 'investment',
        category: 'Non-Motor Insurance',
        icon: <TrendingUp size={32} />,
        bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
        title: "Investment & Pensions",
        description: "Grow your wealth and plan for a comfortable retirement with our structured pension and investment schemes.",
        features: [
            "Personal Pension Plans",
            "Corporate Pension Schemes",
            "Unit Trusts",
            "Endowment Policies"
        ],
        color: "#0f766e"
    }
];

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

                    <div className="services-detailed__grid">
                        {servicesData.map((service, index) => (
                            <div key={index} className="service-detail-card">
                                <div className="service-detail__visual-container">
                                    <div className="service-detail__icon" style={{ backgroundColor: `${service.color}15`, color: service.color }}>
                                        {service.icon}
                                    </div>
                                    <div className="service-detail__bg-image" style={{ backgroundImage: `url(${service.bgImage})` }}></div>
                                </div>
                                <h3 className="service-detail__title">{service.title}</h3>
                                <p className="service-detail__description">{service.description}</p>

                                <ul className="service-detail__features">
                                    {service.features.map((feature, fIndex) => (
                                        <li key={fIndex}>
                                            <CheckCircle size={16} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className="service-detail__btn" onClick={() => window.open(`/products?id=${service.id}`, '_self')}>
                                    Learn More <ArrowRight size={16} />
                                </button>
                            </div>
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
