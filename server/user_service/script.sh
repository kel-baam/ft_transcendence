sleep 10
echo "Starting migration process..."

# Step 1: Generate migrations (if there are any changes in models)
python manage.py makemigrations

# Step 2: Apply migrations and handle the 'DuplicateTable' error
echo "Applying migrations..."
if python manage.py showmigrations | grep '\[ \]'; then
    # Migrations are pending, so we apply them
    echo "Migrations are required, applying them..."
    python manage.py migrate --noinput 2>/dev/null || {
    echo "Migrations failed due to DuplicateTable error. Running fake migration..."
    python manage.py migrate --fake --noinput 2>/dev/null  # Fake the migration if DuplicateTable occurs
}
else
    echo "Migrations already applied, skipping..."
fi
if [ "$(python manage.py shell -c 'from user_service.models import Badge; print(Badge.objects.exists())')" = "False" ]; then
    python manage.py loaddata badges.json
fi
# python manage.py makemigrations
# # python manage.py migrate --run-syncdb
# python manage.py migrate --noinput

# until python manage.py migrate --noinput --database=default; do
#   echo "Another container is running migrations. Waiting..."
#   sleep 5
# done
python manage.py runserver 0.0.0.0:8001