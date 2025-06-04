echo "Starting PostgreSQL service..."
service postgresql start &

sleep 5

echo "Creating database and user..."
psql -U postgres -c "CREATE DATABASE $DB_NAME;"

echo "Creating superuser..."
psql -U postgres -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD' SUPERUSER;"

echo "Granting privileges to superuser..."
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER ;"

echo "Database and user setup complete!"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Superuser: $SUPERUSER"

tail -f /dev/null