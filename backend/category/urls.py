

from django.urls import path
from .views import CategoryView

urlpatterns = [
    path('shop/products/category/', CategoryView.as_view(), name='category-list'),
    # path('admin/', admin.site.urls),
]