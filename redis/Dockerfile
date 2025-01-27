# Use the official Redis image from Docker Hub
# FROM redis:latest

# Expose the default Redis port
# EXPOSE 6379

# Optional: Add a custom configuration file if needed
# COPY redis.conf /usr/local/etc/redis/redis.conf

# Optional: Use a custom configuration file when starting Redis
# CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
FROM debian:buster

RUN apt-get update && \
    apt-get install -y redis-server && \
    rm -rf /var/lib/apt/lists/*
RUN echo "maxmemory-policy allkeys-lru" >> /etc/redis/redis.conf

RUN sed -i -r "s/bind 127.0.0.1/#bind 127.0.0.0/" /etc/redis/redis.conf

RUN sed -i -r "s/port 6379/port 6378/" /etc/redis/redis.conf

# RUN sed -i 's/^bind 127.0.0.1 ::1/# bind 127.0.0.1 ::1/' /etc/redis/redis.conf && \
#     sed -i 's/^protected-mode yes/protected-mode no/' /etc/redis/redis.conf
RUN sed -i -r "s/protected-mode yes/protected-mode no/" /etc/redis/redis.conf

# CMD ["redis-server"]
CMD ["redis-server"]
