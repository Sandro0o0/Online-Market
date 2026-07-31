from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CostumPagePagination(PageNumberPagination):
    page_size = 10
    page_query_param = 'page'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            "total": self.page.paginator.num_pages,   # total number of pages
            "limit": self.get_page_size(self.request),  # items per page
            "page": self.page.number,                  # current page
            "products": data                           # paginated results
        })
