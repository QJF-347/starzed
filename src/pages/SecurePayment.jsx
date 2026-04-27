import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, Phone, User, Car, Heart, CheckCircle, Clock, AlertCircle, ArrowLeft, Loader2, Building, FileText } from 'lucide-react';
import './SecurePayment.css';

const normalizeCategory = (cat) => {
  if (!cat) return '';
  const c = cat.toLowerCase();
  if (c.includes('motor') || c.includes('vehicle') || c.includes('car')) return 'motor';
  if (c.includes('medical') || c.includes('health') || c.includes('accidental')) return 'medical';
  if (c.includes('building') || c.includes('property') || c.includes('non-motor')) return 'buildings';
  return c;
};

const SecurePayment = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [transactionId, setTransactionId] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [productData, setProductData] = useState(null);
  const [linkExpiryTime, setLinkExpiryTime] = useState(null);
  const [validatingLink, setValidatingLink] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [receiptId, setReceiptId] = useState(null);

  useEffect(() => {
    if (!token) {
      setPaymentStatus('invalid');
      setValidatingLink(false);
      return;
    }
    validatePaymentLink();
  }, [token]);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    if (linkExpiryTime && paymentStatus === 'valid') {
      const updateCountdown = () => {
        const now = new Date();
        const expiry = new Date(linkExpiryTime);
        const diff = expiry - now;
        if (diff <= 0) {
          setPaymentStatus('expired');
          setCountdown(0);
        } else {
          setCountdown(Math.floor(diff / 1000));
        }
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [linkExpiryTime, paymentStatus]);

  const validatePaymentLink = async () => {
    try {
      const response = await fetch(`/api/payments/validate-link/${token}/`);
      const data = await response.json();

      if (data.success && data.valid) {
        setProductData(data.productData);
        setLinkExpiryTime(data.expiryTime);
        setCompanyInfo(data.companyInfo || null);
        setPaymentStatus('valid');
      } else {
        setPaymentStatus(data.expired ? 'expired' : 'invalid');
      }
    } catch (error) {
      console.error('Link validation error:', error);
      setPaymentStatus('invalid');
    } finally {
      setValidatingLink(false);
    }
  };

  const validatePhoneNumber = (phone) => {
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
    setCountdown(180);

    try {
      const paymentData = {
        phoneNumber,
        amount: productData.productPrice,
        productName: productData.productName,
        paymentLinkToken: token,
        customerDetails: productData.customerDetails || {},
        policyDetails: productData.policyDetails || {},
      };

      const response = await fetch('/api/payments/initiate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.success) {
        setTransactionId(data.transactionId);
        toast.success('M-Pesa prompt sent! Please check your phone and enter your PIN to complete payment.');
        checkPaymentStatus(data.transactionId);
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setPaymentStatus('valid');
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (transactionId) => {
    const maxAttempts = 36;
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
          // Try to fetch receipt
          fetch(`/api/payments/receipt/by-transaction/${transactionId}/`)
            .then(r => r.json())
            .then(receiptData => {
              if (receiptData.success) {
                setReceiptId(receiptData.receiptId);
              }
            }).catch(() => {});
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
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(price);
  };

  const getProductIcon = () => {
    if (!productData) return Shield;
    const type = normalizeCategory(productData.productType);
    if (type === 'motor') return Car;
    if (type === 'medical') return Heart;
    if (type === 'buildings') return Building;
    return Shield;
  };

  const renderPolicyDetails = () => {
    if (!productData?.policyDetails) return null;

    const type = normalizeCategory(productData.productType);
    const pd = productData.policyDetails;

    if (type === 'motor' || (pd.vehicleMake || pd.registrationNumber)) {
      return (
        <div className="policy-details motor">
          <h3><Car size={16} /> Vehicle Details</h3>
          <div className="detail-grid">
            {pd.vehicleMake && <div><span>Make:</span> {pd.vehicleMake}</div>}
            {pd.vehicleModel && <div><span>Model:</span> {pd.vehicleModel}</div>}
            {pd.vehicleYear && <div><span>Year:</span> {pd.vehicleYear}</div>}
            {pd.registrationNumber && <div><span>Reg No:</span> {pd.registrationNumber}</div>}
            {pd.vehicleValue && <div><span>Value:</span> {pd.vehicleValue}</div>}
            {pd.vehicleColor && <div><span>Color:</span> {pd.vehicleColor}</div>}
            {pd.vehicleChassis && <div><span>Chassis No:</span> {pd.vehicleChassis}</div>}
          </div>
        </div>
      );
    }

    if (type === 'medical' || (pd.coverType || pd.personName)) {
      return (
        <div className="policy-details medical">
          <h3><Heart size={16} /> Person Insured Details</h3>
          <div className="detail-grid">
            {pd.personName && <div><span>Full Name:</span> {pd.personName}</div>}
            {pd.personAge && <div><span>Age:</span> {pd.personAge}</div>}
            {pd.personSex && <div><span>Sex:</span> {pd.personSex}</div>}
            {pd.coverType && <div><span>Cover Type:</span> {pd.coverType}</div>}
            {pd.coverLimit && <div><span>Cover Limit:</span> {pd.coverLimit}</div>}
            {pd.beneficiaryName && <div><span>Beneficiary:</span> {pd.beneficiaryName}</div>}
            {pd.preExistingConditions && <div><span>Pre-existing Conditions:</span> {pd.preExistingConditions}</div>}
          </div>
        </div>
      );
    }

    if (type === 'buildings' || (pd.buildingType || pd.buildingLocation)) {
      return (
        <div className="policy-details buildings">
          <h3><Building size={16} /> Building/Property Details</h3>
          <div className="detail-grid">
            {pd.buildingType && <div><span>Building Type:</span> {pd.buildingType}</div>}
            {pd.buildingLocation && <div><span>Location:</span> {pd.buildingLocation}</div>}
            {pd.buildingValue && <div><span>Property Value:</span> {pd.buildingValue}</div>}
            {pd.buildingYear && <div><span>Year Built:</span> {pd.buildingYear}</div>}
            {pd.buildingFloors && <div><span>Floors:</span> {pd.buildingFloors}</div>}
            {pd.buildingConstruction && <div><span>Construction:</span> {pd.buildingConstruction}</div>}
            {pd.buildingOccupancy && <div><span>Occupancy:</span> {pd.buildingOccupancy}</div>}
          </div>
        </div>
      );
    }

    return null;
  };

  // Loading state
  if (validatingLink) {
    return (
      <div className="payment-page">
        <div className="loading-state">
          <Loader2 className="spin" size={32} />
          <p>Validating payment link...</p>
        </div>
      </div>
    );
  }

  // Invalid link
  if (paymentStatus === 'invalid') {
    return (
      <div className="payment-page">
        <div className="status-card error">
          <div className="status-icon error">
            <AlertCircle size={32} />
          </div>
          <h2>Invalid Payment Link</h2>
          <p>This payment link is not valid or has been corrupted. Please contact your insurance agent for a new payment link.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Homepage</button>
        </div>
      </div>
    );
  }

  // Expired link
  if (paymentStatus === 'expired') {
    return (
      <div className="payment-page">
        <div className="status-card warning">
          <div className="status-icon warning">
            <Clock size={32} />
          </div>
          <h2>Payment Link Expired</h2>
          <p>This payment link has expired. Please contact your insurance agent for a new payment link.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Homepage</button>
        </div>
      </div>
    );
  }

  // Loading product data
  if (!productData) {
    return (
      <div className="payment-page">
        <div className="loading-state">
          <Loader2 className="spin" size={32} />
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  const ProductIcon = getProductIcon();

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Back
          </button>
          <div className="header-content">
            <div>
              <h1>Secure Payment</h1>
              <p className="subtitle">Complete your insurance payment securely with M-Pesa</p>
            </div>
            {linkExpiryTime && (
              <div className="expiry-badge">
                <Clock size={16} />
                <span>{formatTime(countdown)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="payment-grid">
          {/* Order Summary */}
          <div className="card">
            <h2><Shield size={20} /> Order Summary</h2>
            <div className="order-summary">
              <div className="product-info">
                <div className="product-icon">
                  <ProductIcon size={24} />
                </div>
                <div>
                  <h3>{productData.productName}</h3>
                  <p className="product-desc">{productData.productDescription}</p>
                  <span className={`product-type-badge ${normalizeCategory(productData.productType)}`}>
                    {normalizeCategory(productData.productType) === 'motor' ? 'Motor Insurance' : normalizeCategory(productData.productType) === 'medical' ? 'Medical Insurance' : normalizeCategory(productData.productType) === 'buildings' ? 'Property Insurance' : 'Insurance'}
                  </span>
                </div>
              </div>

              <div className="customer-info">
                <h4><User size={14} /> Customer Information</h4>
                <div className="info-row">
                  <span>Name:</span>
                  <span>{productData.customerDetails?.name || 'N/A'}</span>
                </div>
                {productData.customerDetails?.email && (
                  <div className="info-row">
                    <span>Email:</span>
                    <span>{productData.customerDetails.email}</span>
                  </div>
                )}
                {productData.customerDetails?.idNumber && (
                  <div className="info-row">
                    <span>ID Number:</span>
                    <span>{productData.customerDetails.idNumber}</span>
                  </div>
                )}
              </div>

              {renderPolicyDetails()}

              <div className="price-summary">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(productData.productPrice)}</span>
                </div>
                <div className="price-row">
                  <span>Processing Fee</span>
                  <span>Free</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span>{formatPrice(productData.productPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card">
            <h2>Payment Details</h2>

            {paymentStatus === 'valid' && (
              <form onSubmit={handlePayment} className="payment-form">
                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="mpesa-option">
                    <div className="mpesa-logo">M</div>
                    <div>
                      <div className="mpesa-label">M-Pesa</div>
                      <div className="mpesa-sub">Pay via M-Pesa to Buy Goods Till 143457</div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">M-Pesa Phone Number</label>
                  <div className="phone-input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="07XXXXXXXX or 01XXXXXXXX"
                      required
                    />
                  </div>
                  <p className="help-text">
                    Enter the M-Pesa registered phone number. You will receive a payment prompt on this number.
                  </p>
                </div>

                <button type="submit" disabled={isProcessing} className="btn btn-pay">
                  <Phone size={18} />
                  {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
              </form>
            )}

            {paymentStatus === 'processing' && (
              <div className="payment-state processing-state">
                <div className="state-icon processing">
                  <Loader2 className="spin" size={32} />
                </div>
                <h3>Payment Processing</h3>
                <p>M-Pesa prompt sent to <strong>{phoneNumber}</strong></p>
                <p className="state-hint">Please check your phone and enter your M-Pesa PIN to complete payment.</p>
                <div className="txn-info">
                  <div className="txn-row">
                    <span>Transaction ID:</span>
                    <span className="txn-value">{transactionId}</span>
                  </div>
                  <div className="txn-row">
                    <span>Time remaining:</span>
                    <span className="txn-value countdown">{formatTime(countdown)}</span>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="payment-state success-state">
                <div className="state-icon success">
                  <CheckCircle size={32} />
                </div>
                <h3>Payment Successful!</h3>
                <p>Your insurance payment has been processed successfully.</p>
                <div className="txn-info">
                  <div className="txn-row">
                    <span>Transaction ID:</span>
                    <span className="txn-value">{transactionId}</span>
                  </div>
                  <div className="txn-row">
                    <span>Amount Paid:</span>
                    <span className="txn-value">{formatPrice(productData.productPrice)}</span>
                  </div>
                </div>
                <div className="success-actions">
                  {receiptId && (
                    <a
                      href={`/api/payments/receipt/${receiptId}/download/`}
                      className="btn btn-receipt"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText size={18} /> Download Receipt
                    </a>
                  )}
                  <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Return to Homepage
                  </button>
                </div>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="payment-state failed-state">
                <div className="state-icon failed">
                  <AlertCircle size={32} />
                </div>
                <h3>Payment Failed</h3>
                <p>We could not process your payment. Please try again.</p>
                <button
                  className="btn btn-pay"
                  onClick={() => {
                    setPaymentStatus('valid');
                    setIsProcessing(false);
                    setCountdown(0);
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Security Note */}
            <div className="security-note">
              <Shield size={18} />
              <div>
                <strong>Secure Payment</strong>
                <p>This is a secure payment link provided by your insurance agent. Your payment information is encrypted and processed securely via M-Pesa.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePayment;
