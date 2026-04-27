import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield } from 'lucide-react';
import './Footer.css';

const Footer = ({ onOpenMessage, onOpenQuote, onOpenComplaint }) => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__content">
                    {/* Main Footer Content */}
                    <div className="footer__main">
                        <div className="footer__section footer__about">
                            <div className="footer__brand">
                                <Shield size={24} />
                                <div>
                                    <h3 className="footer__company-name">STARZED</h3>
                                    <p className="footer__company-tagline">Insurance Brokers Ltd</p>
                                </div>
                            </div>
                            <p className="footer__description">
                                Licensed by IRA and partnered with Kenya Post, we provide comprehensive insurance solutions nationwide with trusted service at your doorstep.
                            </p>
                            <div className="footer__social">
                                <a href="https://facebook.com/starzedMsureAppM-sure" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                                    <span style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>f</span>
                                </a>
                                <a href="https://twitter.com/starzedmsureinsurance" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                                    <span style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>𝕏</span>
                                </a>
                                <a href="https://instagram.com/starzedmsureinsurance" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                                    <span style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</span>
                                </a>
                                <a href="mailto:starzedinsurance@gmail.com" className="social-link" aria-label="Email">
                                    <Mail size={18} />
                                </a>
                            </div>
                        </div>

                        <div className="footer__section">
                            <h4 className="footer__section-title">Policies</h4>
                            <ul className="footer__links">
                                <li><Link to="/products">Motor Insurance</Link></li>
                                <li><Link to="/products">Accidental & Medical</Link></li>
                                <li><Link to="/products">Life Assurance</Link></li>
                                <li><Link to="/products">Property Insurance</Link></li>
                                <li><Link to="/products">Business Insurance</Link></li>
                            </ul>
                        </div>

                        <div className="footer__section">
                            <h4 className="footer__section-title">Company</h4>
                            <ul className="footer__links">
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/careers">Careers</Link></li>
                                <li><Link to="/blogs">Blogs & News</Link></li>
                                <li><Link to="/claims">File a Claim</Link></li>
                                <li><Link to="/contact">Find a Branch</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div className="footer__section footer__contact">
                            <h4 className="footer__section-title">Contact Info</h4>
                            <ul className="footer__contact-info">
                                <li>
                                    <Phone size={16} />
                                    <div>
                                        <span className="contact-label">Phone</span>
                                        <a href="tel:+254758555333">+254 758 555 333</a>
                                    </div>
                                </li>
                                <li>
                                    <Mail size={16} />
                                    <div>
                                        <span className="contact-label">Email</span>
                                        <button onClick={() => onOpenMessage()} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>
                                            info@starzed.co.ke
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <button onClick={onOpenQuote} className="footer-quote-btn" style={{ marginTop: '1rem', width: '100%' }}>
                                        Request Quote
                                    </button>
                                </li>
                                <li>
                                    <MapPin size={16} />
                                    <div>
                                        <span className="contact-label">Head Office</span>
                                        <span>Nakuru, Kenya</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="footer__bottom">
                        <div className="footer__bottom-content">
                            <p className="footer__copyright">
                                &copy; {new Date().getFullYear()} Starzed Insurance Brokers Ltd. All rights reserved.
                            </p>
                            <div className="footer__legal">
                                <Link to="/compliance">Compliance & Legal</Link>
                                <button onClick={onOpenComplaint} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}>Complaints</button>
                            </div>
                        </div>
                        <div className="footer__certification">
                            <span>Licensed by IRA</span>
                            <span>•</span>
                            <span>Member of AIB-K</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;