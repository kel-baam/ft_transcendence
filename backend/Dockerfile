# Use a Docker image that has Docker installed
FROM docker:latest

# Install Python and other dependencies
RUN apk add --no-cache python3 py3-pip libpq gcc

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create a working directory
WORKDIR /usr/src/app

# Copy requirements file and install dependencies
COPY requirements.txt /usr/src/app/
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

# Copy the rest of your application code
COPY . /usr/src/app/

# Expose the desired port
EXPOSE 8000

# Command to run your application with Daphne
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "myproject.asgi:application"]
