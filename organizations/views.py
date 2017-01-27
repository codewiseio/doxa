from rest_framework import permissions, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

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
        
        context = request.data.get('context',None)
        
        print (serializer.data)
        
        return Response(serializer.data)
    

def perform_create(self, serializer):
    instance = serializer.save(created=self.request.user)

    return super(OrganizationViewSet, self).perform_create(serializer)