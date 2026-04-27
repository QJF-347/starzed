import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, User, CheckCircle } from 'lucide-react';
import './Contact.css';

const contactInfo = [
    {
        icon: <MapPin size={24} />,
        title: "Our Location",
        details: [
            "Starzed Plaza, Kenyatta Avenue",
            "Nakuru, Kenya"
        ],
        color: 'purple'
    },
    {
        icon: <Phone size={24} />,
        title: "Phone Number",
        details: [
            "+254 758 555 333",
            "+254 700 000 000"
        ],
        color: 'blue'
    },
    {
        icon: <Mail size={24} />,
        title: "Email Address",
        details: [
            "info@starzed.co.ke",
            "support@starzed.co.ke"
        ],
        color: 'red'
    },
    {
        icon: <Clock size={24} />,
        title: "Business Hours",
        details: [
            "Mon - Fri: 8:00 AM - 5:00 PM",
            "Sat: 9:00 AM - 1:00 PM"
        ],
        color: 'green'
    }
];

const Contact = ({ onOpenMessage }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would send this data to your backend
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="contact">
            <div className="container">
                {/* Hero Section */}
                <div className="contact__hero">
                    <h1 className="contact__title">Contact Us</h1>
                    <p className="contact__subtitle">
                        We'd love to hear from you. Here's how you can reach us.
                    </p>
                </div>

                {/* Main Content */}
                <div className="contact__content">
                    {/* Contact Information & Form */}
                    <div className="contact__info-form">
                        {/* Contact Information */}
                        <div className="contact__info">
                            <div className="contact__info-header">
                                <MessageSquare size={24} />
                                <h2 className="contact__section-title">Get in Touch</h2>
                            </div>
                            <p className="contact__section-description">
                                Reach out through any of these channels for immediate assistance.
                            </p>

                            <div className="contact__cards">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="contact__card" data-color={item.color}>
                                        <div className="contact__card-icon">
                                            {item.icon}
                                        </div>
                                        <div className="contact__card-content">
                                            <h3 className="contact__card-title">{item.title}</h3>
                                            {item.details.map((detail, idx) => (
                                                <p
                                                    key={idx}
                                                    className="contact__card-detail"
                                                    onClick={() => {
                                                        if (detail.includes('@')) onOpenMessage(detail);
                                                    }}
                                                    style={{ cursor: detail.includes('@') ? 'pointer' : 'default' }}
                                                >
                                                    {detail}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact__form-wrapper">
                            <div className="contact__form-header">
                                <User size={24} />
                                <h2 className="contact__section-title">Send a Message</h2>
                            </div>
                            <p className="contact__section-description">
                                Fill out the form below and we'll get back to you within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit} className="contact__form">
                                <div className="form__group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        className="form__input"
                                        required
                                    />
                                </div>

                                <div className="form__row">
                                    <div className="form__group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email Address"
                                            className="form__input"
                                            required
                                        />
                                    </div>
                                    <div className="form__group">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            className="form__input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form__group">
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Subject"
                                        className="form__input"
                                        required
                                    />
                                </div>

                                <div className="form__group">
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your Message"
                                        className="form__textarea"
                                        rows="5"
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="form__submit">
                                    {isSubmitted ? (
                                        <>
                                            <CheckCircle size={18} />
                                            Message Sent!
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="contact__map-section">
                        <div className="contact__map-header">
                            <MapPin size={24} />
                            <h2 className="contact__section-title">Find Our Location</h2>
                        </div>
                        <p className="contact__section-description">
                            Visit our head office in Nakuru or find us at any Kenya Post branch nationwide.
                        </p>

                        <div className="contact__map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.816990520268!2d36.07187127496464!3d-0.2861214997108927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18298d9750d36551%3A0x640b07b483164998!2sNakuru!5e0!3m2!1sen!2ske!4v1705667825344!5m2!1sen!2ske"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Starzed Insurance Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;