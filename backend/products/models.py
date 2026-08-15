from django.db import models
from category.models import Category
from django.db.models import Avg
from decimal import Decimal
from brands.models import Brand
from django.contrib.auth.models import User

# Create your models here.


class Price(models.Model):
    currency= models.CharField(max_length=10)
    beforeDiscount= models.PositiveIntegerField()
    discountPercentage= models.DecimalField(max_digits=5, decimal_places=3)
    current = models.DecimalField(max_digits=10, decimal_places=2, null=True,blank=True, editable=False)

#     current = models.DecimalField(
#         max_digits=10,
#         decimal_places=2,
#         null=True,
#         blank=True,
#         editable=False
# )
    def save(self, *args, **kwargs):
        # Only calculate if beforeDiscount and discountPercentage exist
        if self.beforeDiscount is not None and self.discountPercentage is not None:
            self.current = self.beforeDiscount * (Decimal("100") - self.discountPercentage) / Decimal("100")
        super().save(*args, **kwargs)
    # @property
    # def current(self):
    #     return self.beforeDiscount * (Decimal("100") - self.discountPercentage) / Decimal("100")
    
    def __str__(self):
        return str(self.current)  





    


class Product(models.Model):
    price = models.OneToOneField(Price, on_delete=models.CASCADE, null=True,  blank= True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True,  blank= True)
    title = models.CharField(max_length=200, blank=False, null=False)
    description = models.TextField(blank=True)
    issueDate = models.DateField(auto_now_add=True)
    thumbnail = models.ImageField(null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True, blank=True)
    stock = models.PositiveIntegerField()
    warranty = models.PositiveIntegerField()
    rates= models.ManyToManyField('Ratings', related_name='product_ratings', blank=True)
    images = models.ImageField(null=True, blank=True)
    _rating = None
    _ratings = None

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.title

    @property
    def rating(self):
        avg = self.rates.aggregate(Avg("value"))["value__avg"]
        return avg if avg is not None else 0

    @rating.setter
    def rating(self, value):
        # Allow assignment in Python code
        self._rating = value     


class Ratings(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    value = models.PositiveIntegerField()  
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("product", "user")

    def __str__(self):
        return f"{self.user} rated {self.product} {self.value}"
