from django.urls import path
from .views import CartView, CheckoutView, MyCartView, ProductListView, SearchView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('cart/add/', CartView.as_view(), name='cart-add'),
    path('products/search/', SearchView.as_view(), name='product-search'),
    path('cart/', MyCartView.as_view(), name='my-cart'),
    path('cart/checkout/', CheckoutView.as_view(), name='cart-checkout'),
]
