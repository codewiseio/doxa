from rest_framework import permissions,status,views,viewsets
from rest_framework.response import Response

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
User = get_user_model()

from authentication.permissions import IsAccountOwner
from authentication.serializers import UserSerializer
from django.shortcuts import render

import json

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    lookup_field = 'email'
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return(permissions.AllowAny(),)
        
        if self.request.method == 'POST':
            return(permissions.AllowAny(),)
        
        return(permissions.IsAuthenticated(), IsAccountOwner(),)
    
    def create(self,request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            User.objects.create_user(**serializer.validated_data)
            
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        
        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    def post(self, request, format=None):
        
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        
        print('Received {}:{}'.format(email, password) )

        user = authenticate(email=email, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                serialized = UserSerializer(user)

                return Response(serialized.data)
            else:
                print ('User is disabled')
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This user has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            print ('Email/password combination invalid')
            return Response({
                'status': 'Unauthorized',
                'message': 'Email/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request, format=None):
        print('Logout')
        logout(request)
        
        return Response({}, status=status.HTTP_204_NO_CONTENT)
    
    