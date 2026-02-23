import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
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
        badge: "Drive with Peace",
        title: "Premium Motor",
        titleHighlight: "Vehicle Insurance",
        description: "From private cars to commercial fleets, our motor insurance covers you against theft, accidents, and third-party liabilities.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        ctaText: "Insure Your Car",
        link: "/products?id=motor"
    },
    {
        id: 3,
        badge: "Your Health First",
        title: "Comprehensive",
        titleHighlight: "Medical Cover",
        description: "Secure the best healthcare for you and your family. Our AfyaImara plans offer wide hospital networks and fast claims.",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        ctaText: "Get Health Cover",
        link: "/products?id=health"
    },
    {
        id: 4,
        badge: "Secure Your Future",
        title: "Business and Property ",
        titleHighlight: "Protection",
        description: "Safeguard your business assets and property from fire, theft, and operational risks with our customized commercial solutions.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        ctaText: "Protect Business",
        link: "//products?id=business"
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