# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file with your settings
# Copy the .env example above and update values

# 4. Run migrations
python manage.py makemigrations
python manage.py migrate

# 5. Create superuser
python manage.py createsuperuserpython manage.py createsuperuser

# 6. Load initial data (optional)
python manage.py shell
# Then run the commands below to create sample categories

# 7. Start development server
python manage.py runserver

# 8. Access API documentation
# http://localhost:8000/api/docs/

# 9. Access admin panel
# http://localhost:8000/admin/