from rest_framework import permissions,status,views,viewsets
from rest_framework.response import Response

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
User = get_user_model()

from organizations.models import Organization
from organizations.serializers import OrganizationSerializer

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
        
        # check for existing account with given email
        duplicate = User.objects.get(email=request.data.get('email'))
        if duplicate:
            return Response({
                'status': 'Conflict',
                'message': 'This email is already in use.',
                'message-token': 'conflict-email'
            }, status=status.HTTP_409_CONFLICT)
        
        # validate supplied data
        if serializer.is_valid():
            
            # create account
            User.objects.create_user(**serializer.validated_data)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        
        # data not valid, return bad request response
        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    def post(self, request, format=None):
        
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        entry_point = data.get('entry_point','dashboard')           
        
        
        print('Received {}:{}'.format(email, password) )

        user = authenticate(email=email, password=password)
        
        if entry_point == "dashboard":
            # discover organizations that user is owner of
            organization = Organization.objects.filter(owner=user.id)[:1][0]
            
            
            # if not owner of any organizations throw an error
            if organization == None:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'You are not an authorized organization owner.'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # if owner of an organization, set session data
            # request.session['user'] = user
            # request.session['organization'] = organization
            
        
        if user is not None:
            if user.is_active:
                login(request, user)
                return Response({
                    'user': UserSerializer(user).data,
                    'organization': OrganizationSerializer(organization).data
                });
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
    
    