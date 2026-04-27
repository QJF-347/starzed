import React, { useState } from 'react';
import './GlobalPartnerships.css';
import ifpLogo from '../assets/images/ifp_logo.png';

// Import event photos for IFP
import e1 from '../assets/images/event_photos/e1.jpeg';
import e2 from '../assets/images/event_photos/e2.jpeg';
import e3 from '../assets/images/event_photos/e3.jpeg';
import e4 from '../assets/images/event_photos/e4.jpeg';
import e5 from '../assets/images/event_photos/e5.jpeg';
import e6 from '../assets/images/event_photos/e6.jpeg';
import e7 from '../assets/images/event_photos/e7.jpeg';
import e8 from '../assets/images/event_photos/e8.jpeg';
import e9 from '../assets/images/event_photos/e9.jpeg';
import e10 from '../assets/images/event_photos/e10.jpeg';
import e11 from '../assets/images/event_photos/e11.jpeg';
import e12 from '../assets/images/event_photos/e12.jpeg';

const InternationalFamilyPageant = () => {
    const [ifpExpanded, setIfpExpanded] = useState(false);
    const [ifpGalleryExpanded, setIfpGalleryExpanded] = useState(false);

    // Event photos for IFP
    const ifpEventPhotos = [
        { id: 1, src: e1, alt: 'IFP Event 1 - Mentorship Workshop' },
        { id: 2, src: e2, alt: 'IFP Event 2 - Pageant Ceremony' },
        { id: 3, src: e3, alt: 'IFP Event 3 - Award Ceremony' },
        { id: 4, src: e4, alt: 'IFP Event 4 - Leadership Training' },
        { id: 5, src: e5, alt: 'IFP Event 5 - Community Outreach' },
        { id: 6, src: e6, alt: 'IFP Event 6 - Cultural Celebration' },
        { id: 7, src: e7, alt: 'IFP Event 7 - Youth Empowerment' },
        { id: 8, src: e8, alt: 'IFP Event 8 - Family Advocacy' },
        { id: 9, src: e9, alt: 'IFP Event 9 - Educational Workshop' },
        { id: 10, src: e10, alt: 'IFP Event 10 - Community Development' },
        { id: 11, src: e11, alt: 'IFP Event 11 - Women Leadership' },
        { id: 12, src: e12, alt: 'IFP Event 12 - Peace Building' }
    ];

    const ifpVisiblePhotos = ifpGalleryExpanded ? ifpEventPhotos : ifpEventPhotos.slice(0, 6);

    return (
        <div className="global-partnerships">
            <section className="partnerships-hero">
                <div className="container">
                    <h1 className="hero__title">International Family Pageant (IFP)</h1>
                    <p className="hero__intro">
                        The International Family Pageant, founded by Queen Hadassah of Nigeria, celebrates leadership,
                        cultural heritage, and family values. Starzed proudly partners with IFP to support programs
                        that empower women, nurture youth leadership, and strengthen family-centric initiatives across Kenya.
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
                                    Learn more about STARZED's engagement with IFP, including sponsorship of contestants,
                                    educational workshops, and community programs that foster sustainable family values
                                    and youth empowerment.
                                </p>
                            </div>
                        )}

                        <div className="photo-gallery">
                            <h3 className="gallery-title">Event Gallery</h3>
                            <div className="gallery-grid">
                                {ifpVisiblePhotos.map((photo) => (
                                    <div key={photo.id} className="gallery-item">
                                        <img src={photo.src} alt={photo.alt} />
                                        <div className="gallery-overlay">
                                            <span>{photo.alt.split(' - ')[1]}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {ifpEventPhotos.length > 6 && (
                                <button 
                                    className="gallery-more-btn"
                                    onClick={() => setIfpGalleryExpanded(!ifpGalleryExpanded)}
                                >
                                    {ifpGalleryExpanded ? 'Show Less' : `Show More (${ifpEventPhotos.length - 6} more)`}
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default InternationalFamilyPageant;
