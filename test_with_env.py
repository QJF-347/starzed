#!/usr/bin/env python3
"""
Test script that loads .env file and tests M-Pesa integration
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_credentials():
    """Test M-Pesa credentials after loading .env"""
    
    print("🔍 Loading .env and checking M-Pesa Credentials...")
    print("=" * 60)
    
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
    
    # Check if we have all required credentials
    has_credentials = bool(MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET)
    has_passkey = bool(MPESA_PASSKEY and MPESA_PASSKEY != 'N/A')
    
    print()
    if has_credentials and has_passkey:
        print("✅ All M-Pesa credentials are configured!")
        return True
    elif has_credentials:
        print("⚠️  Credentials found but passkey is missing")
        print("💡 You need to get a real passkey from Safaricom developer portal")
        return False
    else:
        print("❌ M-Pesa credentials not found in .env file")
        return False

if __name__ == "__main__":
    test_credentials()
