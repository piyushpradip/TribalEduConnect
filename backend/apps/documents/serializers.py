from rest_framework import serializers
from .models import StudentDocument

class StudentDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDocument
        fields = '__all__'
        read_only_fields = ['applicant', 'created_at']
