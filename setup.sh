#!/bin/bash

# Starzed Django Backend - Production Setup Script

echo "Setting up Starzed Django Backend for Production..."
echo "=================================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your configuration before running the server."
    echo "Required settings:"
    echo "  - DATABASE_URL (PostgreSQL connection string)"
    echo "  - SECRET_KEY (Django secret key)"
    echo "  - EMAIL_HOST, EMAIL_USER, EMAIL_PASS (for email functionality)"
fi

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Create or update initial data
echo "Setting up initial data..."
python manage.py setup_initial_data

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check Django setup
echo "Checking Django configuration..."
python manage.py check

echo "=================================================="
echo "Setup completed successfully!"
echo ""
echo "To run the development server:"
echo "  source venv/bin/activate"
echo "  python manage.py runserver 0.0.0.0:8000"
echo ""
echo "To run in production (use gunicorn):"
echo "  pip install gunicorn"
echo "  gunicorn starzed_backend.wsgi:application --bind 0.0.0.0:8000"
echo ""
echo "API Documentation: http://localhost:8000/api/health/"
echo "Admin Panel: http://localhost:8000/admin/"
echo "Default admin: admin@starzed.com / admin123"
