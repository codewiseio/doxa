from rest_framework import permissions,status,views
from rest_framework.response import Response

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
User = get_user_model()

from authentication.permissions import IsAccountOwner
from authentication.serializers import UserSerializer
from organizations.models import Organization
from organizations.serializers import OrganizationSerializer
from django.shortcuts import render
from django.db import transaction
import json

from doxa.exceptions import HttpException

# Create your views here.
class RegisterView(views.APIView):
    
    def _create_user_account(self, data):
        """ Create a user account from given form data """
        
        # check for existing account with given email
        try:               
            duplicate = User.objects.get(email=data.get('email'))
            raise HttpException({
                'status': 'Conflict',
                'message': 'An account with this email already exists.',
                'message-token': 'conflict-email'
            }, status=status.HTTP_409_CONFLICT)
        
        except User.DoesNotExist as error:
            pass
        
        # validate supplied user data
        serializer = UserSerializer( data=data )
        if serializer.is_valid():
            # create account
            user = User.objects.create_user(**serializer.validated_data)
            print( 'Created user account' )
        else:
            # data not valid, return bad request response
            raise HttpException({
                'status': 'Bad request',
                'message': 'Account could not be created with received data.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return user
    
    def _create_organization(self,data,user):
        data['owner'] = user.id
        serializer = OrganizationSerializer(data=data)
                
        # validate supplied data
        if serializer.is_valid():
            # create organization
            print ('Created organization.')
            organization = Organization.objects.create(**serializer.validated_data)
        else:
            print ( serializer.errors )
            # data not valid, return bad request response
            raise HttpException({
                'status': 'Bad request',
                'message': 'Account could not be created with received data.',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @transaction.atomic
    def post(self, request, format=None):
        data = request.data
        
        print( 'registering' )
        print( data )
        
        # create database entries inside a transaction
        try:
            with transaction.atomic():
                user = self._create_user_account(data.get('user'))
                organization = self._create_organization(data.get('organization'), user)
        
        except HttpException as e:
            return Response(e.response, e.status)
        
        except Exception as e:
            print ( e )
            return Response({
                    'status': 'Unknown Error',
                    'message': 'Oops. Something bad happened.. {}'.format(e.args[1]),
                    'details': e.args[1]
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # if we have reached this point everything completed successfully
        return Response({'status':'Created'}, status=status.HTTP_201_CREATED)
    