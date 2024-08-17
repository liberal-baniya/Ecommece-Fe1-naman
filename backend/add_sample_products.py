import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ecommerce.settings")
django.setup()

from storeAPI.models import Product

sample_products_json = [
    {
        "name": "Product 1",
        "slug": "product-1",
        "image": "products/product1.jpg",
        "brand": "Brand A",
        "shipping": "Free Shipping",
        "description": "This is a description for Product 1.",
        "price": "49.99",
        "category_id": 1,
        "featured": True,
        "active": True,
        "created": "2023-04-22T10:00:00Z",
        "modified": "2023-04-22T10:00:00Z"
    },
    {
        "name": "Product 2",
        "slug": "product-2",
        "image": "products/product2.jpg",
        "brand": "Brand B",
        "shipping": "Standard Shipping",
        "description": "This is a description for Product 2.",
        "price": "29.99",
        "category_id": 2,
        "featured": False,
        "active": True,
        "created": "2023-04-21T15:00:00Z",
        "modified": "2023-04-21T15:00:00Z"
    },
    {
        "name": "Product 3",
        "slug": "product-3",
        "image": "products/product3.jpg",
        "brand": "Brand C",
        "shipping": "Free Shipping",
        "description": "This is a description for Product 3.",
        "price": "19.99",
        "category_id": 1,
        "featured": True,
        "active": False,
        "created": "2023-04-20T18:00:00Z",
        "modified": "2023-04-20T18:00:00Z"
    }
]

for product_data in sample_products_json:
    Product.objects.create(**product_data)

print("Sample products added successfully!")
