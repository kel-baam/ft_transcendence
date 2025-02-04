#!/bin/bash
sleep 10
echo "---------------------------------------------------------------------------------------"
python manage.py makemigrations
python manage.py migrate
daphne -b 0.0.0.0 -p 8003 project.asgi:application