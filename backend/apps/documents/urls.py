from rest_framework.routers import DefaultRouter
from .views import StudentDocumentViewSet

router = DefaultRouter()
router.register(r'', StudentDocumentViewSet, basename='document')

urlpatterns = router.urls
