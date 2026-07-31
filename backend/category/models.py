from django.db import models

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=100, blank= False, null = False)
    image= models.ImageField(upload_to='category_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    