import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, Menu, X, Shield, LogOut, Settings, User } from 'lucide-react';
import logo from '../assets/images/STARZED_LOGO-removebg-preview.png';
import './Header.css';

const Header = ({ onOpenQuote, onOpenMessage }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

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

    useEffect(() => {
        // Check authentication status on component mount and when localStorage changes
        const checkAuthStatus = () => {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('user');
            
            if (token && userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkAuthStatus();

        // Listen for storage changes (for multi-tab support)
        const handleStorageChange = (e) => {
            if (e.key === 'authToken' || e.key === 'user') {
                checkAuthStatus();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
            {/* Top Bar */}
            <div className="top-bar">
                <div className="header-content">
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
                            <span>Insurance Policy At Your Doorstep</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="main-nav">
                <div className="header-content">
                    <div className="nav-container">
                        {/* Logo */}
                        <Link to="/" className="logo">
                            <img src={logo} alt="STARZED Insurance Logo" className="logo__image" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className={`nav ${menuOpen ? 'nav--open' : ''}`}>
                            <Link to="/" className="nav__link">Home</Link>
                            <Link to="/about" className="nav__link">About Us</Link>
                            <Link to="/policies" className="nav__link">Policies</Link>
                            <Link to="/claims" className="nav__link">Claims</Link>
                            <Link to="/blogs" className="nav__link">Blogs</Link>
                            <Link to="/careers" className="nav__link">Careers</Link>
                            <div className="nav-dropdown">
                                <button className="nav__link dropdown-toggle">
                                    Global Partnerships
                                </button>
                                <div className="dropdown-menu">
                                    <Link to="/global-peace-advocates" className="dropdown-item">Global Peace Advocates</Link>
                                    <Link to="/international-family-pageant" className="dropdown-item">International Family Pageant</Link>
                                </div>
                            </div>
                            <Link to="/contact" className="nav__link">Contact</Link>
                        </nav>

                        {/* Mobile Overlay */}
                        {menuOpen && (
                            <div
                                className="nav-overlay"
                                onClick={() => setMenuOpen(false)}
                                aria-hidden="true"
                            />
                        )}

                        {/* CTA Button */}
                        <div className="header-actions">
                            {user ? (
                                <>
                                    {/* Admin button for admin users */}
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="admin-btn">
                                            <Settings size={16} />
                                            Admin
                                        </Link>
                                    )}
                                    
                                    {/* Agent button for agent and admin users */}
                                    {(user.role === 'agent' || user.role === 'admin') && (
                                        <Link to="/agent" className="agent-btn">
                                            <User size={16} />
                                            Agent
                                        </Link>
                                    )}
                                    
                                    {/* Logout button */}
                                    <button onClick={handleLogout} className="logout-btn">
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                /* Login button for non-authenticated users */
                                <Link to="/login" className="login-btn">
                                    Log In
                                </Link>
                            )}

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