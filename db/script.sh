echo "Starting PostgreSQL service..."
service postgresql start &

# Wait for PostgreSQL to start (can be adjusted based on system)
sleep 5

# Create the database and user
echo "Creating database and user..."
psql -U postgres -c "CREATE DATABASE $DB_NAME;"
# psql -U postgres -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"

# Grant all privileges on the database to the user
# echo "Granting privileges to user..."
# psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Create a superuser (optional)
echo "Creating superuser..."
psql -U postgres -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD' SUPERUSER;"

# Grant all privileges on the database to the superuser (optional)
echo "Granting privileges to superuser..."
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER ;"

# Confirm everything is set up
echo "Database and user setup complete!"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Superuser: $SUPERUSER"

# Keep the PostgreSQL service running in the background
tail -f /dev/null