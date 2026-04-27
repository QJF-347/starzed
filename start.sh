#!/bin/bash

echo "Starting Django application..."

# Change to the src directory
cd src

# Set environment variables
export DJANGO_SETTINGS_MODULE=starzed_backend.settings_production
export PYTHONPATH=/opt/render/project/src:$PYTHONPATH

# Wait for database to be ready
echo "Waiting for database..."
python manage.py dbshell --command="SELECT 1;" > /dev/null 2>&1
while [ $? -ne 0 ]; do
    echo "Database not ready, waiting..."
    sleep 2
    python manage.py dbshell --command="SELECT 1;" > /dev/null 2>&1
done

echo "Database ready!"

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the application
echo "Starting gunicorn..."
exec gunicorn starzed_backend.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --timeout 120 --max-requests 1000 --max-requests-jitter 100
