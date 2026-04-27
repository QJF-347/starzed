import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './MpesaTest.css';

const MpesaTest = () => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [callbackData, setCallbackData] = useState({
    amount: '1500',
    phoneNumber: '+254712345678',
    receiptNumber: 'LGR123TEST'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCallbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testSuccessfulCallback = async () => {
    try {
      setLoading(true);
      setTestResult(null);

      const response = await fetch('/api/mpesa/test-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(callbackData.amount),
          phoneNumber: callbackData.phoneNumber,
          receiptNumber: callbackData.receiptNumber
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setTestResult({
          success: true,
          message: 'Test callback processed successfully',
          data: data.callback_data
        });
        toast.success('M-Pesa callback test successful!');
      } else {
        setTestResult({
          success: false,
          message: data.message || 'Test callback failed'
        });
        toast.error('M-Pesa callback test failed!');
      }
    } catch (error) {
      console.error('Error testing M-Pesa callback:', error);
      setTestResult({
        success: false,
        message: `Error: ${error.message}`
      });
      toast.error('Error testing M-Pesa callback!');
    } finally {
      setLoading(false);
    }
  };

  const testFailedCallback = async () => {
    try {
      setLoading(true);
      setTestResult(null);

      const failedCallback = {
        "Body": {
          "stkCallback": {
            "MerchantRequestID": "test-merchant-" + Date.now(),
            "CheckoutRequestID": "test-checkout-" + Date.now(),
            "ResultCode": 1,
            "ResultDesc": "Insufficient funds",
            "CallbackMetadata": {
              "Item": []
            }
          }
        }
      };

      const response = await fetch('/api/mpesa/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(failedCallback),
      });

      const data = await response.json();
      
      setTestResult({
        success: true,
        message: 'Failed callback test processed',
        data: failedCallback,
        response: data
      });
      toast.info('Failed M-Pesa callback test completed!');
    } catch (error) {
      console.error('Error testing failed M-Pesa callback:', error);
      setTestResult({
        success: false,
        message: `Error: ${error.message}`
      });
      toast.error('Error testing failed M-Pesa callback!');
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setTestResult(null);
  };

  return (
    <div className="mpesa-test-container">
      {/* Header */}
      <div className="mpesa-test-header">
        <div className="mpesa-test-header-content">
          <div className="mpesa-test-header-left">
            <Link to="/agent" className="back-button">
              <ArrowLeft className="back-icon" />
              Back to Dashboard
            </Link>
            <h1 className="mpesa-test-title">M-Pesa Callback Test</h1>
            <p className="mpesa-test-subtitle">Test M-Pesa payment callback functionality</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mpesa-test-content">
        <div className="mpesa-test-card">
          <div className="mpesa-test-card-header">
            <h2>Callback Configuration</h2>
            <p>Configure and test M-Pesa callback endpoints</p>
          </div>

          <div className="mpesa-test-info">
            <div className="info-item">
              <strong>Callback URL:</strong>
              <code>http://127.0.0.1:8000/api/mpesa/callback</code>
            </div>
            <div className="info-item">
              <strong>Test URL:</strong>
              <code>http://127.0.0.1:8000/api/mpesa/test-callback</code>
            </div>
          </div>

          <div className="mpesa-test-form">
            <h3>Test Payment Details</h3>
            <div className="form-group">
              <label htmlFor="amount">Amount (KES)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={callbackData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={callbackData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+254712345678"
              />
            </div>
            <div className="form-group">
              <label htmlFor="receiptNumber">Receipt Number</label>
              <input
                type="text"
                id="receiptNumber"
                name="receiptNumber"
                value={callbackData.receiptNumber}
                onChange={handleInputChange}
                placeholder="LGR123ABC"
              />
            </div>
          </div>

          <div className="mpesa-test-actions">
            <button 
              className="mpesa-test-btn success" 
              onClick={testSuccessfulCallback}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="loading-icon" />
              ) : (
                <CheckCircle className="btn-icon" />
              )}
              Test Successful Callback
            </button>
            <button 
              className="mpesa-test-btn danger" 
              onClick={testFailedCallback}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="loading-icon" />
              ) : (
                <AlertCircle className="btn-icon" />
              )}
              Test Failed Callback
            </button>
          </div>

          {testResult && (
            <div className="mpesa-test-result">
              <div className="result-header">
                <h3>Test Result</h3>
                <button className="reset-btn" onClick={resetTest}>
                  Reset
                </button>
              </div>
              <div className={`result-content ${testResult.success ? 'success' : 'error'}`}>
                <div className="result-status">
                  {testResult.success ? (
                    <CheckCircle className="status-icon success" />
                  ) : (
                    <AlertCircle className="status-icon error" />
                  )}
                  <span>{testResult.message}</span>
                </div>
                {testResult.data && (
                  <div className="result-data">
                    <h4>Callback Data:</h4>
                    <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                  </div>
                )}
                {testResult.response && (
                  <div className="result-response">
                    <h4>Server Response:</h4>
                    <pre>{JSON.stringify(testResult.response, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mpesa-test-card">
          <div className="mpesa-test-card-header">
            <h2>M-Pesa Integration Guide</h2>
          </div>
          <div className="mpesa-test-guide">
            <h3>Setup Instructions</h3>
            <ol>
              <li>Configure your M-Pesa API credentials in the backend</li>
              <li>Set the callback URL to: <code>http://your-domain.com/api/mpesa/callback</code></li>
              <li>Test the callback using the form above</li>
              <li>Monitor server logs for callback processing</li>
            </ol>
            
            <h3>Callback Data Structure</h3>
            <p>M-Pesa sends payment confirmation data in the following structure:</p>
            <pre className="code-block">{`{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "...",
      "ResultCode": 0,
      "ResultDesc": "Success message",
      "CallbackMetadata": {
        "Item": [
          {"Name": "Amount", "Value": 1000},
          {"Name": "MpesaReceiptNumber", "Value": "LGR123ABC"},
          {"Name": "TransactionDate", "Value": "20240424120000"},
          {"Name": "PhoneNumber", "Value": "+254712345678"}
        ]
      }
    }
  }
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MpesaTest;
