from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'mobile', 'assigned_state', 'district', 'caste',
            'aadhaar_masked', 'department', 'avatar_url', 'created_at'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'mobile', 'caste', 'assigned_state']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            mobile=validated_data.get('mobile', ''),
            caste=validated_data.get('caste', 'ST'),
            assigned_state=validated_data.get('assigned_state', ''),
            role=User.Role.APPLICANT
        )
        return user
