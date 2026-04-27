import React, { useState, useEffect } from 'react';
import { X, Send, User, Mail, Phone, MessageSquare, ChevronDown } from 'lucide-react';
import apiService from '../services/api';
import './QuoteModal.css';

const QuoteModal = ({ isOpen, onClose, preSelectedProduct = null }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        product: '',
        coverage: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await apiService.getProducts();
                setProducts(data.success ? data.data : []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    // Handle pre-filled product data
    useEffect(() => {
        if (preSelectedProduct) {
            setFormData(prev => ({
                ...prev,
                product: preSelectedProduct.id || preSelectedProduct.name,
                coverage: '', // Keep coverage field empty
                message: '' // Keep message field empty
            }));
        }
    }, [preSelectedProduct]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await apiService.submitQuote(formData);
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setFormData({ firstName: '', lastName: '', email: '', phone: '', product: '', coverage: '', message: '' });
            }, 2500);
        } catch (error) {
            console.error('Error submitting quote:', error);
            alert('Error submitting quote. Please try again.');
            setIsSubmitting(false);
        }
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
                                    <label htmlFor="firstName">First Name</label>
                                    <div className="input-wrapper">
                                        <User size={18} className="input-icon" />
                                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <div className="input-wrapper">
                                        <User size={18} className="input-icon" />
                                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
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
                                    <label htmlFor="phone">Phone Number</label>
                                    <div className="input-wrapper">
                                        <Phone size={18} className="input-icon" />
                                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+254 700 000 000" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="product">Insurance Product</label>
                                    <select id="product" name="product" value={formData.product} onChange={handleChange} className="modal-select" required>
                                        <option value="">Select a product</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>{product.name || product.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="coverage">Coverage Details</label>
                                    <div className="input-wrapper">
                                        <MessageSquare size={18} className="input-icon" />
                                        <input type="text" id="coverage" name="coverage" value={formData.coverage} onChange={handleChange} required placeholder="e.g., KES 500,000 coverage" />
                                    </div>
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
