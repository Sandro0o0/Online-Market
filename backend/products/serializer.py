from rest_framework import serializers
from .models import Product, Price, Rating

class PriceSerializer(serializers.ModelSerializer):
    current = serializers.ReadOnlyField(source="current")  # expose calculated price

    class Meta:
        model = Price
        fields = ["currency", "before_discount", "discount_percentage", "current"]


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["user", "value", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    price = PriceSerializer(read_only=True)  
    ratings = RatingSerializer(many=True, read_only=True) 
    rating = serializers.ReadOnlyField(source="rating")  

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "description",
            "issue_date",
            "thumbnail",
            "stock",
            "warranty",
            "images",
            "category",
            "price",
            "ratings",
            "rating",  
        ]
