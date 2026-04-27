import React from 'react';
import './CoreValues.css';

const values = [
    { letter: 'S', title: 'Service', desc: 'Commitment to exceptional customer service.' },
    { letter: 'T', title: 'Trust', desc: 'Building lasting relationships through integrity.' },
    { letter: 'A', title: 'Accessibility', desc: 'Services available whenever and wherever you need.' },
    { letter: 'R', title: 'Responsibility', desc: 'Acting with accountability in all we do.' },
    { letter: 'Z', title: 'Zeal', desc: 'Passionate about protecting what matters to you.' },
    { letter: 'E', title: 'Empowerment', desc: 'Enabling you to make informed insurance decisions.' },
    { letter: 'D', title: 'Dedication', desc: 'Unwavering support for our clients.' }
];

const CoreValues = () => {
    return (
        <section className="section values-section" id="values">
            <div className="container">
                <div className="section-header text-center mb-16">
                    <span className="subtitle">Who We Are</span>
                    <h2 className="title">Our Core Values</h2>
                    <p className="description">The pillars that define the Starzed experience.</p>
                </div>

                <div className="values-grid">
                    {values.map((item, index) => (
                        <div key={index} className="value-card">
                            <div className="value-letter">{item.letter}</div>
                            <h3 className="value-title">{item.title}</h3>
                            <p className="value-desc">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mission-vision-grid mt-24">
                    <div className="mv-card mission">
                        <h3>Our Mission</h3>
                        <p>To provide accessible, reliable, and comprehensive insurance solutions that empower individuals and businesses to secure their future with confidence.</p>
                    </div>
                    <div className="mv-card vision">
                        <h3>Our Vision</h3>
                        <p>To be the leading insurance brokerage in the region, recognized for our integrity, customer-centric approach, and nationwide accessibility.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoreValues;
