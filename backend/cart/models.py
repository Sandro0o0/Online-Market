from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.db import models
from products.models import Product  


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    

    @property
    def total_quantity(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def total_products(self):
        return self.items.count()

    @property
    def total_price_current(self):
        return sum(item.line_total_current for item in self.items.all())

    @property
    def total_price_before_discount(self):
        return sum(item.line_total_before_discount for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    @property
    def line_total_current(self):
        if not self.product.price:
            return 0
        return self.quantity * self.product.price.current

    @property
    def line_total_before_discount(self):
        if not self.product.price:
            return 0
        return self.quantity * self.product.price.beforeDiscount