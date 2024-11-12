# Use an official Python image as the base
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 8000

ENV DJANGO_SUPERUSER_USERNAME=niboukha
ENV DJANGO_SUPERUSER_EMAIL=ni@gmail.com
ENV DJANGO_SUPERUSER_PASSWORD=1234
ENV DJANGO_SETTINGS_MODULE=transcendence.settings

CMD ["./wait-for-it.sh", "db", "--", "sh", "-c", \
    "pip install Pillow && python manage.py makemigrations && python manage.py migrate && \
    python manage.py shell -c \"from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists() or User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')\" && \
    daphne -b 0.0.0.0 -p 8000 transcendence.asgi:application"]
