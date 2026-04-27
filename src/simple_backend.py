#!/usr/bin/env python3
"""
Simple Flask backend for immediate deployment fix
"""
from flask import Flask, jsonify, request
import json
import os

app = Flask(__name__)

# Basic health check
@app.route('/')
def home():
    return jsonify({
        'status': 'OK',
        'message': 'Simple Flask Backend is running',
        'version': '1.0.0'
    })

@app.route('/api/health/')
def health():
    return jsonify({
        'status': 'OK',
        'message': 'Health check passed',
        'service': 'Simple Backend'
    })

# Mock clients endpoint
@app.route('/api/clients/', methods=['GET', 'POST'])
def clients():
    if request.method == 'GET':
        return jsonify({
            'success': True,
            'data': [
                {
                    'id': '1',
                    'client_name': 'John Doe',
                    'email': 'john@example.com',
                    'phone': '+1234567890',
                    'status': 'active'
                },
                {
                    'id': '2', 
                    'client_name': 'Jane Smith',
                    'email': 'jane@example.com',
                    'phone': '+0987654321',
                    'status': 'active'
                }
            ]
        })
    elif request.method == 'POST':
        data = request.get_json()
        return jsonify({
            'success': True,
            'data': {
                'id': '3',
                **data
            }
        })

# Mock policies endpoint
@app.route('/api/policies/', methods=['GET', 'POST'])
def policies():
    if request.method == 'GET':
        return jsonify({
            'success': True,
            'data': [
                {
                    'id': '1',
                    'title': 'Life Insurance',
                    'policy_type': 'Life',
                    'premium_amount': '100.00',
                    'status': 'active',
                    'icon': 'Heart'
                },
                {
                    'id': '2',
                    'title': 'Car Insurance', 
                    'policy_type': 'Auto',
                    'premium_amount': '200.00',
                    'status': 'active',
                    'icon': 'Car'
                }
            ]
        })
    elif request.method == 'POST':
        data = request.get_json()
        return jsonify({
            'success': True,
            'data': {
                'id': '3',
                **data
            }
        })

# Mock other endpoints
@app.route('/api/companies/', methods=['GET'])
def companies():
    return jsonify({'success': True, 'data': []})

@app.route('/api/quotes/', methods=['GET'])
def quotes():
    return jsonify({'success': True, 'data': []})

@app.route('/api/products/', methods=['GET'])
def products():
    return jsonify({'success': True, 'data': []})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
