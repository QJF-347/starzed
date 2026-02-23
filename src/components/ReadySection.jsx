import React from 'react';
import { Search, FileText, MapPin, ArrowRight } from 'lucide-react';
import './ReadySection.css';

const ReadySection = ({ onOpenQuote }) => {
    return (
        <section className="section ready-section">
            <div className="container text-center">
                <span className="subtitle">Get Started</span>
                <h2 className="title text-white">Ready to Get Protected?</h2>
                <p className="description text-white-opacity mb-12">
                    Choose the best way to interact with us and secure your future today.
                </p>

                <div className="ready-grid">
                    <div className="ready-card">
                        <div className="ready-icon"><Search size={28} /></div>
                        <h3>Compare Policies</h3>
                        <p>Evaluate different insurance plans to find the best fit for your budget and needs.</p>
                        <a href="#" className="ready-link">Compare Now <ArrowRight size={16} /></a>
                    </div>
                    <div className="ready-card highlight">
                        <div className="ready-icon"><FileText size={28} /></div>
                        <h3>Request a Quote</h3>
                        <p>Get a personalized insurance quote within minutes. It’s free and easy.</p>
                        <button onClick={onOpenQuote} className="ready-link" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', textAlign: 'inherit' }}>
                            Get Quote <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="ready-card">
                        <div className="ready-icon"><MapPin size={28} /></div>
                        <h3>Find a Branch</h3>
                        <p>Locate the nearest Starzed or Kenya Post branch to visit us in person.</p>
                        <a href="#" className="ready-link">Find Location <ArrowRight size={16} /></a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReadySection;
