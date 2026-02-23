import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
import './QuoteModal.css';

const QuoteModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: 'motor',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', service: 'motor', message: '' });
            }, 2500);
        }, 1500);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                {submitted ? (
                    <div className="modal-success">
                        <div className="success-icon">✓</div>
                        <h3>Request Sent Successfully!</h3>
                        <p>One of our insurance experts will contact you shortly.</p>
                    </div>
                ) : (
                    <>
                        <div className="modal-header">
                            <h2>Request a Quote</h2>
                            <p>Fill out the form below and we'll get back to you with a customized insurance quote.</p>
                        </div>

                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-wrapper">
                                        <User size={18} className="input-icon" />
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <div className="input-wrapper">
                                        <Phone size={18} className="input-icon" />
                                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+254 700 000 000" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={18} className="input-icon" />
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="service">Insurance Type</label>
                                    <select id="service" name="service" value={formData.service} onChange={handleChange} className="modal-select">
                                        <option value="motor">Motor Insurance</option>
                                        <option value="medical">Health & Medical</option>
                                        <option value="property">Property Insurance</option>
                                        <option value="business">Business Insurance</option>
                                        <option value="life">Life Assurance</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group full-width">
                                <label htmlFor="message">Additional Information (Optional)</label>
                                <div className="textarea-wrapper">
                                    <MessageSquare size={18} className="input-icon textarea-icon" />
                                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Tell us more about what you need..."></textarea>
                                </div>
                            </div>

                            <button type="submit" className="submit-quote-btn" disabled={isSubmitting}>
                                {isSubmitting ? <span className="spinner"></span> : <><Send size={18} /> Send Request</>}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuoteModal;
