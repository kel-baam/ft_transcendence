# # FROM postgres:13
# FROM node:18-bullseye

# # Install wget and gnupg to fetch the PostgreSQL repository key
# RUN apt-get update && apt-get install -y wget gnupg && apt-get install -y sudo

# # Add PostgreSQL APT repository key
# RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -


# # Add PostgreSQL APT repository for PostgreSQL 13 (Updated URL)
# RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# # Update the package list and install PostgreSQL 13 and the client
# RUN apt-get update && apt-get install -y postgresql-13 postgresql-client-13

# # Copy your setup script to the container
# COPY ./script.sh /usr/bin

# # Update PostgreSQL configuration for listening on all addresses
# RUN sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '0.0.0.0'/" /etc/postgresql/13/main/postgresql.conf

# # Disable SSL in PostgreSQL
# RUN sed -i "s/ssl = on/ssl = off/" /etc/postgresql/13/main/postgresql.conf

# # Copy your pg_hba.conf configuration
# COPY ./pg_hba.conf /etc/postgresql/13/main/pg_hba.conf

# # Change permissions on the script
# RUN chmod 777 /usr/bin/script.sh

# # Run the script when the container starts
# CMD [ "sh", "/usr/bin/script.sh" ]



# FROM node:18-bullseye

# # Install wget, gnupg, and sudo to fetch the PostgreSQL repository key
# RUN apt-get update && apt-get install -y wget gnupg && apt-get install -y sudo

# # Add PostgreSQL APT repository key
# RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

# # Add PostgreSQL APT repository for PostgreSQL 13
# RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# # Update the package list and install PostgreSQL 13 and the client
# RUN apt-get update && apt-get install -y postgresql-13 postgresql-client-13

# # Copy your setup script to the container
# COPY ./script.sh /usr/bin

# # Update PostgreSQL configuration for listening on all addresses
# RUN sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '0.0.0.0'/" /etc/postgresql/13/main/postgresql.conf

# # Disable SSL in PostgreSQL
# RUN sed -i "s/ssl = on/ssl = off/" /etc/postgresql/13/main/postgresql.conf

# # Copy your pg_hba.conf configuration
# COPY ./pg_hba.conf /etc/postgresql/13/main/pg_hba.conf

# # Change permissions on the script
# RUN chmod 777 /usr/bin/script.sh

# # Run the script when the container starts
# CMD [ "sh", "/usr/bin/script.sh" ]



FROM ubuntu:20.04

# Set non-interactive frontend to avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install wget, gnupg, sudo, and dependencies for PostgreSQL
RUN apt-get update && apt-get install -y wget gnupg2 lsb-release ca-certificates sudo

# Add PostgreSQL APT repository key
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

# Add PostgreSQL APT repository for PostgreSQL 13 (Ubuntu 20.04)
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Update the package list and install PostgreSQL 13 and the client
RUN apt-get update && apt-get install -y postgresql-13 postgresql-client-13

# RUN mkdir -p /var/lib/postgresql/13/main && chown -R postgres:postgres /var/lib/postgresql/13/main

# Ensure proper ownership of PostgreSQL data directory
RUN mkdir -p /var/lib/postgresql/13/main && chown -R postgres:postgres /var/lib/postgresql/13

# Initialize the PostgreSQL database cluster
# RUN su - postgres -c "/usr/lib/postgresql/13/bin/initdb -D /var/lib/postgresql/13/main"
# RUN chown -R postgres:postgres /var/lib/postgresql/13/main/ 
# Copy your setup script to the container
COPY ./script.sh /usr/bin

# Update PostgreSQL configuration for listening on all addresses
RUN sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '0.0.0.0'/" /etc/postgresql/13/main/postgresql.conf

# Disable SSL in PostgreSQL
RUN sed -i "s/ssl = on/ssl = off/" /etc/postgresql/13/main/postgresql.conf

# Copy your pg_hba.conf configuration
COPY ./pg_hba.conf /etc/postgresql/13/main/pg_hba.conf


# Change permissions on the script
RUN chmod 777 /usr/bin/script.sh

# Run the script when the container starts
CMD [ "sh", "/usr/bin/script.sh" ]
