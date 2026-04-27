import React, { useState } from 'react';
import { X, AlertCircle, User, Mail, Phone, FileText, MessageSquare } from 'lucide-react';
import './ComplaintModal.css';

const ComplaintModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        policyNumber: '',
        complaintType: '',
        subject: '',
        description: '',
        preferredContact: 'email',
        urgency: 'normal'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const complaintTypes = [
        'Policy Issue',
        'Claim Dispute',
        'Service Quality',
        'Billing Problem',
        'Communication Issue',
        'Coverage Question',
        'Other'
    ];

    const urgencyLevels = [
        { value: 'low', label: 'Low - General Inquiry' },
        { value: 'normal', label: 'Normal - Standard Response Time' },
        { value: 'high', label: 'High - Urgent Attention Required' },
        { value: 'critical', label: 'Critical - Immediate Response Needed' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            
            // Reset form after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                handleClose();
            }, 3000);
        }, 1500);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                policyNumber: '',
                complaintType: '',
                subject: '',
                description: '',
                preferredContact: 'email',
                urgency: 'normal'
            });
            setIsSubmitted(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="complaint-modal-overlay" onClick={handleClose}>
            <div className="complaint-modal" onClick={(e) => e.stopPropagation()}>
                <div className="complaint-modal-header">
                    <div className="complaint-modal-title">
                        <AlertCircle size={24} />
                        <h2>File a Complaint</h2>
                    </div>
                    <button 
                        className="complaint-modal-close" 
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="complaint-modal-content">
                    {isSubmitted ? (
                        <div className="complaint-success">
                            <div className="success-icon">
                                <AlertCircle size={48} />
                            </div>
                            <h3>Complaint Submitted Successfully</h3>
                            <p>Your complaint has been received and will be reviewed by our team. 
                               We will respond to you within 24-48 hours based on the urgency level.</p>
                            <p className="reference-number">
                                Reference: CMP-{Date.now().toString().slice(-6)}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="complaint-form">
                            <div className="complaint-form-grid">
                                <div className="form-group">
                                    <label htmlFor="fullName">
                                        <User size={16} />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">
                                        <Mail size={16} />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">
                                        <Phone size={16} />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+254 XXX XXX XXX"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="policyNumber">
                                        <FileText size={16} />
                                        Policy Number (if applicable)
                                    </label>
                                    <input
                                        type="text"
                                        id="policyNumber"
                                        name="policyNumber"
                                        value={formData.policyNumber}
                                        onChange={handleChange}
                                        placeholder="POL-XXXX-XXXX"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="complaintType">
                                        <AlertCircle size={16} />
                                        Complaint Type *
                                    </label>
                                    <select
                                        id="complaintType"
                                        name="complaintType"
                                        value={formData.complaintType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select complaint type</option>
                                        {complaintTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="urgency">
                                        <AlertCircle size={16} />
                                        Urgency Level *
                                    </label>
                                    <select
                                        id="urgency"
                                        name="urgency"
                                        value={formData.urgency}
                                        onChange={handleChange}
                                        required
                                    >
                                        {urgencyLevels.map(level => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="subject">
                                        <MessageSquare size={16} />
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Brief description of your complaint"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="description">
                                        <FileText size={16} />
                                        Detailed Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        placeholder="Please provide detailed information about your complaint, including any relevant dates, names, and specific issues..."
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="preferredContact">
                                        <Phone size={16} />
                                        Preferred Contact Method *
                                    </label>
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="preferredContact"
                                                value="email"
                                                checked={formData.preferredContact === 'email'}
                                                onChange={handleChange}
                                            />
                                            Email
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="preferredContact"
                                                value="phone"
                                                checked={formData.preferredContact === 'phone'}
                                                onChange={handleChange}
                                            />
                                            Phone
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="complaint-form-footer">
                                <button 
                                    type="button" 
                                    className="complaint-btn complaint-btn-secondary" 
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="complaint-btn complaint-btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintModal;
