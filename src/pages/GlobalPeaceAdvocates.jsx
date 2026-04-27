import React, { useState } from 'react';
import './GlobalPartnerships.css';
import peaceFlagLogo from '../assets/images/peace_flag_logo.png';
import globalPeaceHero from '../assets/images/global_peace_hero.png';

// Import event photos for Peace Flag
import e13 from '../assets/images/event_photos/e13.jpeg';
import e14 from '../assets/images/event_photos/e14.jpeg';
import e15 from '../assets/images/event_photos/e15.jpeg';
import e16 from '../assets/images/event_photos/e16.jpeg';
import e17 from '../assets/images/event_photos/e17.jpeg';
import e18 from '../assets/images/event_photos/e18.jpeg';
import e19 from '../assets/images/event_photos/e19.jpeg';
import e20 from '../assets/images/event_photos/e20.jpeg';
import e21 from '../assets/images/event_photos/e21.jpeg';
import e22 from '../assets/images/event_photos/e22.jpeg';
import e23 from '../assets/images/event_photos/e23.jpeg';
import e24 from '../assets/images/event_photos/e24.jpeg';

const GlobalPeaceAdvocates = () => {
    const [peaceExpanded, setPeaceExpanded] = useState(false);
    const [peaceGalleryExpanded, setPeaceGalleryExpanded] = useState(false);

    // Event photos for Peace Flag
    const peaceEventPhotos = [
        { id: 13, src: e13, alt: 'Peace Flag Event 1 - Flag Hoisting Ceremony' },
        { id: 14, src: e14, alt: 'Peace Flag Event 2 - Community Workshop' },
        { id: 15, src: e15, alt: 'Peace Flag Event 3 - Youth Training' },
        { id: 16, src: e16, alt: 'Peace Flag Event 4 - Advocacy Campaign' },
        { id: 17, src: e17, alt: 'Peace Flag Event 5 - Peace Building' },
        { id: 18, src: e18, alt: 'Peace Flag Event 6 - Community Dialogue' },
        { id: 19, src: e19, alt: 'Peace Flag Event 7 - Civic Engagement' },
        { id: 20, src: e20, alt: 'Peace Flag Event 8 - Conflict Resolution' },
        { id: 21, src: e21, alt: 'Peace Flag Event 9 - Social Cohesion' },
        { id: 22, src: e22, alt: 'Peace Flag Event 10 - Ethical Leadership' },
        { id: 23, src: e23, alt: 'Peace Flag Event 11 - Cross-border Unity' },
        { id: 24, src: e24, alt: 'Peace Flag Event 12 - Sustainable Development' }
    ];

    const peaceVisiblePhotos = peaceGalleryExpanded ? peaceEventPhotos : peaceEventPhotos.slice(0, 6);

    return (
        <div className="global-partnerships">
            <section className="partnerships-hero">
                <div className="container">
                    <h1 className="hero__title">Global Advocates of Peace Flag</h1>
                    <p className="hero__intro">
                        As Directors of the Global Advocates of Peace Flag – Kenya Chapter, Starzed leads the
                        Peace Flag Initiative, a powerful symbol of conflict resolution, youth and women peace advocacy,
                        and cross-border unity. Through our dedicated efforts, we foster ethical leadership,
                        civic responsibility, and sustainable development across communities.
                    </p>
                </div>
            </section>

            <div className="container">
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
                                    Explore Starzed's peace-building activities, including youth training programs,
                                    dialogues with community leaders, and initiatives that strengthen social cohesion
                                    and civic engagement.
                                </p>
                            </div>
                        )}

                        <div className="photo-gallery">
                            <h3 className="gallery-title">Event Gallery</h3>
                            <div className="gallery-grid">
                                {peaceVisiblePhotos.map((photo) => (
                                    <div key={photo.id} className="gallery-item">
                                        <img src={photo.src} alt={photo.alt} />
                                        <div className="gallery-overlay">
                                            <span>{photo.alt.split(' - ')[1]}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {peaceEventPhotos.length > 6 && (
                                <button 
                                    className="gallery-more-btn"
                                    onClick={() => setPeaceGalleryExpanded(!peaceGalleryExpanded)}
                                >
                                    {peaceGalleryExpanded ? 'Show Less' : `Show More (${peaceEventPhotos.length - 6} more)`}
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default GlobalPeaceAdvocates;
