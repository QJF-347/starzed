#!/usr/bin/env python3
"""
Simple Flask backend for production deployment
"""
import os
import json
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample data
SAMPLE_CLIENTS = [
    {
        "id": 1,
        "client_name": "John Doe",
        "business_name": "Individual",
        "id_number": "12345678",
        "mobile": "+254712345678",
        "kra_pin": "A123456789B",
        "email": "john.doe@example.com",
        "town": "Nairobi",
        "address": "123 Main St",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    },
    {
        "id": 2,
        "client_name": "Jane Smith",
        "business_name": "Jane Enterprises",
        "id_number": "87654321",
        "mobile": "+254798765432",
        "kra_pin": "B987654321A",
        "email": "jane@janeenterprises.com",
        "town": "Mombasa",
        "address": "456 Beach Rd",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z"
    }
]

@app.route('/')
def home():
    return jsonify({
        'status': 'OK',
        'message': 'Starzed Backend is running',
        'version': '1.0.0'
    })

@app.route('/api/health/')
def health():
    return jsonify({
        'status': 'OK',
        'message': 'Backend is healthy',
        'django_version': 'Flask',
        'settings_configured': True
    })

@app.route('/api/clients/', methods=['GET', 'POST'])
def clients():
    if request.method == 'GET':
        return jsonify({
            'success': True,
            'data': SAMPLE_CLIENTS
        })
    elif request.method == 'POST':
        # Simple echo response for POST requests
        data = request.get_json()
        return jsonify({
            'success': True,
            'message': 'Client created (mock response)',
            'data': data
        }), 201

@app.route('/api/clients/<int:client_id>', methods=['GET', 'PUT', 'DELETE'])
def client_detail(client_id):
    client = next((c for c in SAMPLE_CLIENTS if c['id'] == client_id), None)
    if not client:
        return jsonify({
            'success': False,
            'message': 'Client not found'
        }), 404
    
    if request.method == 'GET':
        return jsonify({
            'success': True,
            'data': client
        })
    elif request.method == 'PUT':
        data = request.get_json()
        client.update(data)
        return jsonify({
            'success': True,
            'message': 'Client updated (mock response)',
            'data': client
        })
    elif request.method == 'DELETE':
        return jsonify({
            'success': True,
            'message': 'Client deleted (mock response)'
        })

@app.route('/api/companies/', methods=['GET', 'POST'])
def companies():
    if request.method == 'GET':
        return jsonify({
            'success': True,
            'data': []
        })
    elif request.method == 'POST':
        data = request.get_json()
        return jsonify({
            'success': True,
            'message': 'Company created (mock response)',
            'data': data
        }), 201

@app.route('/api/policies/', methods=['GET', 'POST'])
def policies():
    if request.method == 'GET':
        return jsonify({
            'success': True,
            'data': []
        })
    elif request.method == 'POST':
        data = request.get_json()
        return jsonify({
            'success': True,
            'message': 'Policy created (mock response)',
            'data': data
        }), 201

# Frontend serving - serve React app
@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    # Try to serve from dist first (React build)
    if os.path.exists(os.path.join('dist', path)):
        return send_from_directory('dist', path)
    # For React Router, serve index.html for non-existent routes
    return send_from_directory('dist', 'index.html')

# Catch all other API routes
@app.route('/api/<path:path>')
def catch_all(path):
    return jsonify({
        'success': True,
        'message': f'Endpoint {path} not implemented yet',
        'data': []
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))  # Use Render's PORT
    print(f"Starting simple backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)

