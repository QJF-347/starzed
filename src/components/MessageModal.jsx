import React, { useState } from 'react';
import { X, Send, User, Mail, MessageSquare } from 'lucide-react';
import './QuoteModal.css'; // Reusing some base styles

const MessageModal = ({ isOpen, onClose, recipientEmail = "info@starzed.co.ke" }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
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

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
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
                        <h3>Message Sent!</h3>
                        <p>Your message to {recipientEmail} has been sent. We'll reply soon.</p>
                    </div>
                ) : (
                    <>
                        <div className="modal-header" style={{ background: 'linear-gradient(135deg, var(--secondary-dark) 0%, var(--secondary) 100%)' }}>
                            <h2>Send a Message</h2>
                            <p>Direct inquiry to {recipientEmail}</p>
                        </div>

                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="input-group full-width" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="name">Full Name</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" />
                                </div>
                            </div>

                            <div className="input-group full-width" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="email">Your Email</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" />
                                </div>
                            </div>

                            <div className="input-group full-width" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="subject">Subject</label>
                                <div className="input-wrapper">
                                    <MessageSquare size={18} className="input-icon" />
                                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="What is this about?" />
                                </div>
                            </div>

                            <div className="input-group full-width">
                                <label htmlFor="message">Message</label>
                                <div className="textarea-wrapper">
                                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="5" required placeholder="Type your message here..."></textarea>
                                </div>
                            </div>

                            <button type="submit" className="submit-quote-btn" style={{ background: 'var(--secondary)' }} disabled={isSubmitting}>
                                {isSubmitting ? <span className="spinner"></span> : <><Send size={18} /> Send Message</>}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageModal;
