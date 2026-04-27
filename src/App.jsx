import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Claims from './pages/Claims';
import Products from './pages/Products';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import About from './pages/About';
import Policies from './pages/Policies';
import PolicyDetail from './pages/PolicyDetail';
import Companies from './pages/Companies';
import ProductDetail from './pages/ProductDetail';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Register from './pages/Register';
import GlobalPartnerships from './pages/GlobalPartnerships';
import GlobalPeaceAdvocates from './pages/GlobalPeaceAdvocates';
import InternationalFamilyPageant from './pages/InternationalFamilyPageant';
import TemplatePage from './pages/TemplatePage';
import Compliance from './pages/Compliance';
import Payment from './pages/Payment';
import SecurePayment from './pages/SecurePayment';
import AdminDashboard from './pages/AdminDashboard';
import AdminHome from './pages/AdminHome';
import AdminProducts from './pages/AdminProducts';
import AdminPolicies from './pages/AdminPolicies';
import AdminCompanies from './pages/AdminCompanies';
import AdminCompanyDetail from './pages/AdminCompanyDetail';
import AdminBlogs from './pages/AdminBlogs';
import AdminUsers from './pages/AdminUsers';
import AdminSetup from './pages/AdminSetup';
import AgentLayout from './pages/agent/AgentLayout';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentClients from './pages/agent/Clients';
import AgentMotorInsurance from './pages/agent/MotorInsurance';
import AgentPolicies from './pages/agent/Policies';
import AgentTransactions from './pages/agent/Transactions';
import AgentRenewals from './pages/agent/Renewals';
import AgentReports from './pages/agent/Reports';
import AgentSettings from './pages/agent/Settings';
import InsurerCompanies from './pages/agent/InsurerCompanies';
import InsurerPremiumRates from './pages/agent/InsurerPremiumRates';
import AgentFiles from './pages/agent/AgentFiles';
import PostaBranches from './pages/agent/PostaBranches';
import InsuranceTypes from './pages/agent/InsuranceTypes';
import ProductFile from './pages/agent/ProductFile';
import CoverFile from './pages/agent/CoverFile';
import ExtraPremiumFile from './pages/agent/ExtraPremiumFile';
import PolicyTransaction from './pages/agent/PolicyTransaction';
import PolicyRenewal from './pages/agent/PolicyRenewal';
import PolicyEndorsement from './pages/agent/PolicyEndorsement';
import PolicyRenewalNote from './pages/agent/PolicyRenewalNote';
import CustomersReceipts from './pages/agent/transaction-files/receipts-payments/CustomersReceipts';
import Premium from './pages/agent/transaction-files/receipts-payments/Premium';
import PremiumPaymentLogs from './pages/agent/transaction-files/receipts-payments/PremiumPaymentLogs';
import InsurerPayment from './pages/agent/transaction-files/receipts-payments/InsurerPayment';
import PaymentLinkGenerator from './pages/agent/transaction-files/receipts-payments/PaymentLinkGenerator';
import Certificates from './pages/agent/file-management/Certificates';
import CertificateIssue from './pages/agent/file-management/CertificateIssue';
import CertificateDeclaration from './pages/agent/file-management/CertificateDeclaration';
import CertificateStatus from './pages/agent/file-management/CertificateStatus';
import AgentClaims from './pages/agent/transaction-files/Claims';
import TransactionFilesPolicies from './pages/agent/transaction-files/Policies';
import QuoteModal from './components/QuoteModal';
import MessageModal from './components/MessageModal';
import ComplaintModal from './components/ComplaintModal';
import ProtectedRoute from './components/ProtectedRoute';
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
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [activeEmail, setActiveEmail] = useState('info@starzedinsurance.com');
  const [preSelectedProduct, setPreSelectedProduct] = useState(null);
  const location = useLocation();

  const toggleQuoteModal = (product = null) => {
    setPreSelectedProduct(product);
    setIsQuoteOpen(!isQuoteOpen);
  };

  const openMessageModal = (email = "info@starzed.co.ke") => {
    setActiveEmail(email);
    setIsMessageOpen(true);
  };

  const toggleComplaintModal = () => {
    setIsComplaintOpen(!isComplaintOpen);
  };

  // Check if we're in admin routes
  const isAdminRoute = location.pathname.startsWith('/admin'); 
  // Check if we're in agent routes
  const isAgentRoute = location.pathname.startsWith('/agent');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<AdminHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="policies" element={<AdminPolicies />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="companies/:companyId" element={<AdminCompanyDetail />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="setup" element={<AdminSetup />} />
          </Route>
        </Routes>
      </div>
    );
  }

  if (isAgentRoute) {
    return (
      <div className="min-h-screen">
        <ScrollToTop />
        <Routes>
          <Route path="/agent" element={
            <ProtectedRoute agentOnly={true}>
              <AgentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AgentDashboard />} />
            <Route path="clients" element={<AgentClients />} />
            <Route path="motor" element={<AgentMotorInsurance />} />
            <Route path="policies" element={<AgentPolicies />} />
            <Route path="transactions" element={<AgentTransactions />} />
            <Route path="renewals" element={<AgentRenewals />} />
            <Route path="reports" element={<AgentReports />} />
            <Route path="settings" element={<AgentSettings />} />
            <Route path="insurer-companies" element={<InsurerCompanies />} />
            <Route path="insurer-premium-rates" element={<InsurerPremiumRates />} />
            <Route path="insurance-types" element={<InsuranceTypes />} />
            <Route path="product-file" element={<ProductFile />} />
            <Route path="cover-file" element={<CoverFile />} />
            <Route path="extra-premium-file" element={<ExtraPremiumFile />} />
            <Route path="transaction-files/policy-transactions" element={<Navigate to="/agent/transaction-files/policy-transactions/policy-transaction" replace />} />
            <Route path="transaction-files/policy-transactions/policy-transaction" element={<PolicyTransaction />} />
            <Route path="transaction-files/policy-transactions/policy-renewal" element={<PolicyRenewal />} />
            <Route path="transaction-files/policy-transactions/policy-endorsement" element={<PolicyEndorsement />} />
            <Route path="transaction-files/policy-transactions/policy-renewal-note" element={<PolicyRenewalNote />} />
            <Route path="transaction-files/receipts-payments" element={<Navigate to="/agent/transaction-files/receipts-payments/customers-receipts" replace />} />
            <Route path="transaction-files/receipts-payments/customers-receipts" element={<CustomersReceipts />} />
            <Route path="transaction-files/receipts-payments/premium" element={<Premium />} />
            <Route path="transaction-files/receipts-payments/premium-payment-logs" element={<PremiumPaymentLogs />} />
            <Route path="transaction-files/receipts-payments/insurer-payment" element={<InsurerPayment />} />
            <Route path="transaction-files/receipts-payments/payment-link-generator" element={<PaymentLinkGenerator />} />
            <Route path="transaction-files/claims" element={<AgentClaims />} />
            <Route path="transaction-files/policies" element={<TransactionFilesPolicies />} />
            <Route path="transaction-files" element={<Navigate to="/agent/transaction-files/policy-transactions/policy-transaction" replace />} />
            <Route path="agent-files" element={<AgentFiles />} />
            <Route path="posta-branches" element={<PostaBranches />} />
            <Route path="file-management/certificates" element={<Navigate to="/agent/transaction-files/certificates/issue" replace />} />
            <Route path="file-management/certificates/issue" element={<CertificateIssue />} />
            <Route path="file-management/certificates/declaration" element={<CertificateDeclaration />} />
            <Route path="file-management/certificates/status" element={<CertificateStatus />} />
            <Route path="transaction-files/certificates" element={<Navigate to="/agent/transaction-files/certificates/issue" replace />} />
            <Route path="transaction-files/certificates/issue" element={<CertificateIssue />} />
            <Route path="transaction-files/certificates/declaration" element={<CertificateDeclaration />} />
            <Route path="transaction-files/certificates/status" element={<CertificateStatus />} />
          </Route>
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header onOpenQuote={toggleQuoteModal} onOpenMessage={() => openMessageModal()} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onOpenQuote={toggleQuoteModal} onOpenMessage={openMessageModal} />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/products" element={<Products onOpenQuote={toggleQuoteModal} />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/policies" element={<Policies onOpenQuote={toggleQuoteModal} />} />
          <Route path="/policies/:policyTitle" element={<PolicyDetail onOpenQuote={toggleQuoteModal} />} />
          <Route path="/companies/product/:productId" element={<Companies />} />
          <Route path="/companies/:companyId/product/:productId" element={<ProductDetail onOpenQuote={toggleQuoteModal} />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:blogId" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/products/:productId" element={<ProductDetail onOpenQuote={toggleQuoteModal} />} />
          <Route path="/global-partnerships" element={<GlobalPartnerships />} />
          <Route path="/global-peace-advocates" element={<GlobalPeaceAdvocates />} />
          <Route path="/international-family-pageant" element={<InternationalFamilyPageant />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/pay/:token" element={<SecurePayment />} />
          <Route path="/template/:pageName" element={<TemplatePage />} />
          <Route path="*" element={<TemplatePage />} />
        </Routes>
      </main>
      {!['/login', '/register'].includes(location.pathname) && (
        <Footer onOpenMessage={() => openMessageModal()} onOpenQuote={toggleQuoteModal} onOpenComplaint={toggleComplaintModal} />
      )}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} preSelectedProduct={preSelectedProduct} />
      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        recipientEmail={activeEmail}
      />
      <ComplaintModal
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
