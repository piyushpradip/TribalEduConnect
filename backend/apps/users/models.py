from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        APPLICANT = 'APPLICANT', 'Tribal Scholar / Applicant'
        SSO = 'SSO', 'State Scholarship Officer'
        CSO = 'CSO', 'Central Scholarship Officer'
        SV = 'SV', 'State Verifier'
        CV = 'CV', 'Central Verifier'
        SCM = 'SCM', 'Selection Committee Member'
        SUPER_ADMIN = 'SUPER_ADMIN', 'MoTA Super Admin / NIC Director'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.APPLICANT)
    mobile = models.CharField(max_length=20, blank=True)
    assigned_state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    caste = models.CharField(max_length=100, blank=True, null=True)
    aadhaar_masked = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=200, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"
