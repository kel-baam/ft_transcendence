
FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY . /usr/share/nginx/html/

RUN  mkdir -p /etc/nginx/ssl
COPY ./script.sh /usr/bin/script.sh
RUN chmod +x /usr/bin/script.sh
CMD [ "sh", "/usr/bin/script.sh" ]

