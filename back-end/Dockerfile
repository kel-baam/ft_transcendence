# Use an official Python image as the base
FROM python:3.12-slim

# Set environment variables to prevent Python from writing .pyc files and to flush output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies for PostgreSQL and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt to the working directory
COPY requirements.txt .

# Install dependencies in the virtual environment
RUN apt-get update && apt-get install -y build-essential libpq-dev && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of your application code to the container
COPY . .

# Copy wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expose the desired port (replace with your app's port if needed)
EXPOSE 8000

# Automatically create the superuser (username and password passed as environment variables)
ENV DJANGO_SUPERUSER_USERNAME=niboukha
ENV DJANGO_SUPERUSER_EMAIL=ni@gmail.com
ENV DJANGO_SUPERUSER_PASSWORD=1234

# Use a single CMD to wait for the db, run migrations, and then start daphne or Django runserver
CMD ["./wait-for-it.sh", "db", "--", "sh", "-c", \
    "python manage.py migrate && \
    python manage.py shell -c \"from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists() or User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')\" && \
    daphne -b 0.0.0.0 -p 8000 transcendence.asgi:application"]
