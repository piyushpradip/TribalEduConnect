from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Application
from .serializers import ApplicationSerializer, ApplicationCreateSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'scheme', 'state', 'academic_year']
    search_fields = ['application_number', 'applicant_name', 'institute_name', 'course_name', 'aadhaar_masked']
    ordering_fields = ['created_at', 'annual_income', 'merit_score']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            # Public can query by application_number via track endpoint
            return Application.objects.all().order_by('-created_at')

        # RBAC role filtering
        if user.role == 'APPLICANT':
            return Application.objects.filter(applicant=user).order_by('-created_at')
        elif user.role in ['SSO', 'SV']:
            # State officers view their jurisdiction
            if user.assigned_state:
                return Application.objects.filter(state=user.assigned_state).order_by('-created_at')
            return Application.objects.all().order_by('-created_at')
        # CSO, CV, SCM, SUPER_ADMIN see all
        return Application.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        return ApplicationSerializer

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def track(self, request):
        """Public tracking endpoint without requiring login."""
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'error': 'Please provide query param q (Application ID or Name)'}, status=status.HTTP_400_BAD_REQUEST)
        
        app = Application.objects.filter(application_number__iexact=query).first()
        if not app:
            app = Application.objects.filter(applicant_name__icontains=query).first()
        if not app:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(ApplicationSerializer(app).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def certify(self, request, pk=None):
        """Verifier digitally certifies valid application."""
        app = self.get_object()
        notes = request.data.get('notes', 'Certified valid by authorized Verifier.')
        app.status = Application.Status.VERIFIER_CERTIFIED
        app.certified_by = request.user
        app.certified_at = timezone.now()
        app.verifier_notes = notes
        app.save()
        return Response({'message': f'Application {app.application_number} certified.', 'status': app.status})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def deficiency(self, request, pk=None):
        """Issues 72-hour deficiency notice."""
        app = self.get_object()
        reason = request.data.get('reason', 'Clarification required on uploaded certificates.')
        app.status = Application.Status.DEFICIENT
        app.verifier_notes = reason
        app.save()
        return Response({'message': f'72-hour deficiency notice issued to {app.applicant_name}.', 'status': app.status})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def approve_award(self, request, pk=None):
        """Selection Committee approves and awards."""
        app = self.get_object()
        notes = request.data.get('notes', 'Approved by MoTA Selection Committee.')
        app.status = Application.Status.COMMITTEE_APPROVED
        app.awarded_by = request.user
        app.awarded_at = timezone.now()
        app.committee_notes = notes
        app.save()
        return Response({'message': f'Application awarded.', 'status': app.status})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def disburse(self, request, pk=None):
        """Officer disburses via PFMS DBT batch."""
        import uuid
        app = self.get_object()
        app.status = Application.Status.SCHOLARSHIP_RELEASED
        app.disbursed_by = request.user
        app.disbursed_at = timezone.now()
        app.pfms_transaction_id = f"PFMS-{uuid.uuid4().hex[:10].upper()}"
        app.disbursement_batch_id = request.data.get('batch_id', 'BATCH-2026-PFMS-01')
        app.save()
        return Response({
            'message': 'Disbursed via PFMS DBT.',
            'utr': app.pfms_transaction_id,
            'status': app.status
        })
