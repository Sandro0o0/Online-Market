from django.shortcuts import render
from .models import Brand
from .serializer import BrandSerializer
from rest_framework import generics, status
from rest_framework.response import Response


# Create your views here.


class BrandView(generics.ListCreateAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

    def get(self, _request, *args, **kwargs):
        brands = self.get_queryset()
        serializer = self.get_serializer(brands, many=True)

        brand_names = [brand.get("name") for brand in serializer.data if "name" in brand]
        return Response(brand_names, status=status.HTTP_200_OK)
    def post(self, request, *args, **kwargs):
        serializer = BrandSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

