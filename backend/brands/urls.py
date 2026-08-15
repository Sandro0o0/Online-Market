
# from os import path
from django.urls import path
from .views import BrandView


urlpatterns = [
    path('brands/', BrandView.as_view(), name='brand-list'),
]       
