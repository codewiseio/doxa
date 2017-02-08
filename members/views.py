from rest_framework import permissions, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from contacts.models import Contact, ContactManager
from organizations.models import Organization
from organizations.permissions import IsAdministratorOfOrganization
from organizations.serializers import OrganizationSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.order_by('id')
    serializer_class = OrganizationSerializer