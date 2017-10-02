from rest_framework import permissions,status,generics,viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import Http404


from people.models import Person
from people.serializers import PersonSerializer
from members.models import Member
from members.serializers import MemberSerializer

from django.db import transaction
from doxa.exceptions import HttpException, StorageException
from rest_framework.decorators import  api_view

import json


class MembersListView(generics.ListCreateAPIView): 
    serializer_class = MemberSerializer
    lookup_url_kwarg = "organization"

    def get_queryset(self):
        """ Build and return a queryset for retrieving objects. """
        organization = self.kwargs.get('organization')
        group        = self.kwargs.get('group')
        
        if organization:
            queryset = Member.objects.filter(organization=organization)
        elif group:
            queryset = Member.objects.filter(group=group)

        return self.filter_queryset(queryset)


    def filter_queryset(self, queryset):
        """ Apply filters to the queryset using user parameters. """

        # filter results
        filters = self.request.GET.get('filter')
        if filters:
            filters = json.loads(filters);
        else:
            filters = {}

        # handle 'query' argument
        query = self.request.GET.get('query')
        if query:
            filters['search'] = query

        # filter logic
        if filters:

            # filter using search string
            if filters.get('search'):
                print('Searching with query.');
                searchString = filters.get('search')
                queryset = queryset.filter(Q(person__first_name__icontains=searchString) | Q(person__last_name__icontains=searchString))

            # filter by age range
            if filters.get('age'):
                print('Filter by age.');
                age = filters.get('age').split('-');
                
                current = datetime.now().date()
                max_date = datetime(current.year - int(age[0]), current.month, current.day)
                min_date = datetime(current.year - int(age[1]), current.month, current.day)
                
                queryset = queryset.filter(person__birthday__gte=min_date.date(),person__birthday__lte=max_date.date())

            # filter by gender
            if filters.get('gender'):
                queryset = queryset.filter(person__gender=filters.get('gender'))

        # handle sorting
        sortOrder = self.request.GET.get('sortOrder')
        if sortOrder:
            if sortOrder == 'first_name':
               sortOrder = 'person__first_name'

            queryset = queryset.order_by(sortOrder)

        return queryset


    # list members
    def list(self, request, *args, **kwargs):
        """ Retrieve and return a list of members."""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = MemberSerializer(queryset, many=True)
        members = serializer.data
        return Response(members, status=status.HTTP_200_OK)


    # create
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """ Create a new member from user data."""
        data = request.data

        # if a person data was sent, create a new person object
        if 'person' in data:
            person = Person.objects.create(**data['person'])
            data['person_id'] = person.id
            data.pop('person')
      

        member = Member.objects.create(**data)
        serializer = MemberSerializer(member)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @api_view(['POST'])
    def delete(request , group, *args, **kwargs):
        ids = request.data["ids"]
        group_members = Member.objects.filter(id__in=ids).delete()
        return Response({'success':'true'}, status=status.HTTP_200_OK)


class MemberItemView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MemberSerializer
    queryset = Member.objects

    def retrieve(self, request, *args, **kwargs):
        """ Lookup and return a Member object. """
        self.object = self.get_object()
        serializer = self.get_serializer(self.object)
        member = serializer.data
        return Response(member)

    @transaction.atomic
    def update(self,request, pk, *args, **kwargs):
        """ Edit a Member object. """
        print ("Updating organization member " + pk )

        data = request.data
        data.pop('added_by')

        # get the member object
        member = Member.objects.get(pk=pk)

        # apply data changes to the person model
        if data.get('person'):
            Person.objects.get(pk=member.person.id).update(**data['person'])
        
        # apply data changes to the member model
        member.update(**data)

        # return the organization member
        serializer = MemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def delete(self, request, pk, *args, **kwargs):
        member = Member.objects.get(id=pk)
        person_id = member.person_id;

        serializer = MemberSerializer(member)

        # delete the person if:
        # we are deleting the organization member object
        # the person does not have a user account 
        # the person is not associated with any other organizations
        
        if (member.organization_id and not member.group_id) and person.user == None and Member.objects.filter(person_id=person_id).exclude(organization_id__isnull=True):
            person = Person.objects.get(id=person_id)
            person.delete();

        # return the member data
        return Response(serializer.data, status=status.HTTP_200_OK)















# class MembersListView(generics.ListCreateAPIView):
#     queryset = OrganizationMember.objects.order_by('id')
#     serializer_class = OrganizationMemberSerializer


#     @transaction.atomic
#     def create(self, request, *args, **kwargs):
#         data = request.data
#         print(data)
#         data['added_by_id'] = Person.objects.filter(user=request.user.id)[:1][0].id
        
#         # if a person data was sent, create a new person object
#         if 'person' in data:
#             person = Person.objects.create(**data['person'])
#             data['person_id'] = person.id
#             data.pop('person')
#             member = OrganizationMember.objects.create(**data)
#             serializer = OrganizationMemberSerializer(member)

#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def list(self, *args, **kwargs):
#         queryset = self.filter_queryset(self.get_queryset())
#         serializer = OrganizationMemberSerializer(queryset, many=True)
        
#         members = serializer.data
#         members = self.get_entity_data(members)

#         return Response(members, status=status.HTTP_201_CREATED)

#     def get_queryset(self):
#         organization = self.kwargs.get('organization')
#         queryset = OrganizationMember.objects.filter(organization=organization)

#         # filter results
#         filters = self.request.GET.get('filter')
#         if filters:
#             filters = json.loads(filters);

#             if filters.get('search'):
#                 print('Searching with query.');
#                 searchString = filters.get('search')
#                 queryset = queryset.filter(Q(person__first_name__icontains=searchString) | Q(person__last_name__icontains=searchString))

#         # handle sorting
#         sortOrder = self.request.GET.get('sortOrder')
#         if sortOrder:
#             if sortOrder == 'first_name':
#                sortOrder = 'person__first_name'

#             queryset = queryset.order_by(sortOrder)

#         return queryset


#     @api_view(['POST'])
#     def delete(request , *args, **kwargs):
#         ids = request.data["ids"]
#         organization_id = request.data["org"]
#         orgmembers = OrganizationMember.objects.filter(organization_id = organization_id).filter(id__in=ids).delete()
#         orgmembers_data = OrganizationMember.objects.filter(organization_id = organization_id)
#         serializer =  OrganizationMemberSerializer(orgmembers_data,many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)






# class MemberItemView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = MemberSerializer
#     queryset = Member.objects

#     def retrieve(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         serializer = self.get_serializer(self.object)
#         member = serializer.data
#         return Response(member)

#     @transaction.atomic
#     def update(self,request, pk, *args, **kwargs):

#         # partial = kwargs.pop('partial', False)
#         print("pk is")
#         print(pk)

#         data = request.data;
#         if 'id' in data:
#             person = Person.objects.get(pk=pk)
#             Person.objects.filter(pk=pk).update(**data['person'])
#             data['person_id'] = person.id
#             data['organization_id']=data['organization']
#             data.pop('person')
#             data.pop('organization')
#             member = OrganizationMember.objects.get(person_id=data['person_id'])
#             serializer = OrganizationMemberSerializer(member)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#     @transaction.atomic
#     def delete(self, request,pk, *args, **kwargs):
#         person = Person.objects.get(id=pk)
#         member = OrganizationMember.objects.get(person_id=person.id)
#         serializer = OrganizationMemberSerializer(member)
#         if person.user == None:
#             person.delete()
#         else:
#             return Response({'message':'This person can not be deleted'}, status=status.HTTP_400_BAD_REQUEST )

#         return Response(serializer.data, status=status.HTTP_200_OK)







# class MembersItemView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = MemberSerializer
#     queryset = Member.objects

#     def retrieve(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         serializer = self.get_serializer(self.object)
        
#         member = serializer.data
#         member['entity'] = self.get_entity(member['entity'])
#         member['contacts'] = ContactManager.get_primary_contacts(member['entity'])

#         return Response(member)

#     def get_entity(self, moniker):
#         print('Getting entity')
#         print (moniker)

#         mold, id = moniker.split(':')

#         if mold == 'person':
#             entity = Person.objects.get(id=id)
#             serializer = PersonSerializer(entity)
#             return serializer.data
#         else:
#             raise Http404("Person does not exist")

#     @transaction.atomic
#     def update(self, request, *args, **kwargs):
#         print( request.data )
#         partial = kwargs.pop('partial', False)

#         data = request.data;
        
#         try:
#             self.object = self.get_object()
#             success_status_code = status.HTTP_200_OK
#             self._update_person_info( request.data.get('entity') )
#             self._update_contact_info( request.data.get('contacts') )
#             return Response(data, status=success_status_code)
#         except Http404:
#             self.object = None
#             return Response(request.data, status=status.HTTP_400_BAD_REQUEST)
        

#     def _update_person_info( self, data ):

#         person = Person.objects.get(id=data['id']);
#         serializer = PersonSerializer(person,data=data,partial=True)
#         if serializer.is_valid():
#             serializer.save();
#             return serializer.data

#     def _update_contact_info(self, contacts, partial=False):
#         serialized_data = []
#         errors = []
        
#         try:
#             for item in contacts:
#                 serialized_data.append( ContactManager.save( item ) )
#         except StorageException as err:
#                 errors.merge( err.args[1] )
                
#         if ( len(errors) > 0 ):
#             raise StorageException( 'Could not update contact information', errors );
#         else:
#             return serialized_data;


# class MembersCreateView(generics.CreateAPIView):

#     @transaction.atomic
#     def create(self, request):
#         """ Handle post data to create a member."""
        
#         data = request.data
#         print(data)
        
#         try:
#             with transaction.atomic():
#                 person = self._create_person(data['entity'])

#                 owner = 'organization:{}'.format(data['owner']['id'])
#                 entity = 'person:{}'.format(person.id)

#                 # create member object
#                 data['member']['owner'] = owner
#                 data['member']['entity'] = entity
#                 member = self._create_member(data['member'])

#                 # create contacts
#                 contacts = self._save_contacts(entity, data['contacts'])

#         except HttpException as e:
#             return Response(e.response, e.status)
        
#         # except Exception as e:
#         #     print(e)
#         #     return Response({
#         #             'status': 'Unknown Error',
#         #             'message': 'Oops. Something bad happened.. {}'.format(e.args[0]),
#         #             'details': e.args[0]
#         #         }, status=status.HTTP_400_BAD_REQUEST)
        
#         # if we have reached this point everything completed successfully
#         return Response({'status':'Created'}, status=status.HTTP_201_CREATED)
        


#     def _create_person(self, data):
#         """ Create a person object from given form data """
#         # validate supplied user data
#         serializer = PersonSerializer( data=data )
#         if serializer.is_valid():
#             # create record
#             person = Person.objects.create(**serializer.validated_data)
            
#         else:
#             # data not valid, return bad request response
#             raise HttpException({
#                 'status': 'Bad request',
#                 'message': 'Record could not be created with received data.',
#                 'details': 'Could not create person record.'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         return person


#     def _create_member(self, data):
#         """ Create a person object from given form data """
#         # validate supplied user data
#         print( data )

#         serializer = MemberSerializer( data=data )
#         if serializer.is_valid():
#             # create record
#             person = Member.objects.create(**serializer.validated_data)
            
#         else:
#             # data not valid, return bad request response
#             raise HttpException({
#                 'status': 'Bad request',
#                 'message': 'Record could not be created with received data.',
#                 'details': 'Could not create member record.'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         return person

#     def _save_contacts(self, entity, data):
#         serialized_data = []
#         errors = []
        
#         # iterate over items in array
#         try:
#             for item in data:
#                 if not item.get('id'):
#                     item['owner'] = entity
#                 serialized_data.append( ContactManager.save( item ) )
#         except StorageException as err:
#                 errors.merge( err.args[1] )

                
#         if ( len(errors) > 0 ):
#             raise StorageException( 'Could not update contact information', errors );
#         else:
#             return serialized_data;

