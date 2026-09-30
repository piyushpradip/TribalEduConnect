"""
URL configuration for mota_scholarship project.
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # OpenAPI 3 Schema & Swagger UI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Modular Domain APIs
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/schemes/', include('apps.schemes.urls')),
    path('api/v1/applications/', include('apps.applications.urls')),
    path('api/v1/documents/', include('apps.documents.urls')),
    path('api/v1/verification/', include('apps.verification.urls')),
    path('api/v1/grievances/', include('apps.grievance.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
]
