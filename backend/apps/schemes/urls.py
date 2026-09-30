from rest_framework.routers import DefaultRouter
from .views import ScholarshipSchemeViewSet

router = DefaultRouter()
router.register(r'', ScholarshipSchemeViewSet, basename='scholarship-scheme')

urlpatterns = router.urls
