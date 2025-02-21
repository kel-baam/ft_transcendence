#!/bin/bash
sleep 10
echo "---------------------------------------------------------------------------------------"
python manage.py makemigrations --noinput 2>/dev/null

# Step 2: Apply migrations and handle potential errors
echo "Checking for pending migrations..."
if python manage.py showmigrations | grep '\[ \]'; then
    echo "Pending migrations detected. Applying migrations..."
    if ! python manage.py migrate --noinput 2>/dev/null; then
        echo "Migration failed. Attempting to apply migrations with --fake..."
        python manage.py migrate --fake --noinput 2>/dev/null
    fi
else
    echo "No pending migrations. Skipping migration step."
fi

daphne -b 0.0.0.0 -p 8002 tournament.asgi:application