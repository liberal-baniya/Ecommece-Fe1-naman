from django.urls import path
from .views import (
    CartView,
    CheckoutView,
    CreateCategoryView,
    CreateProductView,
    ListCategoryView,
    LoginUserView,
    MyCartView,
    OrderItemsView,
    ProductListView,
    ProductReviewsView,
    RegisterUserView,
    SearchView,
)

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/create/", CreateProductView.as_view(), name="create-product"),
    path("categories/create/", CreateCategoryView.as_view(), name="create-category"),
    path("categories/", ListCategoryView.as_view(), name="list-categories"),
    path(
        "products/<uuid:product_id>/reviews/",
        ProductReviewsView.as_view(),
        name="product-reviews",
    ),
    path("orders/<uuid:order_id>/items/", OrderItemsView.as_view(), name="order-items"),
    path("cart/add/", CartView.as_view(), name="cart-add"),
    path("products/search/", SearchView.as_view(), name="product-search"),
    path("cart/", MyCartView.as_view(), name="my-cart"),
    path("cart/checkout/", CheckoutView.as_view(), name="cart-checkout"),
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", LoginUserView.as_view(), name="login"),
]
