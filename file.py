# Run this in Django shell: python manage.py shell
from inventory.models import Category, Product

# Create categories
categories_data = [
    {'name': 'Dairy', 'color': 'bg-blue-100 text-blue-800'},
    {'name': 'Produce', 'color': 'bg-green-100 text-green-800'},
    {'name': 'Beverages', 'color': 'bg-purple-100 text-purple-800'},
    {'name': 'Bakery', 'color': 'bg-yellow-100 text-yellow-800'},
    {'name': 'Meat', 'color': 'bg-red-100 text-red-800'},
]

for cat_data in categories_data:
    Category.objects.get_or_create(**cat_data)

print("Sample categories created!")