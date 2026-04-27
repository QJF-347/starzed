import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const PaymentButton = ({ product, policyDetails, customerDetails, className = '' }) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    // Validate that we have the required data
    if (!product) {
      console.error('No product provided for payment');
      return;
    }

    // Navigate to payment page with all necessary data
    navigate('/payment', {
      state: {
        product,
        policyDetails,
        customerDetails
      }
    });
  };

  return (
    <button
      onClick={handlePayment}
      className={`flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors ${className}`}
    >
      <CreditCard className="w-4 h-4 mr-2" />
      Pay Now
    </button>
  );
};

export default PaymentButton;
