import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Shield } from 'lucide-react';
import './Footer.css';

const Footer = ({ onOpenMessage }) => {
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
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <Facebook size={18} />
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <Twitter size={18} />
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <Instagram size={18} />
                                </a>
                                <a href="#" className="social-link" aria-label="LinkedIn">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>

                        <div className="footer__section">
                            <h4 className="footer__section-title">Services</h4>
                            <ul className="footer__links">
                                <li><a href="#">Motor Insurance</a></li>
                                <li><a href="#">Accidental & Medical</a></li>
                                <li><a href="#">Life Assurance</a></li>
                                <li><a href="#">Property Insurance</a></li>
                                <li><a href="#">Business Insurance</a></li>
                            </ul>
                        </div>

                        <div className="footer__section">
                            <h4 className="footer__section-title">Company</h4>
                            <ul className="footer__links">
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><Link to="/blogs">Blogs & News</Link></li>
                                <li><a href="#">File a Claim</a></li>
                                <li><a href="#">Find a Branch</a></li>
                                <li><a href="#">Contact Us</a></li>
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
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Complaints</a>
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