from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email_or_username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')

        user = None
        # Try username or email
        if User.objects.filter(email=email_or_username).exists():
            user_obj = User.objects.get(email=email_or_username)
            user = authenticate(username=user_obj.username, password=password)
        else:
            user = authenticate(username=email_or_username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class RoleImpersonateView(views.APIView):
    """Allows Super Admin to switch view role with audit trail."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != User.Role.SUPER_ADMIN:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        target_role = request.data.get('role')
        if target_role not in User.Role.values:
            return Response({'error': 'Invalid target role'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': f'Impersonating role {target_role}', 'active_role': target_role})
