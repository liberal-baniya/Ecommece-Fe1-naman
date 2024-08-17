from rest_framework import serializers
from .models import Cart, Rating, Product, Order


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["id", "rate", "count"]


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cart
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)  # Nested serializer for Product

    class Meta:
        model = Order
        fields = ["id", "products", "created_at", "updated_at", "status", "subtotal"]
