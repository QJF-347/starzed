#!/usr/bin/env python3
"""
Payment backend for M-Pesa integration
"""
import os
import sys
import json
import requests
import time
import uuid
import base64
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from functools import wraps

app = Flask(__name__)
CORS(app)

# Database setup
def get_db_connection():
    conn = sqlite3.connect('payments.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create payments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT UNIQUE NOT NULL,
            phone_number TEXT NOT NULL,
            amount REAL NOT NULL,
            product_name TEXT NOT NULL,
            product_type TEXT NOT NULL,
            policy_details TEXT,
            customer_details TEXT,
            status TEXT DEFAULT 'pending',
            mpesa_receipt_number TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# M-Pesa Configuration (using environment variables)
MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY', 'YOUR_CONSUMER_KEY')
MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET', 'YOUR_CONSUMER_SECRET')
MPESA_PASSKEY = os.getenv('MPESA_PASSKEY', 'YOUR_PASSKEY')
MPESA_SHORTCODE = os.getenv('MPESA_SHORTCODE', '174379')
MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL', 'https://your-domain.com/api/payments/callback/')
MPESA_ENVIRONMENT = os.getenv('MPESA_ENVIRONMENT', 'sandbox')  # sandbox or production

# M-Pesa API URLs
MPESA_BASE_URL = {
    'sandbox': 'https://sandbox.safaricom.co.ke',
    'production': 'https://api.safaricom.co.ke'
}

def get_mpesa_token():
    """Get M-Pesa OAuth token"""
    try:
        api_url = f"{MPESA_BASE_URL[MPESA_ENVIRONMENT]}/oauth/v1/generate?grant_type=client_credentials"
        
        response = requests.get(
            api_url,
            auth=(MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            return response.json().get('access_token')
        else:
            print(f"Error getting M-Pesa token: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Exception getting M-Pesa token: {str(e)}")
        return None

def initiate_stk_push(phone_number, amount, account_reference, transaction_desc):
    """Initiate M-Pesa STK push"""
    try:
        token = get_mpesa_token()
        if not token:
            return {'success': False, 'message': 'Failed to get M-Pesa token'}
        
        # Format phone number (remove leading 0 and add 254)
        if phone_number.startswith('0'):
            phone_number = '254' + phone_number[1:]
        
        # Generate timestamp and password
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_str = f"{MPESA_SHORTCODE}{MPESA_PASSKEY}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode()
        
        api_url = f"{MPESA_BASE_URL[MPESA_ENVIRONMENT]}/mpesa/stkpush/v1/processrequest"
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'BusinessShortCode': MPESA_SHORTCODE,
            'Password': password,
            'Timestamp': timestamp,
            'TransactionType': 'CustomerPayBillOnline',
            'Amount': int(amount),
            'PartyA': phone_number,
            'PartyB': MPESA_SHORTCODE,
            'PhoneNumber': phone_number,
            'CallBackURL': MPESA_CALLBACK_URL,
            'AccountReference': account_reference,
            'TransactionDesc': transaction_desc
        }
        
        response = requests.post(api_url, json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ResponseCode') == '0':
                return {
                    'success': True,
                    'merchant_request_id': data.get('MerchantRequestID'),
                    'checkout_request_id': data.get('CheckoutRequestID'),
                    'customer_message': data.get('CustomerMessage')
                }
            else:
                return {'success': False, 'message': data.get('errorMessage', 'STK push failed')}
        else:
            return {'success': False, 'message': f'HTTP {response.status_code}: {response.text}'}
            
    except Exception as e:
        print(f"Exception initiating STK push: {str(e)}")
        return {'success': False, 'message': f'STK push error: {str(e)}'}

# Payment endpoints
@app.route('/api/payments/initiate/', methods=['POST'])
def initiate_payment():
    """Initiate a new payment"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['phoneNumber', 'amount', 'productName', 'productType']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Missing field: {field}'}), 400
        
        # Generate transaction ID
        transaction_id = str(uuid.uuid4())
        
        # Save payment to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO payments 
            (transaction_id, phone_number, amount, product_name, product_type, policy_details, customer_details)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            transaction_id,
            data['phoneNumber'],
            data['amount'],
            data['productName'],
            data['productType'],
            json.dumps(data.get('policyDetails', {})),
            json.dumps(data.get('customerDetails', {}))
        ))
        
        conn.commit()
        conn.close()
        
        # For development/testing, simulate successful payment initiation
        if MPESA_ENVIRONMENT == 'sandbox' or MPESA_CONSUMER_KEY == 'YOUR_CONSUMER_KEY':
            # Simulate M-Pesa STK push (for testing)
            print(f"Simulated M-Pesa STK push to {data['phoneNumber']} for KES {data['amount']}")
            
            return jsonify({
                'success': True,
                'transactionId': transaction_id,
                'message': 'M-Pesa prompt sent (simulated for testing)'
            })
        else:
            # Real M-Pesa integration
            stk_result = initiate_stk_push(
                data['phoneNumber'],
                data['amount'],
                f"STARZED-{transaction_id[:8]}",
                f"Payment for {data['productName']}"
            )
            
            if stk_result['success']:
                return jsonify({
                    'success': True,
                    'transactionId': transaction_id,
                    'message': stk_result.get('customer_message', 'M-Pesa prompt sent')
                })
            else:
                # Update payment status to failed
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute('UPDATE payments SET status = ? WHERE transaction_id = ?', 
                             ('failed', transaction_id))
                conn.commit()
                conn.close()
                
                return jsonify({'success': False, 'message': stk_result['message']}), 400
    
    except Exception as e:
        print(f"Payment initiation error: {str(e)}")
        return jsonify({'success': False, 'message': 'Payment initiation failed'}), 500

@app.route('/api/payments/status/<transaction_id>/', methods=['GET'])
def check_payment_status(transaction_id):
    """Check payment status"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM payments WHERE transaction_id = ?', (transaction_id,))
        payment = cursor.fetchone()
        
        conn.close()
        
        if not payment:
            return jsonify({'success': False, 'message': 'Transaction not found'}), 404
        
        return jsonify({
            'success': True,
            'status': payment['status'],
            'mpesa_receipt_number': payment['mpesa_receipt_number'],
            'created_at': payment['created_at']
        })
    
    except Exception as e:
        print(f"Status check error: {str(e)}")
        return jsonify({'success': False, 'message': 'Status check failed'}), 500

@app.route('/api/payments/callback/', methods=['POST'])
def mpesa_callback():
    """M-Pesa callback endpoint"""
    try:
        data = request.get_json()
        
        # Extract callback data
        result_code = data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
        checkout_request_id = data.get('Body', {}).get('stkCallback', {}).get('CheckoutRequestID')
        callback_metadata = data.get('Body', {}).get('stkCallback', {}).get('CallbackMetadata', {})
        
        # Find payment by checkout request ID (you'd need to store this during initiation)
        # For now, we'll use a simplified approach
        
        status = 'completed' if result_code == '0' else 'failed'
        mpesa_receipt = None
        
        if status == 'completed' and callback_metadata.get('Item'):
            for item in callback_metadata['Item']:
                if item.get('Name') == 'MpesaReceiptNumber':
                    mpesa_receipt = item.get('Value')
                    break
        
        # Update payment status
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE payments 
            SET status = ?, mpesa_receipt_number = ?, updated_at = CURRENT_TIMESTAMP
            WHERE transaction_id = ?
        ''', (status, mpesa_receipt, checkout_request_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'ResultCode': 0, 'ResultDesc': 'Success'})
    
    except Exception as e:
        print(f"Callback error: {str(e)}")
        return jsonify({'ResultCode': 1, 'ResultDesc': 'Failed'}), 500

@app.route('/api/payments/', methods=['GET'])
def list_payments():
    """List all payments (admin endpoint)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM payments ORDER BY created_at DESC')
        payments = cursor.fetchall()
        
        conn.close()
        
        payments_list = []
        for payment in payments:
            payments_list.append({
                'id': payment['id'],
                'transaction_id': payment['transaction_id'],
                'phone_number': payment['phone_number'],
                'amount': payment['amount'],
                'product_name': payment['product_name'],
                'product_type': payment['product_type'],
                'status': payment['status'],
                'mpesa_receipt_number': payment['mpesa_receipt_number'],
                'created_at': payment['created_at']
            })
        
        return jsonify({'success': True, 'payments': payments_list})
    
    except Exception as e:
        print(f"List payments error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to list payments'}), 500

# Health check
@app.route('/api/payments/health/')
def payments_health():
    return jsonify({'status': 'OK', 'message': 'Payment service is running'})

if __name__ == '__main__':
    port = int(os.environ.get('PAYMENT_PORT', 8001))
    print(f"Starting payment service on port {port}...")
    print(f"M-Pesa Environment: {MPESA_ENVIRONMENT}")
    app.run(host='0.0.0.0', port=port, debug=False)
