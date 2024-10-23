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
# RUN pip install --upgrade pip && pip install -r requirements.txt --verbose
RUN apt-get update && apt-get install -y build-essential libpq-dev && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of your application code to the container
COPY . .

# Expose the desired port (replace with your app's port if needed)
EXPOSE 8000

# Command to run your application with Daphne
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "transcendence.asgi:application"]
