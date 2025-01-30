sleep 10
python manage.py makemigrations
python manage.py migrate
# python manage.py runserver 0.0.0.0:8001
daphne -b 0.0.0.0 -p 8001 project.asgi:application
