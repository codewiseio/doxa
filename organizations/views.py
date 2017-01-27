from rest_framework import permissions, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from contacts.models import Contact, ContactManager
from organizations.models import Organization
from organizations.permissions import IsAdministratorOfOrganization
from organizations.serializers import OrganizationSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.order_by('id')
    serializer_class = OrganizationSerializer

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
            moniker = 'organization.{}'.format(organization.id)
            contacts = Contact.objects.filter(moniker=moniker, primary=True)
            for contact in contacts:
                serialized_contact = contact.serialize()
                serialized_organization['contacts'][contact.kind] = serialized_contact

        print (serialized_organization)
        
        return Response(serialized_organization)
    

def perform_create(self, serializer):
    instance = serializer.save(created=self.request.user)

    return super(OrganizationViewSet, self).perform_create(serializer)