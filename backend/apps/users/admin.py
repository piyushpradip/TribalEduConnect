from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'assigned_state', 'is_staff')
    list_filter = ('role', 'assigned_state', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('MoTA RBAC & Regional Identity', {
            'fields': ('role', 'mobile', 'assigned_state', 'district', 'caste', 'aadhaar_masked', 'department', 'avatar_url')
        }),
    )
