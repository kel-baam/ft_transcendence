
FROM nginx:latest

# Copy your custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

COPY . /usr/share/nginx/html/

COPY ./script.sh /usr/bin/script.sh
RUN chmod +x /usr/bin/script.sh &&\
    mkdir -p /etc/nginx/ssl
# ENTRYPOINT ["/script.sh"]
CMD [ "sh", "/usr/bin/script.sh" ]
# Disable Nginx daemon mode and run it in the foreground
# CMD ["nginx", "-g", "daemon off;"]
