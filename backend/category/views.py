from django.shortcuts import render
from backend.paginations import CostumPagePagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import isAdminOrReadOnly 

from .models import Category
from .serializers import CategorySerializer


class CategoryView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this view

    def get(self, request):
        queryset = Category.objects.all()
        paginator = CostumPagePagination()
        
        paginated_qs = paginator.paginate_queryset(queryset, request)
        serializer = CategorySerializer(paginated_qs, many=True)
        
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
