from django.urls import path
from .views import CartView, CartProductView, CartCheckoutView

urlpatterns = [
    path('', CartView.as_view()),
    path('product', CartProductView.as_view()),
    path('checkout', CartCheckoutView.as_view()),
]
