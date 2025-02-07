sed -i "s|DOMAIN: .*|DOMAIN: \"$DOMAIN\",|" /usr/share/nginx/html/src/index.js
nginx -g "daemon off;"