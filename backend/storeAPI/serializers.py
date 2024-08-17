from rest_framework import serializers
from .models import Rating, Product, Order



class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'rate', 'count']

class ProductSerializer(serializers.ModelSerializer):
    rating = RatingSerializer()  # Nested serializer for Rating

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'image', 'category', 'rating']

class OrderSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)  # Nested serializer for Product

    class Meta:
        model = Order
        fields = ['id', 'products', 'created_at', 'updated_at', 'status', 'subtotal']
