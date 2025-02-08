sleep 10
echo "---------------------------------------------------------------------------------------"
python manage.py makemigrations
python manage.py migrate
daphne -b 0.0.0.0 -p 8002 pingpong_game.asgi:application