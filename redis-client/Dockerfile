# Use the official Redis image as the base
FROM redis:latest

# Set the working directory
WORKDIR /usr/src/app

# Optional: Install any additional utilities (e.g., curl, wget)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Entry point for redis-cli
ENTRYPOINT ["redis-cli"]
