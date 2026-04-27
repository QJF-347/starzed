#!/usr/bin/env python3
"""
Simple STK Push Test Script
Tests M-Pesa STK push functionality with the backend API
"""

import requests
import json
import time
from datetime import datetime

def test_stk_push():
    """Test STK push to phone number 0797465163"""
    
    # API endpoint
    url = "http://localhost:8000/api/payments/initiate/"
    
    # Test payment data
    payment_data = {
        "phone_number": "0797465163",
        "amount": 10,  # Small amount for testing
        "account_reference": "TEST123",
        "transaction_desc": "Test STK Push",
        "callback_url": "http://localhost:8000/api/mpesa/callback"
    }
    
    print("🚀 Starting STK Push Test...")
    print(f"📱 Phone Number: 0797465163")
    print(f"💰 Amount: KES 10")
    print(f"🕐 Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    try:
        # Make the STK push request
        print("📡 Sending STK push request...")
        response = requests.post(url, json=payment_data)
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📄 Response Headers: {dict(response.headers)}")
        
        # Parse response
        if response.headers.get('content-type', '').startswith('application/json'):
            response_data = response.json()
            print(f"📋 Response Data: {json.dumps(response_data, indent=2)}")
            
            if response_data.get('success'):
                print("✅ STK push initiated successfully!")
                transaction_id = response_data.get('transactionId')
                print(f"🔗 Transaction ID: {transaction_id}")
                
                # Check payment status after a delay
                print("\n⏳ Waiting for payment status...")
                time.sleep(5)
                
                status_url = f"http://localhost:8000/api/payments/status/{transaction_id}/"
                status_response = requests.get(status_url)
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    print(f"📊 Payment Status: {json.dumps(status_data, indent=2)}")
                    
                    if status_data.get('status') == 'completed':
                        print("✅ Payment completed successfully!")
                    elif status_data.get('status') == 'pending':
                        print("⏳ Payment is still pending...")
                    else:
                        print("❌ Payment failed or was cancelled")
                else:
                    print(f"❌ Failed to check payment status: {status_response.status_code}")
            else:
                print("❌ STK push failed!")
                print(f"Error: {response_data.get('message', 'Unknown error')}")
        else:
            print(f"❌ Unexpected response format: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Could not connect to the backend server")
        print("💡 Make sure the backend is running on http://localhost:8000")
    except requests.exceptions.Timeout:
        print("❌ Timeout Error: Request took too long")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request Error: {e}")
    except json.JSONDecodeError:
        print("❌ JSON Decode Error: Invalid response format")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
    
    print("\n🏁 STK Push Test Complete")

if __name__ == "__main__":
    test_stk_push()
