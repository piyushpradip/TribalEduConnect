from rest_framework import viewsets, permissions
from .models import StudentDocument
from .serializers import StudentDocumentSerializer

class StudentDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'APPLICANT':
            return StudentDocument.objects.filter(applicant=user).order_by('-created_at')
        # Verifiers and Officers can view documents for verification
        return StudentDocument.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)
