from django.contrib import admin
from .models import Category

# Register your models here.


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name','id', 'image')
    list_editable = ('image',)


admin.site.register(Category, CategoryAdmin)
