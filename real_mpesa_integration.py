#!/usr/bin/env python3
"""
Real M-Pesa STK Push Integration
This would require actual M-Pesa API credentials from Safaricom
"""

import requests
import base64
from datetime import datetime
import hashlib

class MpesaSTK:
    def __init__(self, consumer_key, consumer_secret, passkey, shortcode, environment='sandbox'):
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.passkey = passkey
        self.shortcode = shortcode
        self.environment = environment
        
        if environment == 'sandbox':
            self.base_url = 'https://sandbox.safaricom.co.ke'
        else:
            self.base_url = 'https://api.safaricom.co.ke'
            
        self.access_token = None
        
    def get_access_token(self):
        """Get OAuth access token from M-Pesa"""
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        
        # Create basic auth header
        auth_string = f"{self.consumer_key}:{self.consumer_secret}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes)
        
        headers = {
            'Authorization': f'Basic {auth_b64.decode("ascii")}'
        }
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                self.access_token = response.json()['access_token']
                return self.access_token
            else:
                print(f"Failed to get access token: {response.status_code}")
                return None
        except Exception as e:
            print(f"Error getting access token: {e}")
            return None
    
    def initiate_stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """Initiate real STK push to M-Pesa"""
        
        if not self.access_token:
            if not self.get_access_token():
                return None
        
        # Format phone number (remove leading 0 and add 254)
        if phone_number.startswith('0'):
            phone_number = '254' + phone_number[1:]
        
        # Generate password
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_string = f"{self.shortcode}{self.passkey}{timestamp}"
        password = base64.b64encode(password_string.encode()).decode()
        
        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'BusinessShortCode': self.shortcode,
            'Password': password,
            'Timestamp': timestamp,
            'TransactionType': 'CustomerPayBillOnline',
            'Amount': amount,
            'PartyA': phone_number,
            'PartyB': self.shortcode,
            'PhoneNumber': phone_number,
            'CallBackURL': 'http://your-domain.com/api/mpesa/callback',
            'AccountReference': account_reference,
            'TransactionDesc': transaction_desc
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"STK Push failed: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error initiating STK push: {e}")
            return None

def test_real_mpesa():
    """Test real M-Pesa integration (requires actual credentials)"""
    
    print("🔐 Real M-Pesa STK Push Test")
    print("=" * 50)
    
    # These would be your actual M-Pesa credentials from Safaricom
    # NOTE: These are placeholder values - you need real ones from Safaricom
    
    consumer_key = "YOUR_CONSUMER_KEY"
    consumer_secret = "YOUR_CONSUMER_SECRET"
    passkey = "YOUR_PASSKEY"
    shortcode = "174379"  # Sandbox shortcode
    
    print("⚠️  This requires real M-Pesa API credentials!")
    print("📋 To get real credentials:")
    print("   1. Visit https://developer.safaricom.co.ke")
    print("   2. Create an account and get API credentials")
    print("   3. Replace the placeholder values above")
    print()
    
    # Check if credentials are set
    if "YOUR_" in consumer_key:
        print("❌ Please configure actual M-Pesa credentials first!")
        print("💡 Without real credentials, only test mode is available")
        return
    
    mpesa = MpesaSTK(consumer_key, consumer_secret, passkey, shortcode)
    
    print(f"📱 Initiating real STK push to 0797465163...")
    print(f"💰 Amount: KES 10")
    
    result = mpesa.initiate_stk_push(
        phone_number="0797465163",
        amount=10,
        account_reference="TEST123",
        transaction_desc="Real STK Test"
    )
    
    if result:
        print("✅ STK push initiated!")
        print(f"📋 Response: {result}")
        
        if result.get('ResponseCode') == '0':
            print("🎉 Check your phone for the M-Pesa prompt!")
            checkout_request_id = result.get('CheckoutRequestID')
            print(f"🔗 Checkout Request ID: {checkout_request_id}")
        else:
            print(f"❌ STK push failed: {result.get('ResponseDescription')}")
    else:
        print("❌ Failed to initiate STK push")

if __name__ == "__main__":
    test_real_mpesa()
