FROM nginx:alpine

# Copy your custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the contents of the assets directory to the NGINX html folder
COPY . /usr/share/nginx/html/
