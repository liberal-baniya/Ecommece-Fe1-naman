import uuid
from rest_framework import generics
from .models import Order, Product
from .serializers import CartSerializer, ProductSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, Product
from decimal import Decimal
from bson.decimal128 import Decimal128

users = []


class RegisterUserView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data
            user_data["user_id"] = str(uuid.uuid4())  # Ensure unique UUID for each user
            users.append(user_data)
            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        for user in users:
            if user["email"] == email and user["password"] == password:
                return Response(
                    {"message": "Login successful!"}, status=status.HTTP_200_OK
                )

        return Response(
            {"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST
        )


class CartView(APIView):
    def get(self, request, *args, **kwargs):
        product_id = request.query_params.get("product_id")
        quantity = int(request.query_params.get("quantity", 1))

        if not product_id:
            return Response(
                {"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )

        cart_item, created = Cart.objects.get_or_create(product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response(
            {
                "message": "Product added to cart",
                "cart_item": {"product": product.name, "quantity": cart_item.quantity},
            },
            status=status.HTTP_200_OK,
        )


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class SearchView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        query = self.request.query_params.get("q", "")
        return (
            Product.objects.filter(name__icontains=query)
            if query
            else Product.objects.all()
        )


class MyCartView(generics.ListAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer


class CheckoutView(APIView):
    def get(self, request, *args, **kwargs):
        cart_items = Cart.objects.all()
        if not cart_items:
            return Response(
                {"error": "No items in cart"}, status=status.HTTP_400_BAD_REQUEST
            )

        subtotal = Decimal("0.00")
        for item in cart_items:
            if isinstance(item.product.price, Decimal128):
                price = Decimal(item.product.price.to_decimal())
            else:
                price = Decimal(item.product.price)
            subtotal += price * item.quantity

        # Create the Order with the calculated subtotal
        order = Order.objects.create(status="pending", subtotal=subtotal)
        order.products.set([item.product for item in cart_items])
        order.save()

        # Optionally clear the cart after checkout
        cart_items.delete()

        return Response(
            {"message": "Checkout successful", "order_id": order.id},
            status=status.HTTP_200_OK,
        )
