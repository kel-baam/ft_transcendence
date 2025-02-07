FROM python:3.9-slim

WORKDIR /app

# COPY requirements.txt requirements.txt

COPY . .
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install -r /app/requirements.txt


COPY ./script.sh /usr/bin
RUN chmod +x /usr/bin/script.sh

CMD ["sh", "/usr/bin/script.sh"]
