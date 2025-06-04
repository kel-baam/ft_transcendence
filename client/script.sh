sed -i "s|IP: \".*\"|IP: \"$IP\"|" /usr/share/nginx/html/src/index.js
openssl req -x509 -nodes -days 365 -newkey rsa:2048  -out  $CERT -keyout $KEY -subj "/CN=$DOMAIN_NAME"
nginx -g "daemon off;"