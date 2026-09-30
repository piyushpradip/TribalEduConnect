from django.contrib import admin
from .models import Application

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('application_number', 'applicant_name', 'scheme', 'status', 'annual_income', 'state', 'created_at')
    list_filter = ('status', 'state', 'scheme__level', 'academic_year')
    search_fields = ('application_number', 'applicant_name', 'aadhaar_masked', 'institute_name')
    readonly_fields = ('created_at', 'updated_at')
