#!/usr/bin/env python3
"""
Direct STK Test to check M-Pesa credentials and integration
"""

import os
import requests
import base64
from datetime import datetime

def test_mpesa_credentials():
    """Test if M-Pesa credentials are loaded correctly"""
    
    print("🔍 Checking M-Pesa Credentials...")
    print("=" * 50)
    
    # Load environment variables
    MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY', '')
    MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET', '')
    MPESA_PASSKEY = os.getenv('MPESA_PASSKEY', '')
    MPESA_SHORTCODE = os.getenv('MPESA_SHORTCODE', '174379')
    MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL', '')
    MPESA_ENVIRONMENT = os.getenv('MPESA_ENVIRONMENT', 'sandbox')
    
    print(f"📋 Consumer Key: {MPESA_CONSUMER_KEY[:20]}..." if MPESA_CONSUMER_KEY else "❌ Consumer Key: NOT FOUND")
    print(f"📋 Consumer Secret: {MPESA_CONSUMER_SECRET[:20]}..." if MPESA_CONSUMER_SECRET else "❌ Consumer Secret: NOT FOUND")
    print(f"🔑 Passkey: {MPESA_PASSKEY}" if MPESA_PASSKEY and MPESA_PASSKEY != 'N/A' else "❌ Passkey: NOT CONFIGURED")
    print(f"📞 Shortcode: {MPESA_SHORTCODE}")
    print(f"🔄 Callback URL: {MPESA_CALLBACK_URL}")
    print(f"🌍 Environment: {MPESA_ENVIRONMENT}")
    print()
    
    if not MPESA_CONSUMER_KEY or not MPESA_CONSUMER_SECRET:
        print("❌ M-Pesa credentials not found in environment variables")
        return False
    
    if not MPESA_PASSKEY or MPESA_PASSKEY == 'N/A':
        print("❌ M-Pesa passkey not configured")
        print("💡 You need to get a real passkey from Safaricom developer portal")
        return False
    
    return True

def test_access_token():
    """Test getting M-Pesa access token"""
    
    print("🔐 Testing M-Pesa Access Token...")
    print("=" * 50)
    
    MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY', '')
    MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET', '')
    MPESA_ENVIRONMENT = os.getenv('MPESA_ENVIRONMENT', 'sandbox')
    
    if MPESA_ENVIRONMENT == 'production':
        base_url = 'https://api.safaricom.co.ke'
    else:
        base_url = 'https://sandbox.safaricom.co.ke'
    
    try:
        url = f"{base_url}/oauth/v1/generate?grant_type=client_credentials"
        
        # Create basic auth header
        auth_string = f"{MPESA_CONSUMER_KEY}:{MPESA_CONSUMER_SECRET}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes)
        
        headers = {
            'Authorization': f'Basic {auth_b64.decode("ascii")}'
        }
        
        print(f"📡 Requesting access token from: {base_url}")
        response = requests.get(url, headers=headers, timeout=10)
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data['access_token']
            print(f"✅ Access token obtained successfully!")
            print(f"🔑 Token (first 20 chars): {access_token[:20]}...")
            return access_token
        else:
            print(f"❌ Failed to get access token: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error getting access token: {e}")
        return None

def test_stk_push(access_token):
    """Test actual STK push"""
    
    print("📱 Testing STK Push...")
    print("=" * 50)
    
    MPESA_PASSKEY = os.getenv('MPESA_PASSKEY', '')
    MPESA_SHORTCODE = os.getenv('MPESA_SHORTCODE', '174379')
    MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL', 'http://localhost:8000/api/mpesa/callback')
    MPESA_ENVIRONMENT = os.getenv('MPESA_ENVIRONMENT', 'sandbox')
    
    if MPESA_ENVIRONMENT == 'production':
        base_url = 'https://api.safaricom.co.ke'
    else:
        base_url = 'https://sandbox.safaricom.co.ke'
    
    try:
        phone_number = "0797465163"
        amount = 10
        
        # Format phone number
        if phone_number.startswith('0'):
            formatted_phone = '254' + phone_number[1:]
        
        # Generate password
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_string = f"{MPESA_SHORTCODE}{MPESA_PASSKEY}{timestamp}"
        password = base64.b64encode(password_string.encode()).decode()
        
        url = f"{base_url}/mpesa/stkpush/v1/processrequest"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'BusinessShortCode': MPESA_SHORTCODE,
            'Password': password,
            'Timestamp': timestamp,
            'TransactionType': 'CustomerPayBillOnline',
            'Amount': amount,
            'PartyA': formatted_phone,
            'PartyB': MPESA_SHORTCODE,
            'PhoneNumber': formatted_phone,
            'CallBackURL': MPESA_CALLBACK_URL,
            'AccountReference': 'TEST123',
            'TransactionDesc': 'Direct STK Test'
        }
        
        print(f"📡 Sending STK push to {formatted_phone}...")
        print(f"💰 Amount: KES {amount}")
        print(f"🔗 URL: {url}")
        
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('ResponseCode') == '0':
                print("🎉 SUCCESS! Check your phone for the M-Pesa prompt!")
                print(f"🔗 Checkout Request ID: {result.get('CheckoutRequestID')}")
                return True
            else:
                print(f"❌ STK push failed: {result.get('ResponseDescription')}")
                return False
        else:
            print(f"❌ HTTP error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error with STK push: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Direct M-Pesa STK Test")
    print("=" * 60)
    
    # Test 1: Check credentials
    if not test_mpesa_credentials():
        print("\n❌ Cannot proceed - credentials not configured")
        exit(1)
    
    print()
    
    # Test 2: Get access token
    access_token = test_access_token()
    if not access_token:
        print("\n❌ Cannot proceed - failed to get access token")
        exit(1)
    
    print()
    
    # Test 3: Send STK push
    success = test_stk_push(access_token)
    
    print()
    print("🏁 Direct STK Test Complete")
    print("=" * 60)
    
    if success:
        print("✅ SUCCESS! You should receive an M-Pesa prompt shortly!")
    else:
        print("❌ STK push failed - check the error messages above")
