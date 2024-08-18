import uuid
from rest_framework import generics, status, exceptions
from .models import Category, Order, OrderItem, Product, Review
from .serializers import (
    CartSerializer,
    CategorySerializer,
    OrderItemSerializer,
    ProductSerializer,
    ReviewSerializer,
    UserSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, Product
from decimal import Decimal
from bson.decimal128 import Decimal128
from rest_framework.pagination import PageNumberPagination
from decimal import Decimal, InvalidOperation


from bson.regex import Regex
from djongo.models import Q


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


class CreateProductView(APIView):
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # pagination_class = None
    pagination_class = PageNumberPagination


class CreateCategoryView(APIView):
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListCategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SearchView(generics.ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination  # This enables pagination

    def get_queryset(self):
        query = self.request.query_params.get("q", "")
        return (
            Product.objects.filter(name__icontains=query)
            if query
            else Product.objects.all()
        )


# class ProductFilterView(generics.ListAPIView):
#     serializer_class = ProductSerializer

#     def get_queryset(self):
#         queryset = Product.objects.all()
#         category_id = self.request.query_params.get("category")
#         brand = self.request.query_params.get("brand")
#         active = self.request.query_params.get("active")
#         min_price = self.request.query_params.get("min_price")
#         max_price = self.request.query_params.get("max_price")

#         if category_id:
#             queryset = queryset.filter(category_id=category_id)
#         if brand:
#             queryset = queryset.filter(brand__iexact=brand)
#         if active is not None:
#             # Convert the string to a Python boolean
#             if active.lower() == "true":
#                 active = True
#             elif active.lower() == "false":
#                 active = False
#             else:
#                 raise exceptions.ValidationError(
#                     "The 'active' parameter must be 'true' or 'false'."
#                 )

#             queryset = queryset.filter(active=active)

#         if min_price:
#             try:
#                 # Convert min_price to Decimal and then to BSON Decimal128
#                 min_price_decimal = Decimal128(Decimal(min_price))
#                 queryset = queryset.filter(price__gte=min_price_decimal)
#             except (InvalidOperation, ValueError):
#                 raise exceptions.ValidationError(
#                     "min_price must be a valid decimal number."
#                 )
#         if max_price:
#             try:
#                 # Convert max_price to Decimal and then to BSON Decimal128
#                 max_price_decimal = Decimal128(Decimal(max_price))
#                 queryset = queryset.filter(price__lte=max_price_decimal)
#             except (InvalidOperation, ValueError):
#                 raise exceptions.ValidationError(
#                     "max_price must be a valid decimal number."
#                 )

#         return queryset

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)
#         response_data = {
#             "status": "success",
#             "count": queryset.count(),
#             "results": serializer.data,
#         }
#         return Response(response_data, status=status.HTTP_200_OK)


class ProductFilterView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        keyword = self.request.query_params.get("keyword", None)
        price = self.request.query_params.get("price", None)

        # Start with all products
        queryset = Product.objects.all()

        if price:
            try:
                # Convert price to Decimal for proper comparison
                print("price before conversion:", type(price))  # str type
                price = Decimal(price)
                print("price after 1st conversion:", type(price))  # Decimal type

                # No need to convert to Decimal128; Djongo should handle this
                queryset = queryset.filter(price__gt=price)
            except (ValueError, InvalidOperation):
                raise ValueError("The price parameter must be a valid decimal number.")

        if keyword:
            # Use Q objects to filter based on 'name' or 'description'
            queryset = queryset.filter(
                Q(name__icontains=keyword) | Q(description__icontains=keyword)
            )

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {
            "status": "success",
            "count": queryset.count(),
            "results": serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


# class ProductFilterView(generics.ListAPIView):
#     serializer_class = ProductSerializer

#     def get_queryset(self):
#         keyword = self.request.query_params.get("keyword", None)
#         price = self.request.query_params.get("price", None)

#         # Start with all products
#         queryset = Product.objects.all()

#         if keyword:
#             # Use Q objects to filter based on 'name' or 'description'
#             queryset = queryset.filter(
#                 Q(price__gt=price) & Q(name__icontains=keyword)
#                 | Q(description__icontains=keyword)
#             )

#         return queryset

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)
#         response_data = {
#             "status": "success",
#             "count": queryset.count(),
#             "results": serializer.data,
#         }
#         return Response(response_data, status=status.HTTP_200_OK)


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


class ProductReviewsView(APIView):
    def get(self, request, product_id):
        try:
            reviews = Review.objects.filter(product_id=product_id, active=True)
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response(
                {"error": "Product not found or no reviews available"},
                status=status.HTTP_404_NOT_FOUND,
            )


class OrderItemsView(APIView):
    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            order_items = OrderItem.objects.filter(order=order)
            serializer = OrderItemSerializer(order_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )
