from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import Http404

from contacts.models import Contact
from contacts.managers import ContactManager
from organizations.models import Organization
from organizations.permissions import IsAdministratorOfOrganization
from organizations.serializers import OrganizationSerializer
from contacts.serializers import ContactSerializer
from django.db import transaction

from doxa.exceptions import StorageException




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
        
        context = request.GET.get('context',None)
        
        serialized_organization = serializer.data
        serialized_organization['contacts'] = {}
        
        if context == 'dashboard.organization.edit':
            # get primary contact details
            moniker = 'organization:{}'.format(organization.id)
            # contacts = ContactManager.get_primary_contacts(moniker);

            contacts = Contact.objects.filter(owner=moniker, primary=True)
            
            serialized_organization['contacts'] = [ {}, {}, {}]
            
            contact_map = {'email':0, 'telephone':1, 'postaddress':2}
            
            for contact in contacts:
                index = contact_map.get(contact.kind)
                serialized_organization['contacts'][index] = contact.serialize()

        return Response(serialized_organization)
    
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
    
    

def perform_create(self, serializer):
    instance = serializer.save(created=self.request.user)

    return super(OrganizationViewSet, self).perform_create(serializer)