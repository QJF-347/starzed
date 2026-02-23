import React from 'react';
import { Phone, Mail, MessageCircle, FileText, CheckCircle, Clock, Shield, Search, PenTool, AlertCircle } from 'lucide-react';
import './Claims.css';

const steps = [
    {
        icon: <AlertCircle size={20} />,
        num: 1,
        title: "Report Incident",
        desc: "Notify us immediately about the incident via our hotline or email to initiate the process."
    },
    {
        icon: <FileText size={20} />,
        num: 2,
        title: "Submit Documents",
        desc: "Provide all necessary documentation including police abstracts, photos, and claim forms."
    },
    {
        icon: <Search size={20} />,
        num: 3,
        title: "Claim Assessment",
        desc: "Our team reviews the details and documentation to verify coverage and extent of loss."
    },
    {
        icon: <PenTool size={20} />,
        num: 4,
        title: "Investigation",
        desc: "If required, a surveyor or investigator will be assigned to assess the damage."
    },
    {
        icon: <CheckCircle size={20} />,
        num: 5,
        title: "Approval & Offer",
        desc: "Upon successful verification, we will issue a settlement offer for your review."
    },
    {
        icon: <Shield size={20} />,
        num: 6,
        title: "Settlement",
        desc: "Payment is processed and released to you or the service provider immediately."
    }
];

const supportContacts = [
    {
        icon: <Phone size={24} />,
        color: 'red',
        title: "Emergency Hotline",
        description: "Available 24/7 for urgent assistance.",
        contact: "+254 758 555 333",
        link: "tel:+254758555333"
    },
    {
        icon: <Mail size={24} />,
        color: 'blue',
        title: "Email Support",
        description: "Send your documents and queries.",
        contact: "claims@starzed.co.ke",
        link: "mailto:claims@starzed.co.ke"
    },
    {
        icon: <MessageCircle size={24} />,
        color: 'green',
        title: "WhatsApp",
        description: "Chat with our claims team instantly.",
        contact: "Start Chat",
        link: "https://wa.me/254758555333"
    }
];

const Claims = () => {
    return (
        <div className="claims">
            <div className="container">
                {/* Hero Section */}
                <div className="claims__hero">
                    <h1 className="claims__title">Claims Assistance</h1>
                    <p className="claims__subtitle">
                        We're here to guide you through every step of the claims process, 
                        ensuring a smooth and fair settlement.
                    </p>
                </div>

                {/* Main Content */}
                <div className="claims__content">
                    {/* Claims Process */}
                    <div className="claims__process">
                        <div className="claims__process-header">
                            <h2 className="claims__section-title">Claims Process</h2>
                            <p className="claims__section-description">
                                Follow these steps for a smooth claims experience
                            </p>
                        </div>
                        
                        <div className="claims__steps">
                            {steps.map((step, index) => (
                                <div key={step.num} className="claims__step">
                                    <div className="step__header">
                                        <div className="step__number">
                                            {step.num}
                                        </div>
                                        <div className="step__icon">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <div className="step__content">
                                        <h3 className="step__title">{step.title}</h3>
                                        <p className="step__description">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Contacts */}
                    <div className="claims__support">
                        <div className="support__header">
                            <h2 className="claims__section-title">Get Help Now</h2>
                            <p className="claims__section-description">
                                Contact our claims team for immediate assistance
                            </p>
                        </div>
                        
                        <div className="support__contacts">
                            {supportContacts.map((contact, index) => (
                                <div key={index} className="support__card" data-color={contact.color}>
                                    <div className="support__card-icon">
                                        {contact.icon}
                                    </div>
                                    <div className="support__card-content">
                                        <h3 className="support__card-title">{contact.title}</h3>
                                        <p className="support__card-description">{contact.description}</p>
                                        <a 
                                            href={contact.link} 
                                            className="support__card-link"
                                            target={contact.color === 'green' ? "_blank" : "_self"}
                                            rel={contact.color === 'green' ? "noopener noreferrer" : ""}
                                        >
                                            {contact.contact}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Claims;