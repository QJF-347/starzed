import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Construction, Info } from 'lucide-react';
import './TemplatePage.css';

const TemplatePage = () => {
    const location = useLocation();
    const pageName = location.pathname.split('/').pop() || 'Page';
    const formattedName = pageName?.charAt(0)?.toUpperCase() + pageName?.slice(1)?.replace(/-/g, ' ') || 'Page';

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="template-page">
            <div className="container">
                <div className="template-content">
                    <div className="template-icon">
                        <Construction size={48} className="icon-main" />
                    </div>
                    <span className="template-label">Under Development</span>
                    <h1 className="template-title">{formattedName}</h1>
                    <p className="template-description">
                        We're currently building something amazing here. This section will soon be powered by our new backend systems to provide you with the most up-to-date insurance information.
                    </p>
                    <div className="template-info-box">
                        <Info size={20} />
                        <p>Coming Soon: Live data integration, personalized quotes, and real-time updates.</p>
                    </div>
                    <button onClick={handleGoBack} className="back-home-btn">
                        <ArrowLeft size={18} /> Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplatePage;
