from django.contrib import admin
from .models import ScholarshipScheme

@admin.register(ScholarshipScheme)
class ScholarshipSchemeAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'level', 'scheme_type', 'grant_amount', 'deadline', 'is_active')
    list_filter = ('level', 'scheme_type', 'is_active', 'state', 'academic_year')
    search_fields = ('name', 'code', 'description')
