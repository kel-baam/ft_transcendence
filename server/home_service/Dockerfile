FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install -r req.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
