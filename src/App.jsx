import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Claims from './pages/Claims';
import Products from './pages/Products';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import ProductDetail from './pages/ProductDetail';
import Blogs from './pages/Blogs';
import Login from './pages/Login';
import Register from './pages/Register';
import QuoteModal from './components/QuoteModal';
import MessageModal from './components/MessageModal';
import './index.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [activeEmail, setActiveEmail] = useState("info@starzed.co.ke");

  const toggleQuoteModal = () => setIsQuoteOpen(!isQuoteOpen);
  const openMessageModal = (email = "info@starzed.co.ke") => {
    setActiveEmail(email);
    setIsMessageOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header onOpenQuote={toggleQuoteModal} onOpenMessage={() => openMessageModal()} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onOpenQuote={toggleQuoteModal} onOpenMessage={openMessageModal} />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/products" element={<Products />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer onOpenMessage={() => openMessageModal()} />
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        recipientEmail={activeEmail}
      />
    </div>
  );
}

export default App;
