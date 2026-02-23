import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Menu, X, Shield } from 'lucide-react';
import logo from '../assets/images/STARZED_LOGO-removebg-preview.png';
import './Header.css';

const Header = ({ onOpenQuote, onOpenMessage }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
            {/* Top Bar */}
            <div className="top-bar">
                <div className="container" style={{ maxWidth: '92%', margin: '0 auto' }}>
                    <div className="top-bar__content">
                        <div className="top-bar__contact">
                            <a href="tel:+254758555333" className="contact-item">
                                <Phone size={14} />
                                +254 758 555 333
                            </a>
                            <button onClick={onOpenMessage} className="contact-item" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}>
                                <Mail size={14} />
                                info@starzed.co.ke
                            </button>
                        </div>
                        <div className="top-bar__message">
                            <Shield size={14} />
                            <span>Insurance Service At Your Doorstep</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="main-nav">
                <div className="container" style={{ maxWidth: '92%', margin: '0 auto' }}>
                    <div className="nav-container">
                        {/* Logo */}
                        <Link to="/" className="logo">
                            <img src={logo} alt="STARZED Insurance Logo" className="logo__image" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className={`nav ${menuOpen ? 'nav--open' : ''}`}>
                            <Link to="/" className="nav__link">Home</Link>
                            <Link to="/about" className="nav__link">About Us</Link>
                            <Link to="/services" className="nav__link">Services</Link>
                            <Link to="/claims" className="nav__link">Claims</Link>
                            <Link to="/blogs" className="nav__link">Blogs</Link>
                            <Link to="/careers" className="nav__link">Careers</Link>
                            <Link to="/contact" className="nav__link">Contact</Link>
                        </nav>

                        {/* CTA Button */}
                        <div className="header-actions">
                            <Link to="/login" className="login-btn">
                                Log In
                            </Link>

                            <button
                                className="cta-btn"
                                onClick={onOpenQuote}
                            >
                                Request Quote
                            </button>

                            <button
                                className="menu-toggle"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;