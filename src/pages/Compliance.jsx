import React from 'react';
import { Shield, FileText, Lock, Mail, Phone, Building } from 'lucide-react';
import './Compliance.css';

const Compliance = () => {
    return (
        <div className="compliance-page">
            <section className="compliance-hero">
                <div className="container">
                    <div className="compliance-header">
                        <Shield size={48} className="hero-icon" />
                        <h1>Compliance & Legal</h1>
                        <p>Regulatory requirements, privacy policy, and terms governing our insurance services</p>
                    </div>
                </div>
            </section>

            <section className="regulatory-requirements">
                <div className="container">
                    <h2>Regulatory Requirements</h2>
                    <p className="section-intro">All insurance premiums are subject to statutory charges as required by the Insurance Regulatory Authority (IRA):</p>
                    
                    <div className="requirements-grid">
                        <div className="requirement-card">
                            <div className="requirement-header">
                                <FileText size={24} />
                                <h3>Policyholders Compensation Fund (PCF) Levy</h3>
                            </div>
                            <div className="requirement-content">
                                <span className="levy-rate">0.25%</span>
                                <p>Charged on the insurance premium which protects policyholders in case an insurer becomes insolvent.</p>
                            </div>
                        </div>

                        <div className="requirement-card">
                            <div className="requirement-header">
                                <FileText size={24} />
                                <h3>Training Levy</h3>
                            </div>
                            <div className="requirement-content">
                                <span className="levy-rate">0.20%</span>
                                <p>Charged on the insurance premium and goes to the Insurance Training and Education Fund for industry capacity building.</p>
                            </div>
                        </div>

                        <div className="requirement-card">
                            <div className="requirement-header">
                                <FileText size={24} />
                                <h3>Stamp Duty</h3>
                            </div>
                            <div className="requirement-content">
                                <span className="levy-rate">KSh 40</span>
                                <p>Fixed charge on every insurance policy document issued.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="privacy-policy">
                <div className="container">
                    <h2>Privacy Policy & Consent</h2>
                    <p className="section-intro">How we handle your data and protect your privacy as required by the Data Protection Act, 2019</p>

                    <div className="privacy-sections">
                        <div className="privacy-section">
                            <h3><Lock size={20} /> Information We Collect</h3>
                            <p>We may collect the following details when you request a quote, buy a policy, or make a claim:</p>
                            <ul>
                                <li>Personal details (name, ID/passport number, KRA PIN, contact information)</li>
                                <li>Vehicle or property details (logbook, valuation, ownership records)</li>
                                <li>Payment and billing information</li>
                                <li>Claim details (accident reports, medical records, photos)</li>
                            </ul>
                        </div>

                        <div className="privacy-section">
                            <h3><Lock size={20} /> How We Use Your Information</h3>
                            <p>We only use your information for insurance-related purposes, including:</p>
                            <ul>
                                <li>Providing quotations and issuing policies</li>
                                <li>Processing renewals and claims</li>
                                <li>Customer service and communication</li>
                                <li>Legal, compliance, and regulatory reporting</li>
                            </ul>
                            <p><strong>We will not use your data for marketing or other purposes without your consent.</strong></p>
                        </div>

                        <div className="privacy-section">
                            <h3><Lock size={20} /> Sharing of Information</h3>
                            <p>We may share your information with:</p>
                            <ul>
                                <li>Licensed insurance intermediaries and underwriters</li>
                                <li>Service providers such as assessors, valuers, garages, or hospitals</li>
                                <li>Regulators like IRA, KRA, or PCF when required by law</li>
                            </ul>
                            <p><strong>We do not sell or rent your personal information to third parties.</strong></p>
                        </div>

                        <div className="privacy-section">
                            <h3><Lock size={20} /> Data Storage & Security</h3>
                            <p>Your information is stored securely in Kenya as required by the Data Protection Act, 2019. We use reasonable technical and organizational measures to protect your data from loss, misuse, or unauthorized access.</p>
                            <p>In case of a data breach, we are required by law to notify you and the regulator within 72 hours.</p>
                        </div>

                        <div className="privacy-section">
                            <h3><Lock size={20} /> Your Rights as a Client</h3>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Access the personal data we hold about you</li>
                                <li>Request correction or deletion of your data</li>
                                <li>Withdraw consent to data processing at any time</li>
                                <li>Object to your data being used for certain purposes</li>
                                <li>Lodge a complaint with the Office of the Data Protection Commissioner (ODPC)</li>
                            </ul>
                        </div>

                        <div className="privacy-section">
                            <h3><Lock size={20} /> Retention of Data</h3>
                            <p>We only keep your personal information for as long as it is necessary to fulfill insurance, legal, or regulatory requirements. After that, it is securely deleted.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <div className="container">
                    <h2>Contact Us</h2>
                    <p className="section-intro">If you have any questions about this Privacy Policy or how your data is used, please contact us:</p>
                    
                    <div className="contact-grid">
                        <div className="contact-card">
                            <Building size={24} />
                            <h3>Starzed Insurance</h3>
                            <p>Lanet Road, Nakuru Kenya</p>
                        </div>

                        <div className="contact-card">
                            <Phone size={24} />
                            <h3>Phone</h3>
                            <p>+254 728 361 170</p>
                        </div>

                        <div className="contact-card">
                            <Mail size={24} />
                            <h3>Email Addresses</h3>
                            <div className="email-list">
                                <p><strong>info@starzedinsurance.com</strong><br/>General inquiries, partnerships and media</p>
                                <p><strong>support@starzedinsurance.com</strong><br/>Customer support, portal issues, policy updates</p>
                                <p><strong>claims@starzedinsurance.com</strong><br/>Claim submissions and updates</p>
                                <p><strong>admin@starzedinsurance.com</strong><br/>Quotations and renewals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Compliance;
