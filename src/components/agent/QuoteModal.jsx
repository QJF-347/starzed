import React, { useState } from 'react';
import { X, Calculator, Users, Car, Heart, Briefcase, Home, Shield, DollarSign, FileText, Send } from 'lucide-react';
import './QuoteModal.css';

const QuoteModal = ({ isOpen, onClose, product, client }) => {
  const [formData, setFormData] = useState({
    clientName: client?.name || '',
    clientEmail: client?.email || '',
    clientPhone: client?.phone || '',
    policyType: product?.category || 'Motor Insurance',
    coverageAmount: '',
    deductible: '',
    termLength: '12',
    additionalCoverage: [],
    specialRequirements: '',
    paymentMethod: 'annual'
  });

  const [calculatedQuote, setCalculatedQuote] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const policyTypes = [
    { id: 'motor', name: 'Motor Insurance', icon: Car, baseRate: 0.03 },
    { id: 'health', name: 'Health Insurance', icon: Heart, baseRate: 0.025 },
    { id: 'life', name: 'Life Insurance', icon: Shield, baseRate: 0.015 },
    { id: 'business', name: 'Business Insurance', icon: Briefcase, baseRate: 0.02 },
    { id: 'home', name: 'Home Insurance', icon: Home, baseRate: 0.018 }
  ];

  const coverageOptions = [
    { id: 'comprehensive', name: 'Comprehensive Coverage', premium: 1.5 },
    { id: 'third_party', name: 'Third Party Only', premium: 0.6 },
    { id: 'fire_theft', name: 'Fire & Theft', premium: 0.8 },
    { id: 'personal_accident', name: 'Personal Accident', premium: 0.3 }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        additionalCoverage: checked 
          ? [...prev.additionalCoverage, value]
          : prev.additionalCoverage.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateQuote = async () => {
    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      const policyType = policyTypes.find(p => p.name === formData.policyType);
      const basePremium = formData.coverageAmount * policyType.baseRate;
      
      let additionalPremium = 0;
      formData.additionalCoverage.forEach(coverage => {
        const option = coverageOptions.find(o => o.id === coverage);
        if (option) {
          additionalPremium += basePremium * (option.premium - 1);
        }
      });

      const termMultiplier = formData.termLength === '6' ? 0.55 : 1;
      const paymentMultiplier = formData.paymentMethod === 'monthly' ? 1.1 : 1;
      
      const totalPremium = (basePremium + additionalPremium) * termMultiplier * paymentMultiplier;
      
      setCalculatedQuote({
        basePremium: basePremium.toFixed(2),
        additionalPremium: additionalPremium.toFixed(2),
        totalPremium: totalPremium.toFixed(2),
        monthlyPayment: (totalPremium / parseInt(formData.termLength)).toFixed(2),
        breakdown: {
          coverage: formData.coverageAmount,
          deductible: formData.deductible || '0',
          term: formData.termLength,
          paymentFrequency: formData.paymentMethod
        }
      });
      
      setIsCalculating(false);
    }, 1500);
  };

  const handleSubmitQuote = () => {
    // Handle quote submission
    console.log('Quote submitted:', { ...formData, ...calculatedQuote });
    alert('Quote sent to client successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="quote-modal-overlay">
      <div className="quote-modal">
        <div className="quote-modal-header">
          <div className="quote-modal-title">
            <Calculator className="quote-modal-icon" />
            <h2>Generate Insurance Quote</h2>
          </div>
          <button onClick={onClose} className="quote-modal-close">
            <X />
          </button>
        </div>

        <div className="quote-modal-content">
          <div className="quote-modal-grid">
            {/* Client Information */}
            <div className="quote-modal-section">
              <h3 className="quote-modal-section-title">
                <Users className="quote-modal-section-icon" />
                Client Information
              </h3>
              <div className="quote-modal-form-grid">
                <div className="quote-modal-form-group">
                  <label>Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="quote-modal-input"
                  />
                </div>
                <div className="quote-modal-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className="quote-modal-input"
                  />
                </div>
                <div className="quote-modal-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    className="quote-modal-input"
                  />
                </div>
              </div>
            </div>

            {/* Policy Details */}
            <div className="quote-modal-section">
              <h3 className="quote-modal-section-title">
                <FileText className="quote-modal-section-icon" />
                Policy Details
              </h3>
              <div className="quote-modal-form-grid">
                <div className="quote-modal-form-group">
                  <label>Policy Type</label>
                  <select
                    name="policyType"
                    value={formData.policyType}
                    onChange={handleInputChange}
                    className="quote-modal-select"
                  >
                    {policyTypes.map(type => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="quote-modal-form-group">
                  <label>Coverage Amount (KES)</label>
                  <input
                    type="number"
                    name="coverageAmount"
                    value={formData.coverageAmount}
                    onChange={handleInputChange}
                    placeholder="e.g., 1000000"
                    className="quote-modal-input"
                  />
                </div>
                <div className="quote-modal-form-group">
                  <label>Deductible (KES)</label>
                  <input
                    type="number"
                    name="deductible"
                    value={formData.deductible}
                    onChange={handleInputChange}
                    placeholder="e.g., 10000"
                    className="quote-modal-input"
                  />
                </div>
                <div className="quote-modal-form-group">
                  <label>Policy Term</label>
                  <select
                    name="termLength"
                    value={formData.termLength}
                    onChange={handleInputChange}
                    className="quote-modal-select"
                  >
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
                <div className="quote-modal-form-group">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="quote-modal-select"
                  >
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Coverage */}
            <div className="quote-modal-section">
              <h3 className="quote-modal-section-title">
                <Shield className="quote-modal-section-icon" />
                Additional Coverage Options
              </h3>
              <div className="quote-modal-checkbox-grid">
                {coverageOptions.map(option => (
                  <label key={option.id} className="quote-modal-checkbox-label">
                    <input
                      type="checkbox"
                      name="additionalCoverage"
                      value={option.id}
                      checked={formData.additionalCoverage.includes(option.id)}
                      onChange={handleInputChange}
                      className="quote-modal-checkbox"
                    />
                    <span>{option.name}</span>
                    <span className="quote-modal-checkbox-note">+{((option.premium - 1) * 100).toFixed(0)}% premium</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Requirements */}
            <div className="quote-modal-section">
              <h3 className="quote-modal-section-title">
                <FileText className="quote-modal-section-icon" />
                Special Requirements
              </h3>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                placeholder="Any special requirements or notes..."
                className="quote-modal-textarea"
                rows="3"
              />
            </div>
          </div>

          {/* Quote Calculation Result */}
          {calculatedQuote && (
            <div className="quote-modal-result">
              <h3 className="quote-modal-result-title">
                <DollarSign className="quote-modal-result-icon" />
                Quote Calculation
              </h3>
              <div className="quote-modal-result-grid">
                <div className="quote-modal-result-item">
                  <span className="quote-modal-result-label">Base Premium</span>
                  <span className="quote-modal-result-value">KES {calculatedQuote.basePremium}</span>
                </div>
                <div className="quote-modal-result-item">
                  <span className="quote-modal-result-label">Additional Coverage</span>
                  <span className="quote-modal-result-value">KES {calculatedQuote.additionalPremium}</span>
                </div>
                <div className="quote-modal-result-item highlight">
                  <span className="quote-modal-result-label">Total Premium</span>
                  <span className="quote-modal-result-value">KES {calculatedQuote.totalPremium}</span>
                </div>
                {formData.paymentMethod === 'monthly' && (
                  <div className="quote-modal-result-item">
                    <span className="quote-modal-result-label">Monthly Payment</span>
                    <span className="quote-modal-result-value">KES {calculatedQuote.monthlyPayment}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="quote-modal-footer">
          <button onClick={onClose} className="quote-modal-btn secondary">
            Cancel
          </button>
          {!calculatedQuote ? (
            <button 
              onClick={calculateQuote} 
              disabled={isCalculating || !formData.coverageAmount}
              className="quote-modal-btn primary"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Quote'}
            </button>
          ) : (
            <button onClick={handleSubmitQuote} className="quote-modal-btn primary">
              <Send className="quote-modal-btn-icon" />
              Send Quote to Client
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
