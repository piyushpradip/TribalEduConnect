from django.db import models
from django.conf import settings

class StudentDocument(models.Model):
    class DocType(models.TextChoices):
        DOMICILE = 'DOMICILE_CERTIFICATE', 'Residential / Domicile Certificate'
        INCOME = 'INCOME_CERTIFICATE', 'Annual Family Income Certificate'
        CASTE = 'CASTE_CERTIFICATE', 'ST Caste Certificate'
        ACADEMIC_10TH = 'ACADEMIC_10TH', 'Class 10th Certificate / Marksheet'
        ACADEMIC_12TH = 'ACADEMIC_12TH', 'Class 12th Passing Certificate'
        ACADEMIC_GRAD = 'ACADEMIC_GRADUATION', 'Graduation Degree / Transcript'
        PHD_REG = 'PHD_REGISTRATION', 'Ph.D. / M.Phil. University Registration'
        AADHAAR = 'AADHAAR_CARD', 'Aadhaar Card'
        BONAFIDE = 'BONAFIDE_CERTIFICATE', 'College Bonafide with Fee Structure'

    class VerificationStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Verification'
        VERIFIED = 'VERIFIED', 'Verified Valid'
        REJECTED = 'REJECTED', 'Rejected / Clarification Needed'

    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=40, choices=DocType.choices)
    title = models.CharField(max_length=250)
    certificate_number = models.CharField(max_length=100, blank=True, null=True)
    issuing_authority = models.CharField(max_length=200, blank=True, null=True)
    issue_date = models.DateField(blank=True, null=True)
    file = models.FileField(upload_to='student_documents/%Y/%m/', blank=True, null=True)
    file_url = models.URLField(blank=True, null=True)
    file_size = models.CharField(max_length=50, default='1.2 MB')
    is_digilocker_verified = models.BooleanField(default=True)
    verification_status = models.CharField(
        max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.VERIFIED
    )
    verified_by = models.CharField(max_length=150, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.applicant.username})"
