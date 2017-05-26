from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import Http404

from contacts.models import Contact
from contacts.managers import ContactManager
from organizations.models import Organization, OrganizationMember
from organizations.permissions import IsAdministratorOfOrganization
from organizations.serializers import OrganizationSerializer, OrganizationMemberSerializer
from contacts.serializers import ContactSerializer
from django.db import transaction

from doxa.exceptions import StorageException
from django.conf import settings




class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.order_by('id')
    serializer_class = OrganizationSerializer
    contact_serializer_class = ContactSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAdministratorOfOrganization(),)
    
    def retrieve(self, request, pk=None):
        queryset = Organization.objects.all()
        organization = get_object_or_404(queryset, pk=pk)
        serializer = OrganizationSerializer(organization)
        moniker = 'organization:{}'.format(organization.id)
        
        # determine the context
        context = request.GET.get('context',None)
        print('Retrieving organization')
        print(context)

        item = serializer.data
        item['contacts'] = {}


        # if we are editing the organization from the dashboard
        if context == 'dashboard.organization.edit':
            # get primary contact details
            
            # contacts = ContactManager.get_primary_contacts(moniker);

            contacts = Contact.objects.filter(owner=moniker, primary=True) 
            item['contacts'] = [ {}, {}, {}]
            contact_map = {'email':0, 'telephone':1, 'postaddress':2}
            
            for contact in contacts:
                index = contact_map.get(contact.kind)
                item['contacts'][index] = contact.serialize()

        # if we are viewing the organizatoin profile
        elif context == "organization.profile":
            item['profile'] = {
                'pastor': 'John Doe',
                'bannerPhoto': '{}/default/organization-banner-photo.jpg'.format(settings.USER_FILES),
                'profilePhoto': '{}/default/organization-profile-photo.png'.format(settings.USER_FILES)
            }



            # profile = Profile.objects.filter(entity=moniker)



        return Response(item)
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        print( request.data )
        partial = kwargs.pop('partial', False)
        
        try:
            self.object = self.get_object()
            success_status_code = status.HTTP_200_OK
        except Http404:
            self.object = None
            success_status_code = status.HTTP_201_CREATED
        
        serializer = self.get_serializer(self.object, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.object = serializer.save()
            
            # update contact information
            self._update_contact_info(request.data.get('contacts'), partial)
            
            return Response(serializer.data, status=success_status_code)
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
    def _update_contact_info(self, contacts, partial=False):
        serialized_data = []
        errors = []
        
        try:
            for item in contacts:
                serialized_data.append( ContactManager.save( item ) )
        except StorageException as err:
                errors.merge( err.args[1] )
                
        if ( len(errors) > 0 ):
            raise StorageException( 'Could not update contact information', errors );
        else:
            return serialized_data;
    

class OrganizationMembersView(generics.ListCreateAPIView): 
    serializer_class = OrganizationMemberSerializer
    lookup_url_kwarg = "organization"

    def get_queryset(self):
        organization = self.kwargs.get('organization')
        members = OrganizationMember.objects.filter(organization=organization)
        return members

    def list(self, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = OrganizationMemberSerializer(queryset, many=True)
        members = serializer.data
        return Response(members, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        data['added_by_id'] = Person.objects.filter(user=request.user.id)[:1][0].id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
