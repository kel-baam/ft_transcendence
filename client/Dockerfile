
FROM nginx:latest

# Copy your custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

COPY . /usr/share/nginx/html/


# Disable Nginx daemon mode and run it in the foreground
# CMD ["nginx", "-g", "daemon off;"]
