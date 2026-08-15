from django.contrib import admin
from .models import Price, Ratings
from .models import Product
# Register your models here.



admin.site.register(Product)
admin.site.register(Price)
admin.site.register(Ratings)
