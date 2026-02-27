import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import healthCoverImg from '../assets/images/comprehensive_health_cover_image.JPG';
import './Hero.css';

const slides = [
    {
        id: 1,
        badge: "Licensed by IRA",
        title: "Insurance Service",
        titleHighlight: "At Your Doorstep",
        description: "Experience reliable protection with our nationwide network. We bring insurance services closer to you through 943+ branches.",
        image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        ctaText: "Get a Free Quote",
        link: "/services"
    },
    {
        id: 2,
        badge: "Health Protection",
        title: "Comprehensive",
        titleHighlight: "Medical Insurance",
        description: "Secure the best healthcare for you and your family with our wide range of medical insurance plans from individual to executive coverage.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        ctaText: "Get Health Cover",
        link: "/products?category=Medical Insurance"
    },
    {
        id: 3,
        badge: "Life Security",
        title: "Life & Personal",
        titleHighlight: "Insurance",
        description: "Protect your loved ones' future with our comprehensive life assurance, pension plans, and investment products.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        ctaText: "Secure Future",
        link: "/products?category=Life & Personal Insurance"
    },
    {
        id: 4,
        badge: "Property Safety",
        title: "Complete Property",
        titleHighlight: "Protection",
        description: "Safeguard your home, business, and industrial property against fire, theft, and other perils with comprehensive coverage.",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        ctaText: "Protect Property",
        link: "/products?category=Property Insurance"
    },
    {
        id: 5,
        badge: "Liability Coverage",
        title: "Professional & Public",
        titleHighlight: "Liability Insurance",
        description: "Protect your business and professional practice against negligence claims, public liability, and specialized risks.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
        ctaText: "Get Liability Cover",
        link: "/products?category=Liability Insurance"
    },
    {
        id: 6,
        badge: "Vehicle Protection",
        title: "Comprehensive Motor",
        titleHighlight: "Vehicle Insurance",
        description: "From private cars to commercial fleets and motorcycles, our motor insurance covers all your vehicle needs comprehensively.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
        ctaText: "Insure Your Vehicle",
        link: "/products?category=Motor Insurance"
    },
    {
        id: 7,
        badge: "Business Security",
        title: "Business & Financial",
        titleHighlight: "Insurance Solutions",
        description: "Specialized insurance for businesses including contractors, bid bonds, school coverage, and comprehensive business protection.",
        image: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=800&q=80",
        ctaText: "Protect Business",
        link: "/products?category=Business & Financial Insurance"
    },
    {
        id: 8,
        badge: "Agricultural Protection",
        title: "Complete Agriculture",
        titleHighlight: "Insurance",
        description: "Protect your crops, livestock, and agricultural investments against weather, disease, theft, and other farming risks.",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
        ctaText: "Protect Farm",
        link: "/products?category=Agriculture insurance"
    },
    {
        id: 9,
        badge: "Travel Safety",
        title: "Comprehensive",
        titleHighlight: "Travel Insurance",
        description: "Travel with confidence covering single trips, annual multi-trip, student travel, and specialized corporate travel plans.",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
        ctaText: "Get Travel Cover",
        link: "/products?category=Travel insurance"
    }
];

const Hero = ({ onOpenQuote }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 8000); // 8 seconds for slower feeling
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="hero">
            <div className="hero__slides">
                {slides.map((item, index) => (
                    <div
                        key={item.id}
                        className={`hero__slide ${index === currentSlide ? 'hero__slide--active' : ''}`}
                    >
                        <div className="hero__background">
                            <div className="hero__image-wrapper">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="hero__image"
                                />
                                <div className="hero__image-gradient"></div>
                            </div>
                        </div>

                        <div className="container hero__container">
                            <div className="hero__content">
                                <div className="hero__badge">
                                    <Shield size={16} />
                                    <span>{item.badge}</span>
                                </div>

                                <h1 className="hero__title">
                                    {item.title}
                                    <span className="hero__title-highlight">{item.titleHighlight}</span>
                                </h1>

                                <p className="hero__description">
                                    {item.description}
                                </p>

                                <div className="hero__actions">
                                    <Link
                                        to={item.link}
                                        className="hero__btn hero__btn--primary"
                                    >
                                        {item.ctaText}
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>

                                <div className="hero__trust">
                                    <div className="trust-item">
                                        <CheckCircle size={20} />
                                        <span>Nationwide Coverage</span>
                                    </div>
                                    <div className="trust-item">
                                        <CheckCircle size={20} />
                                        <span>24/7 Claims Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="hero__controls">
                <button className="hero__nav-btn" onClick={prevSlide} aria-label="Previous slide">
                    <ChevronLeft size={24} />
                </button>
                <div className="hero__dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`hero__dot ${index === currentSlide ? 'hero__dot--active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                <button className="hero__nav-btn" onClick={nextSlide} aria-label="Next slide">
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    );
};

export default Hero;