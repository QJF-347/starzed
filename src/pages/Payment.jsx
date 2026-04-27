import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, Phone, User, Car, Heart, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [transactionId, setTransactionId] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  // Get product details from location state
  const { product, policyDetails, customerDetails } = location.state || {};

  useEffect(() => {
    if (!product) {
      toast.error('No product selected for payment');
      navigate('/products');
      return;
    }
  }, [product, navigate]);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const validatePhoneNumber = (phone) => {
    // Kenyan phone number validation (starts with 07 or 01 and is 10 digits)
    const phoneRegex = /^(07|01)\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid Kenyan phone number (07XXXXXXXX or 01XXXXXXXX)');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setCountdown(180); // 3 minutes countdown

    try {
      const paymentData = {
        phoneNumber,
        amount: product.price,
        productName: product.name,
        productType: product.type,
        policyDetails,
        customerDetails,
        paymentMethod: 'mpesa'
      };

      const response = await fetch('/api/payments/initiate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (data.success) {
        setTransactionId(data.transactionId);
        toast.success('M-Pesa prompt sent! Please check your phone and enter your PIN.');
        
        // Start checking payment status
        checkPaymentStatus(data.transactionId);
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setPaymentStatus('failed');
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (transactionId) => {
    const maxAttempts = 36; // Check for 3 minutes (every 5 seconds)
    let attempts = 0;

    const statusCheck = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(`/api/payments/status/${transactionId}/`);
        const data = await response.json();

        if (data.status === 'completed') {
          setPaymentStatus('success');
          setIsProcessing(false);
          toast.success('Payment completed successfully!');
          clearInterval(statusCheck);
        } else if (data.status === 'failed') {
          setPaymentStatus('failed');
          setIsProcessing(false);
          toast.error('Payment failed. Please try again.');
          clearInterval(statusCheck);
        } else if (attempts >= maxAttempts) {
          setPaymentStatus('failed');
          setIsProcessing(false);
          toast.error('Payment timeout. Please try again.');
          clearInterval(statusCheck);
        }
      } catch (error) {
        console.error('Status check error:', error);
        if (attempts >= maxAttempts) {
          setPaymentStatus('failed');
          setIsProcessing(false);
          clearInterval(statusCheck);
        }
      }
    }, 5000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPolicyDetails = () => {
    if (!policyDetails) return null;

    if (product.type === 'motor') {
      return (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Car className="w-4 h-4 mr-2" />
            Vehicle Details
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="font-medium">Make:</span> {policyDetails.vehicleMake}</div>
            <div><span className="font-medium">Model:</span> {policyDetails.vehicleModel}</div>
            <div><span className="font-medium">Year:</span> {policyDetails.vehicleYear}</div>
            <div><span className="font-medium">Registration:</span> {policyDetails.registrationNumber}</div>
          </div>
        </div>
      );
    }

    if (product.type === 'medical') {
      return (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            Cover Details
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="font-medium">Cover Type:</span> {policyDetails.coverType}</div>
            <div><span className="font-medium">Cover Limit:</span> {policyDetails.coverLimit}</div>
            <div><span className="font-medium">Beneficiary:</span> {policyDetails.beneficiaryName}</div>
            <div><span className="font-medium">ID Number:</span> {policyDetails.idNumber}</div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Secure payment powered by M-Pesa</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Order Summary
            </h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
              </div>

              {renderPolicyDetails()}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>KES {product.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Processing Fee</span>
                  <span>KES 0</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-blue-600">KES {product.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            
            {paymentStatus === 'pending' && (
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="flex items-center p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <div>
                      <div className="font-medium">M-Pesa</div>
                      <div className="text-sm text-gray-600">Pay with M-Pesa</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="07XXXXXXXX or 01XXXXXXXX"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the M-Pesa registered phone number
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
              </form>
            )}

            {paymentStatus === 'processing' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-yellow-600 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Payment Processing</h3>
                <p className="text-gray-600 mb-4">
                  M-Pesa prompt sent to {phoneNumber}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Please check your phone and enter your PIN
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Transaction ID: {transactionId}</p>
                  <p className="text-sm text-gray-600">Time remaining: {formatTime(countdown)}</p>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-600">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Your payment has been processed successfully
                </p>
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium">Transaction ID: {transactionId}</p>
                  <p className="text-sm text-gray-600">Amount: KES {product.price}</p>
                </div>
                <button
                  onClick={() => navigate('/policies')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View My Policies
                </button>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-red-600">Payment Failed</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't process your payment. Please try again.
                </p>
                <button
                  onClick={() => {
                    setPaymentStatus('pending');
                    setIsProcessing(false);
                    setCountdown(0);
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Security Note */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Secure Payment</p>
                  <p>Your payment information is encrypted and secure. We never store your M-Pesa PIN.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
