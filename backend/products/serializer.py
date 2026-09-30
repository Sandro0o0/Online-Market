from django.db.models import Avg

from brands.models import Brand
from brands.serializer import BrandSerializer
from rest_framework import serializers
from .models import Product, Price, Ratings
from category.serializers import CategorySerializer
from category.models import Category


def update_product_rating(product):
    average_rating = product.rates.aggregate(avg_rating=Avg("value"))["avg_rating"]
    product.rating = average_rating or 0
    product.save(update_fields=["rating"])

class PriceSerializer(serializers.ModelSerializer):
    current = serializers.SerializerMethodField()

    def get_current(self, obj):
        return obj.current

    class Meta:
        model = Price
        fields = ["currency", "beforeDiscount", "discountPercentage", "current"]



class RatingSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Ratings
        fields = ["user", "value", "created_at", "product"]

    def create(self, validated_data):
        product = validated_data.pop("product", None) or self.context.get("product")

        if isinstance(product, int):
            product = Product.objects.get(pk=product)

        rating = Ratings.objects.create(**validated_data)

        if product is not None:
            setattr(rating, "product", product)
            rating.save(update_fields=["product"])
            update_product_rating(product)

        return rating


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True
    )
    
    category_detail = CategorySerializer(source='category', read_only=True)

    brand = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Brand.objects.all()
    )

    price = PriceSerializer()
    rates = RatingSerializer(many=True )  
    ratings = serializers.FloatField(source='rating')
    _id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        price_data = validated_data.pop('price', None)
        if price_data is not None:
            price = Price.objects.create(**price_data)
        else:
            price = None
        rates_data = validated_data.pop('rates', None)

        # brand is already resolved by SlugRelatedField
        brand = validated_data.pop('brand', None)

        product = Product.objects.create(price=price, brand=brand, **validated_data)

        if rates_data:
            for rate_data in rates_data:
                rate_serializer = RatingSerializer(data=rate_data, context={'product': product})
                rate_serializer.is_valid(raise_exception=True)
                rate_serializer.save()

        return product
