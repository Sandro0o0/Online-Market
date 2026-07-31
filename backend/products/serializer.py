from rest_framework import serializers
from .models import Product, Price, Rating
from category.serializers import CategorySerializer
from category.models import Category

class PriceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Price
        fields = ["currency", "beforeDiscount", "discountPercentage", "current"]


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["user", "value", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    category= serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True
    )

    # For output: return the full nested Category object
    category_detail = CategorySerializer(source='category', read_only=True)

    price = PriceSerializer()
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):

        price_data = validated_data.pop('price')
        # category_data = validated_data.pop('category')

        # category = Category.objects.get(id=category_data)

        price = Price.objects.create(**price_data)
        product = Product.objects.create(price=price, **validated_data)



        return product