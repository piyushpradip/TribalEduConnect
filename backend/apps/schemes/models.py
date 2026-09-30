from django.db import models

class ScholarshipScheme(models.Model):
    class SchemeLevel(models.TextChoices):
        CENTRAL = 'CENTRAL', 'Central Sector Scheme'
        STATE = 'STATE', 'State Specific Scheme'

    class SchemeType(models.TextChoices):
        FELLOWSHIP = 'FELLOWSHIP', 'National Research Fellowship'
        OVERSEAS = 'OVERSEAS', 'National Overseas Scholarship'
        HIGHER_ED = 'HIGHER_ED', 'Top Class Institutions'
        POST_MATRIC = 'POST_MATRIC', 'Post-Matric ST Scholarship'
        PRE_MATRIC = 'PRE_MATRIC', 'Pre-Matric ST Scholarship'

    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=300)
    level = models.CharField(max_length=20, choices=SchemeLevel.choices, default=SchemeLevel.CENTRAL)
    scheme_type = models.CharField(max_length=20, choices=SchemeType.choices, default=SchemeType.POST_MATRIC)
    ministry_or_dept = models.CharField(max_length=250, default='Ministry of Tribal Affairs, Government of India')
    state = models.CharField(max_length=100, blank=True, null=True)
    academic_year = models.CharField(max_length=20, default='2026-2027')
    grant_amount = models.DecimalField(max_digits=12, decimal_places=2)
    income_limit = models.DecimalField(max_digits=12, decimal_places=2, default=250000.00)
    category_eligibility = models.JSONField(default=list)  # e.g. ["ST"]
    education_levels = models.JSONField(default=list)      # e.g. ["Undergraduate", "Postgraduate"]
    required_documents = models.JSONField(default=list)
    deadline = models.DateField()
    slots_total = models.PositiveIntegerField(default=1000)
    slots_remaining = models.PositiveIntegerField(default=1000)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    guideline_document_title = models.CharField(max_length=255, blank=True, null=True)
    published_by = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.code}] {self.name}"
