FROM python:3.9-slim

WORKDIR /app

# RUN apt-get update && apt-get install -y \
# netcat \ &&
# pip install --no-cache-dir -r req.txt
COPY req.txt req.txt
RUN apt-get update && apt-get install -y \
    && pip install --upgrade pip && \
    pip install -r req.txt

COPY . .

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
