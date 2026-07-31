from django.db import models
from category.models import Category
from django.db.models import Avg
from decimal import Decimal

# Create your models here.


class Price(models.Model):
    # current= calcPrice()
    currency= models.CharField(max_length=10)
    beforeDiscount= models.PositiveIntegerField()
    discountPercentage= models.DecimalField(max_digits=5, decimal_places=3)


    @property
    def current(self):
        return self.beforeDiscount * (Decimal("100") - self.discountPercentage) / Decimal("100")
    
    def __str__(self):
        return str(self.current)  





    


class Product(models.Model):
    price = models.OneToOneField(Price, on_delete=models.CASCADE, null=True,  blank= True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True,  blank= True)
    title = models.CharField(max_length=200, blank=False, null=False)
    description = models.TextField(blank=True)
    issueDate = models.DateField(auto_now_add=True)
    thumbnail = models.ImageField(null=True, blank=True)
    stock = models.PositiveIntegerField()
    warranty = models.PositiveIntegerField()
    images = models.ImageField(null=True, blank=True)



    def __str__(self):
        return self.title

    @property
    def rating(self):
        """Return average rating value for this product"""
        avg = self.ratings.aggregate(Avg("value"))["value__avg"]
        return avg if avg is not None else 0
     


class Rating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)  # or your custom User model
    value = models.PositiveIntegerField()  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} rated {self.product} {self.value}"

