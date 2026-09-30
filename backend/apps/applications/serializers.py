from rest_framework import serializers
from .models import Application
from apps.schemes.serializers import ScholarshipSchemeSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    scheme_details = ScholarshipSchemeSerializer(source='scheme', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = [
            'application_number', 'applicant', 'status', 'certified_by', 'certified_at',
            'awarded_by', 'awarded_at', 'disbursed_by', 'disbursed_at', 'pfms_transaction_id'
        ]

class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            'scheme', 'institute_name', 'course_name', 'current_year', 'annual_income'
        ]

    def create(self, validated_data):
        import uuid
        request = self.context['request']
        user = request.user
        scheme = validated_data['scheme']
        
        app_number = f"APP-2026-ST-{uuid.uuid4().hex[:6].upper()}"

        application = Application.objects.create(
            application_number=app_number,
            applicant=user,
            scheme=scheme,
            applicant_name=user.get_full_name() or user.username,
            applicant_email=user.email,
            applicant_mobile=user.mobile,
            father_name='Tribal Guardian',
            caste=user.caste or 'ST (Scheduled Tribe)',
            state=user.assigned_state or 'Jharkhand',
            district=user.district or 'Ranchi',
            aadhaar_masked=user.aadhaar_masked or 'XXXX-XXXX-9812',
            annual_income=validated_data['annual_income'],
            institute_name=validated_data['institute_name'],
            course_name=validated_data['course_name'],
            current_year=validated_data['current_year'],
            academic_year=scheme.academic_year,
            grant_amount=scheme.grant_amount,
            status=Application.Status.SUBMITTED
        )
        return application
