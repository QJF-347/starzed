import React, { useState } from 'react';
import './GlobalPartnerships.css';
import ifpLogo from '../assets/images/ifp_logo.png';
import peaceFlagLogo from '../assets/images/peace_flag_logo.png';
import ifpImg1 from '../assets/images/ifp_image.png';
import peaceFlagImg1 from '../assets/images/peace_flag_image.png';

const GlobalPartnerships = () => {
    const [ifpExpanded, setIfpExpanded] = useState(false);
    const [peaceExpanded, setPeaceExpanded] = useState(false);

    return (
        <div className="global-partnerships">
            <section className="partnerships-hero">
                <div className="container">
                    <h1 className="hero__title">Global Partnerships</h1>
                    <p className="hero__intro">
                        At Starzed, we believe that business success goes hand-in-hand with social responsibility.
                        Our global partnerships reflect our commitment to peace, family advocacy, and community empowerment,
                        ensuring that our work in insurance strengthens communities both locally and internationally.
                    </p>
                </div>
            </section>

            <div className="container">
                {/* IFP Section */}
                <section className="partnership-section" id="ifp">
                    <div className="partnership-header">
                        <div className="partnership-logo-wrapper">
                            <img src={ifpLogo} alt="IFP Logo" className="partnership-logo" />
                        </div>
                        <div className="partnership-titles">
                            <h2 className="partnership-title">International Family Pageant (IFP)</h2>
                            <h3 className="partnership-subtitle">Family Advocacy & Leadership</h3>
                        </div>
                    </div>

                    <div className="partnership-content">
                        <p>
                            The International Family Pageant, founded by Queen Hadassah of Nigeria, celebrates leadership,
                            cultural heritage, and family values. Starzed proudly partners with IFP to support programs
                            that empower women, nurture youth leadership, and strengthen family-centric initiatives across Kenya.
                        </p>
                        <p>
                            Through our collaboration, we champion community development, mentorship opportunities,
                            and family advocacy programs, helping create resilient families and responsible future leaders.
                        </p>

                        <button
                            className="read-more-btn"
                            onClick={() => setIfpExpanded(!ifpExpanded)}
                        >
                            {ifpExpanded ? 'Read Less' : 'Read More'}
                        </button>

                        {ifpExpanded && (
                            <div className="expandable-content fade-in">
                                <p>
                                    Learn more about STARZED’s engagement with IFP, including sponsorship of contestants,
                                    educational workshops, and community programs that foster sustainable family values
                                    and youth empowerment.
                                </p>
                            </div>
                        )}

                        <div className="photo-gallery">
                            <div className="gallery-grid">
                                <div className="gallery-item">
                                    <img src={ifpImg1} alt="IFP Mentorship Workshop" />
                                    <div className="gallery-overlay">
                                        <span>Mentorship Workshops</span>
                                    </div>
                                </div>
                                {/* Placeholder for more gallery items if needed */}
                                <div className="gallery-item placeholder">
                                    <div className="placeholder-content">Pageant Events</div>
                                </div>
                                <div className="gallery-item placeholder">
                                    <div className="placeholder-content">Award Ceremonies</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Peace Flag Section */}
                <section className="partnership-section" id="peace-flag">
                    <div className="partnership-header">
                        <div className="partnership-logo-wrapper">
                            <img src={peaceFlagLogo} alt="Global Advocates of Peace Flag Logo" className="partnership-logo" />
                        </div>
                        <div className="partnership-titles">
                            <h2 className="partnership-title">Global Advocates of Peace Flag</h2>
                            <h3 className="partnership-subtitle">Kenya Chapter</h3>
                        </div>
                    </div>

                    <div className="partnership-content">
                        <p>
                            As Directors of the Global Advocates of Peace Flag – Kenya Chapter, Starzed supports the
                            Peace Flag Initiative, a symbol of conflict resolution, youth and women peace advocacy,
                            and cross-border unity.
                        </p>
                        <p>
                            Through flag hoisting ceremonies, community workshops, and advocacy campaigns, we engage
                            communities to foster ethical leadership, civic responsibility, and sustainable development.
                        </p>

                        <button
                            className="read-more-btn"
                            onClick={() => setPeaceExpanded(!peaceExpanded)}
                        >
                            {peaceExpanded ? 'Read Less' : 'Read More'}
                        </button>

                        {peaceExpanded && (
                            <div className="expandable-content fade-in">
                                <p>
                                    Explore Starzed’s peace-building activities, including youth training programs,
                                    dialogues with community leaders, and initiatives that strengthen social cohesion
                                    and civic engagement.
                                </p>
                            </div>
                        )}

                        <div className="photo-gallery">
                            <div className="gallery-grid">
                                <div className="gallery-item">
                                    <img src={peaceFlagImg1} alt="Flag Hoisting Ceremony" />
                                    <div className="gallery-overlay">
                                        <span>Flag Hoisting</span>
                                    </div>
                                </div>
                                <div className="gallery-item placeholder">
                                    <div className="placeholder-content">Community Workshops</div>
                                </div>
                                <div className="gallery-item placeholder">
                                    <div className="placeholder-content">Advocacy Campaigns</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default GlobalPartnerships;
