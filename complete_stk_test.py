#!/usr/bin/env python3
"""
Complete STK Push Test with Callback Simulation
Tests the full M-Pesa STK push flow including payment completion
"""

import requests
import json
import time
from datetime import datetime

def test_complete_stk_flow():
    """Test complete STK flow with callback simulation"""
    
    print("🚀 Starting Complete STK Flow Test...")
    print(f"📱 Phone Number: 0797465163")
    print(f"💰 Amount: KES 10")
    print(f"🕐 Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Step 1: Initiate STK Push
    print("\n📡 Step 1: Initiating STK Push...")
    initiate_url = "http://localhost:8000/api/payments/initiate/"
    
    payment_data = {
        "phone_number": "0797465163",
        "amount": 10,
        "account_reference": "TEST123",
        "transaction_desc": "Complete STK Test",
        "callback_url": "http://localhost:8000/api/mpesa/callback"
    }
    
    try:
        response = requests.post(initiate_url, json=payment_data)
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"✅ STK Push Initiated!")
            print(f"🔗 Transaction ID: {response_data.get('transactionId')}")
            print(f"📱 Message: {response_data.get('message')}")
            
            transaction_id = response_data.get('transactionId')
            
            # Step 2: Simulate successful payment callback
            print("\n📱 Step 2: Simulating Successful Payment Callback...")
            callback_url = "http://localhost:8000/api/mpesa/callback"
            
            callback_data = {
                "Body": {
                    "stkCallback": {
                        "MerchantRequestID": f"test-merchant-{int(time.time())}",
                        "CheckoutRequestID": f"test-checkout-{int(time.time())}",
                        "ResultCode": 0,
                        "ResultDesc": "The service request is processed successfully.",
                        "CallbackMetadata": {
                            "Item": [
                                {"Name": "Amount", "Value": 10},
                                {"Name": "MpesaReceiptNumber", "Value": "LGR777TEST"},
                                {"Name": "TransactionDate", "Value": "20240427093600"},
                                {"Name": "PhoneNumber", "Value": "+254797465163"}
                            ]
                        }
                    }
                }
            }
            
            callback_response = requests.post(callback_url, json=callback_data)
            
            if callback_response.status_code == 200:
                print("✅ Callback processed successfully!")
                callback_result = callback_response.json()
                print(f"📋 Callback Result: {callback_result.get('ResultDesc')}")
                
                # Step 3: Check final payment status
                print("\n📊 Step 3: Checking Final Payment Status...")
                time.sleep(2)  # Brief delay to allow processing
                
                status_url = f"http://localhost:8000/api/payments/status/{transaction_id}/"
                status_response = requests.get(status_url)
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    print(f"📈 Final Status: {status_data.get('status')}")
                    
                    if status_data.get('status') == 'completed':
                        print("✅ Payment completed successfully!")
                        print(f"🧾 M-Pesa Receipt: {status_data.get('mpesa_receipt_number')}")
                    else:
                        print(f"⏳ Payment status: {status_data.get('status')}")
                else:
                    print(f"❌ Failed to check status: {status_response.status_code}")
            else:
                print(f"❌ Callback failed: {callback_response.status_code}")
                print(f"Response: {callback_response.text}")
        else:
            print(f"❌ STK Push failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n🏁 Complete STK Flow Test Finished")
    print("=" * 60)

if __name__ == "__main__":
    test_complete_stk_flow()
