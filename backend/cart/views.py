from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.delete()
        return Response({'success': True})


class CartProductView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if Cart.objects.filter(user=request.user).exists():
            return Response(
                {'detail': 'Cart already exists, use PATCH to add products.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = get_object_or_404(Product, id=request.data.get('id'))
        quantity = request.data.get('quantity', 1)

        cart = Cart.objects.create(user=request.user)
        CartItem.objects.create(cart=cart, product=product, quantity=quantity)

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def patch(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        product = get_object_or_404(Product, id=request.data.get('id'))
        quantity = request.data.get('quantity', 1)

        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, defaults={'quantity': quantity}
        )
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        CartItem.objects.filter(cart=cart, product_id=request.data.get('id')).delete()
        return Response(CartSerializer(cart).data)


class CartCheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        sold = 0
        for item in cart.items.select_related('product'):
            product = item.product
            product.stock = max(product.stock - item.quantity, 0)
            product.save()
            sold += item.quantity

        cart.delete()

        return Response({
            'success': True,
            'message': (
                f'Stocks were updated, currently {sold} items were sold. '
                'The cart will be cleared, user has to create a new cart with POST request'
            ),
        })