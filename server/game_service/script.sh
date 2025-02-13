sleep 10
echo "Starting migration process..."

# Step 1: Generate migrations (if there are any changes in models)
python manage.py makemigrations --noinput 


# Step 2: Apply migrations and handle the 'DuplicateTable' error
echo "Applying migrations..."
if python manage.py showmigrations | grep '\[ \]'; then
    # Migrations are pending, so we apply them
    echo "Migrations are required, applying them..."
    python manage.py migrate --noinput || {
        echo "Migrations failed due to DuplicateTable error. Running fake migration..."
        python manage.py migrate --fake --noinput  # Fake the migration if DuplicateTable occurs
    }
else
    echo "Migrations already applied, skipping..."
fi

# Check if 'Badge' data exists and load it if not

daphne -b 0.0.0.0 -p 8002 pingpong_game.asgi:application