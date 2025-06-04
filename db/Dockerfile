FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y wget gnupg2 lsb-release ca-certificates sudo

RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update && apt-get install -y postgresql-13 postgresql-client-13


RUN mkdir -p /var/lib/postgresql/13/main && chown -R postgres:postgres /var/lib/postgresql/13

COPY ./script.sh /usr/bin

RUN sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '0.0.0.0'/" /etc/postgresql/13/main/postgresql.conf

RUN sed -i "s/ssl = on/ssl = off/" /etc/postgresql/13/main/postgresql.conf

COPY ./pg_hba.conf /etc/postgresql/13/main/pg_hba.conf


RUN chown -R postgres:postgres /var/lib/postgresql/13/main
RUN chmod 0700 /var/lib/postgresql/13/main

RUN chmod 777 /usr/bin/script.sh

CMD [ "sh", "/usr/bin/script.sh" ]
