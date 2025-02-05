sleep 10

if [ "$(python manage.py shell -c 'from user_service.models import Badge; print(Badge.objects.exists())')" = "False" ]; then
    python manage.py loaddata badges.json
fi
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8001