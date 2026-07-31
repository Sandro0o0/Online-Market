from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('sign_up', RegisterView.as_view(), name='register'),
    path('sign_in', LoginView.as_view(), name='login'), 
    path('sign_out', LogoutView.as_view(), name='logout'),
    path('refresh', TokenRefreshView.as_view(), name='token_obtain_pair'), # token ganaxlebistvis 
    path('personal', PersonalSpaceView.as_view(), name='personal-space'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
