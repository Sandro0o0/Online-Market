import django_filters
from .models import Product


class ProductSearchFilter(django_filters.FilterSet):
    keywords = django_filters.CharFilter(field_name="title", lookup_expr="icontains")
    category_id = django_filters.NumberFilter(field_name="category__id")
    brand = django_filters.CharFilter(field_name="brand__name", lookup_expr='exact')
    # rating = django_filters.RangeFilter(field_name="ratings", lookup_expr="gte")
    price_min = django_filters.NumberFilter(field_name="price__current", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price__current", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ["keywords", "category_id", "brand", "price_min", "price_max"]