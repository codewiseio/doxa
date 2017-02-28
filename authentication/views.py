from rest_framework import permissions,status,views,viewsets
from rest_framework.response import Response
from rest_framework import generics

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
User = get_user_model()

from organizations.models import Organization
from organizations.serializers import OrganizationSerializer

from authentication.permissions import IsAccountOwner
from authentication.serializers import UserSerializer
from django.shortcuts import render

from django.db import transaction

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

class UserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):

        if request.data.get('password') :
            user = User.objects.get(pk=kwargs['pk'])
            user.set_password( request.data.get('password') )
            request.data.pop('password');

        serializer = self.get_serializer(user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save();
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(request.data, status=status.HTTP_400_BAD_REQUEST)


        # print( kwargs['id'] );
        # return Response(request.data, status=status.HTTP_200_OK)


        # partial = kwargs.pop('partial', False)

        # data = request.data;
        
        # try:
        #     self.object = self.get_object()
        #     success_status_code = status.HTTP_200_OK
        #     self._update_person_info( request.data.get('entity') )
        #     self._update_contact_info( request.data.get('contacts') )
        #     return Response(data, status=success_status_code)
        # except Http404:
        #     self.object = None
        #     return Response(request.data, status=status.HTTP_400_BAD_REQUEST)

        # user.set_password(password)



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
    # permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request, format=None):
        print('Logout')
        logout(request)
        
        return Response({}, status=status.HTTP_204_NO_CONTENT)
    
    