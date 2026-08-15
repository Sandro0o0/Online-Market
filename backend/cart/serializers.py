from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    productId = serializers.CharField(source='product.id', read_only=True)
    pricePerQuantity = serializers.SerializerMethodField()
    beforeDiscountPrice = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['quantity', 'pricePerQuantity', 'beforeDiscountPrice', 'productId']

    def get_pricePerQuantity(self, obj):
        return obj.product.price.current if obj.product.price else 0

    def get_beforeDiscountPrice(self, obj):
        return obj.product.price.beforeDiscount if obj.product.price else 0


class CartSerializer(serializers.ModelSerializer):
    _id = serializers.CharField(source='id', read_only=True)
    userId = serializers.CharField(source='user.id', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    products = CartItemSerializer(source='items', many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['_id', 'userId', 'createdAt', 'total', 'products']

    def get_total(self, obj):
        return {
            'price': {
                'current': obj.total_price_current,
                'beforeDiscount': obj.total_price_before_discount,
            },
            'quantity': obj.total_quantity,
            'products': obj.total_products,
        }