import React, { useState } from 'react';
import './GlobalPartnerships.css';
import ifpLogo from '../assets/images/ifp_logo.png';
import peaceFlagLogo from '../assets/images/peace_flag_logo.png';
import ifpImg1 from '../assets/images/ifp_image.png';
import peaceFlagImg1 from '../assets/images/peace_flag_image.png';

// Import event photos
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

const GlobalPartnerships = () => {
    const [ifpExpanded, setIfpExpanded] = useState(false);
    const [peaceExpanded, setPeaceExpanded] = useState(false);
    const [ifpGalleryExpanded, setIfpGalleryExpanded] = useState(false);
    const [peaceGalleryExpanded, setPeaceGalleryExpanded] = useState(false);

    // Event photos for IFP (first 6 photos)
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

    // Event photos for Peace Flag (next 6 photos)
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

    const ifpVisiblePhotos = ifpGalleryExpanded ? ifpEventPhotos : ifpEventPhotos.slice(0, 6);
    const peaceVisiblePhotos = peaceGalleryExpanded ? peaceEventPhotos : peaceEventPhotos.slice(0, 6);

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

export default GlobalPartnerships;
