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
    && pip install --upgrade pip \
    && pip install -r req.txt


COPY . .

# CMD ["sh", "-c", "python manage.py makemigrations &&  python manage.py migrate --noinput 2>/dev/null;&& python manage.py runserver 0.0.0.0:8000"]


# CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate --noinput 2>/dev/null;&& daphne -b 0.0.0.0 -p 8000 auth.asgi:application"]
# daphne -b 0.0.0.0 -p 8000 transcendence.asgi:application

COPY ./script.sh /usr/bin
RUN chmod +x /usr/bin/script.sh

# Expose the desired port (replace with your app's port if needed)
# EXPOSE 8000

CMD ["sh", "/usr/bin/script.sh"]