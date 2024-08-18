from django.urls import path
from .views import (
    CartView,
    CheckoutView,
    CreateCategoryView,
    CreateProductView,
    ListCategoryView,
    LoginUserView,
    MyCartView,
    ProductListView,
    RegisterUserView,
    SearchView,
)

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/create/", CreateProductView.as_view(), name="create-product"),
    path("categories/create/", CreateCategoryView.as_view(), name="create-category"),
    path("categories/", ListCategoryView.as_view(), name="list-categories"),
    path("cart/add/", CartView.as_view(), name="cart-add"),
    path("products/search/", SearchView.as_view(), name="product-search"),
    path("cart/", MyCartView.as_view(), name="my-cart"),
    path("cart/checkout/", CheckoutView.as_view(), name="cart-checkout"),
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", LoginUserView.as_view(), name="login"),
]
