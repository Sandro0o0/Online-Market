from django.shortcuts import render
from models import Product
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from serializer import ProductSerializer
from rest_framework.response import Response
from rest_framework.status import status

# Create your views here.


class ProductView(APIView):
    permission_clases = [AllowAny]
    def get(self, request):
        serializer = ProductSerializer(Product, many=True)
        return Response(serializer.data)

    def post(self, request):
        serialzer = ProductSerializer(data=request.data)
        if(serialzer.is_valid):
            serialzer.save()
            return Response(serialzer.data, status = status.HTTP_201_CREATED )
        return Response(serialzer.data, status = status.HTTP_400_BAD_REQUEST )



        
        

