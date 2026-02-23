import React from 'react';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import Services from '../components/Services';
import Partners from '../components/Partners';
import ReadySection from '../components/ReadySection';
import CoreValues from '../components/CoreValues';
import { MessageCircle } from 'lucide-react';

const Home = ({ onOpenQuote }) => {
    return (
        <>
            <Hero onOpenQuote={onOpenQuote} />
            <Statistics />
            <Services />
            <Partners />
            <ReadySection onOpenQuote={onOpenQuote} />
            <CoreValues />
            {/* Floating WhatsApp Button */}
            <a href="https://wa.me/254758555333" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center" style={{ backgroundColor: '#25D366' }}>
                <MessageCircle size={28} />
            </a>
        </>
    );
};

export default Home;
