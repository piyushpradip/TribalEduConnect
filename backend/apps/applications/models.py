from django.db import models
from django.conf import settings
from apps.schemes.models import ScholarshipScheme

class Application(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        SUBMITTED = 'SUBMITTED', 'Submitted (Pending Verification)'
        VERIFIER_CERTIFIED = 'VERIFIER_CERTIFIED', 'Verifier Certified'
        DEFICIENT = 'DEFICIENT', 'Correction Needed (72h Notice)'
        REJECTED = 'REJECTED', 'Rejected'
        COMMITTEE_APPROVED = 'COMMITTEE_APPROVED', 'Committee Approved (Awarded)'
        SCHOLARSHIP_RELEASED = 'SCHOLARSHIP_RELEASED', 'Scholarship Disbursed (PFMS DBT)'

    application_number = models.CharField(max_length=60, unique=True)
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    scheme = models.ForeignKey(ScholarshipScheme, on_delete=models.PROTECT, related_name='applications')
    
    # Candidate details snapshot
    applicant_name = models.CharField(max_length=200)
    applicant_email = models.EmailField()
    applicant_mobile = models.CharField(max_length=20)
    father_name = models.CharField(max_length=200, blank=True)
    caste = models.CharField(max_length=150)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    aadhaar_masked = models.CharField(max_length=20)
    annual_income = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Enrolled Course & Institution
    institute_name = models.CharField(max_length=300)
    course_name = models.CharField(max_length=250)
    current_year = models.CharField(max_length=50, default='Year 1')
    academic_year = models.CharField(max_length=20, default='2026-2027')
    grant_amount = models.DecimalField(max_digits=12, decimal_places=2)
    merit_score = models.FloatField(default=85.0)

    # 6-Stage Lifecycle Status
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.SUBMITTED)
    
    # Verification details
    certified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='certified_applications'
    )
    certified_at = models.DateTimeField(null=True, blank=True)
    verifier_notes = models.TextField(blank=True, null=True)

    # Selection Committee approval
    awarded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='awarded_applications'
    )
    awarded_at = models.DateTimeField(null=True, blank=True)
    committee_notes = models.TextField(blank=True, null=True)

    # Disbursal & PFMS DBT
    disbursed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='disbursed_applications'
    )
    disbursed_at = models.DateTimeField(null=True, blank=True)
    pfms_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    disbursement_batch_id = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.application_number} - {self.applicant_name} ({self.status})"
