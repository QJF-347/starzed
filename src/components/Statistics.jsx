import React from 'react';
import { Award, ShieldCheck, MapPin, Building2, ExternalLink } from 'lucide-react';
import './Statistics.css';

const stats = [
    {
        number: '30+',
        label: 'Years of Experience',
        icon: <Award size={24} />,
        color: '#2563eb'
    },
    {
        number: '59',
        label: 'Insurance Partners',
        icon: <Building2 size={24} />,
        color: '#7c3aed'
    },
    {
        number: '943+',
        label: 'Branches Nationwide',
        icon: <MapPin size={24} />,
        color: '#db2777'
    },
    {
        number: '47',
        label: 'Counties Covered',
        icon: <ShieldCheck size={24} />,
        color: '#059669'
    }
];

const Statistics = () => {
    return (
        <section className="stats-boxed-section">
            <div className="container">
                <div className="stats-header-centered">
                    <span className="stats-badge-modern">Our Track Record</span>
                    <h2 className="stats-title-bold">The Numbers That Define Our <span className="highlight-text">Commitment</span></h2>
                    <p className="stats-desc-center">
                        With over three decades of service, we have built an extensive network and a reputation for reliability that spans across the entire nation.
                    </p>
                </div>

                <div className="stats-boxes-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-premium-box">
                            <div className="stat-box__icon-circle" style={{ '--icon-color': stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-box__content">
                                <span className="stat-box__number">{stat.number}</span>
                                <span className="stat-box__label">{stat.label}</span>
                            </div>
                            <div className="stat-box__decoration"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;