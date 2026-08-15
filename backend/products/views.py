# pyright: reportMissingImports=false

from itertools import product

from .search import ProductSearchFilter
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Avg

from backend.paginations import CostumPagePagination

from .models import Product, Ratings
from .serializer import ProductSerializer, RatingSerializer

# Create your views here.


class ProductView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.all()
        paginator = CostumPagePagination()
        
        paginated_qs = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(paginated_qs, many=True)


        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serialzer = ProductSerializer(data=request.data)
        if serialzer.is_valid() :
            serialzer.save()
            return Response(serialzer.data, status=status.HTTP_201_CREATED )
        return Response(serialzer.errors, status = status.HTTP_400_BAD_REQUEST )
    

class ProductDetailView(APIView):
    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)  
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)



class ProductRatingView(APIView):
    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product)
        return Response({"rating": serializer.data.get("ratings")}, status=status.HTTP_200_OK)
    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        user = request.user
        value = request.data.get("value")

        if not user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        if value is None:
            return Response({"error": "Rating value is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            value = int(value)
        except (TypeError, ValueError):
            return Response({"error": "Rating must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        if value < 1 or value > 5:
            return Response({"error": "Rating value must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        Ratings.objects.update_or_create(product=product, user=user, defaults={"value": value})

        avg_rating = Ratings.objects.filter(product=product).aggregate(avg=Avg("value"))["avg"] or 0
        print(self.request.data)
        return Response(
            {"message": "Rating submitted successfully.", "average_rating": avg_rating},
            status=status.HTTP_200_OK
        )
    
class ProductSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        fillterSet = ProductSearchFilter(request.GET, queryset=Product.objects.all())
        if fillterSet.is_valid():
            products = fillterSet.qs
            paginator = CostumPagePagination()
            paginated_qs = paginator.paginate_queryset(products, request)
            serializer = ProductSerializer(paginated_qs, many=True)
            return paginator.get_paginated_response(serializer.data)