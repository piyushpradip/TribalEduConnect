from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ScholarshipScheme
from .serializers import ScholarshipSchemeSerializer

class ScholarshipSchemeViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipScheme.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ScholarshipSchemeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['level', 'scheme_type', 'state', 'academic_year']
    search_fields = ['name', 'code', 'description', 'ministry_or_dept']
    ordering_fields = ['grant_amount', 'deadline', 'created_at']
