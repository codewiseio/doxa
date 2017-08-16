from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import Http404

from contacts.models import Contact
from contacts.managers import ContactManager
from organizations.models import Organization, OrganizationMember
from organizations.permissions import IsAdministratorOfOrganization
from organizations.serializers import OrganizationSerializer, OrganizationMemberSerializer
from groups.models import GroupMember,Group
from people.models import Person
from contacts.serializers import ContactSerializer
from django.db import transaction
from django.db.models import Q

from doxa.exceptions import StorageException
from django.conf import settings
import json

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
            
#####Sort members as per filter######
class OrganizationMembersListView(generics.ListCreateAPIView): 
    serializer_class = OrganizationMemberSerializer
    lookup_url_kwarg = "organization"

    def get_queryset(self):
        organization = self.kwargs.get('organization')
        
        queryset = OrganizationMember.objects.filter(organization=organization)
        
        # filter results
        filters = self.request.GET.get('filter')
        if filters:
            filters = json.loads(filters);
        else:
            filters = {}

        query = self.request.GET.get('query')
        if query:
            filters['search'] = query

        if filters:
            if filters.get('search'):
                print('Searching with query.');
                searchString = filters.get('search')
                queryset = queryset.filter(Q(person__first_name__icontains=searchString) | Q(person__last_name__icontains=searchString))

        # handle sorting
        sortOrder = self.request.GET.get('sortOrder')
        if sortOrder:
            if sortOrder == 'first_name':
               sortOrder = 'person__first_name'

            queryset = queryset.order_by(sortOrder)

        return queryset



    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = OrganizationMemberSerializer(queryset, many=True)
        members = serializer.data
        return Response(members, status=status.HTTP_200_OK)


    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     data['added_by_id'] = Person.objects.filter(user=request.user.id)[:1][0].id

    #     serializer = self.get_serializer(data=data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        print(data)
        data['added_by_id'] = Person.objects.filter(user=request.user.id)[:1][0].id
        
        # if a person data was sent, create a new person object
        if 'person' in data:
            person = Person.objects.create(**data['person'])
            data['person_id'] = person.id
            data['role'] = "Administrator"
            data.pop('person')
            member = OrganizationMember.objects.create(**data)
            serializer = OrganizationMemberSerializer(member)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrganizationMemberItemView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrganizationMemberSerializer
    queryset = OrganizationMember.objects

    def retrieve(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(self.object)
        member = serializer.data
        return Response(member)

    @transaction.atomic
    def update(self,request, pk, *args, **kwargs):

        # partial = kwargs.pop('partial', False)
        print ("Updating organization member " + pk )

        data = request.data
        data.pop('added_by')
        print(data)

        # get the member object
        member = OrganizationMember.objects.get(pk=pk)

        # apply data changes
        Person.objects.filter(pk=member.person.id).update(**data['person'])
        data['person'] = member.person.id

        OrganizationMember.objects.filter(pk=pk).update(**data)

        # return the organization member
        member = OrganizationMember.objects.get(pk=pk)
        serializer = OrganizationMemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def delete(self, request,pk, *args, **kwargs):
        person = Person.objects.get(id=pk)
        member = OrganizationMember.objects.get(person_id=person.id)
        serializer = OrganizationMemberSerializer(member)
        if person.user == None:
            person.delete()
        else:
            return Response({'message':'This person can not be deleted'}, status=status.HTTP_400_BAD_REQUEST )

        return Response(serializer.data, status=status.HTTP_200_OK)

