from django.contrib import admin
from django.urls import path, include
from .views import ProductDetailView, ProductRatingView, ProductSearchView, ProductView

urlpatterns = [
    path("all/", ProductView.as_view()),
    path('id/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path("rating/<int:pk>/", ProductRatingView.as_view(), name="product-rating"),
    path("search/", ProductSearchView.as_view(), name="product-search")
]
