FROM python:3.9-slim

WORKDIR /usr/src/app

# RUN apt-get update && apt-get install -y \
# netcat \ &&
# pip install --no-cache-dir -r req.txt
COPY req.txt req.txt
# RUN apt-get update && apt-get install -y  \
#     && pip install --upgrade pip && apt-get install gcc  libpq-dev&&\
#     pip install -r req.txt


RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    postgresql-client\
    && pip install --upgrade pip \
    && pip install -r req.txt


COPY . .

