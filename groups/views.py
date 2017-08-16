from django.shortcuts import render
from rest_framework import status, viewsets, views, generics
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser, FileUploadParser
from groups.models import Group, GroupMember
from groups.serializers import GroupSerializer, GroupMemberSerializer
from rest_framework.decorators import  api_view

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db.models import Q

from people.models import Person
import json

class GroupViewSet(viewsets.ModelViewSet):

    queryset = Group.objects.order_by('id')
    serializer_class = GroupSerializer


class GroupListView(generics.ListCreateAPIView):
    serializer_class = GroupSerializer

    def get_queryset(self):
        organization = self.kwargs.get('organization')
        queryset = Group.objects.filter(organization=organization)

        # filter results
        filters = self.request.GET.get('filter')
        print(filters);

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
                queryset = queryset.filter(name__icontains=searchString)

        # handle sorting
        sortOrder = self.request.GET.get('sortOrder')
        if sortOrder:
            queryset = queryset.order_by(sortOrder)

        return queryset

    def list(self, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset.order_by('name')
        serializer = GroupSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



    def create(self, request, *args, **kwargs):
        data = request.data

        # check data validity
        errors = {}
        if not data.get('name'):
            errors['person_id'] = ['This field is required.']
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        # create the group
        group = Group.objects.create(**data)
        serializer =  GroupSerializer(group)
 
        # add the current user as the primary member of the group
        defaultMember  = {'role':'Administrator','group_id':'','person_id':'','added_by_id':''}
        defaultMember['person_id']  = Person.objects.filter(user=request.user.id)[:1][0].id        
        defaultMember['group_id'] = serializer.data['id']
        defaultMember['added_by_id'] =request.user.id
        defaultMember = GroupMember.objects.create(**defaultMember)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @api_view(['POST'])
    def delete(request , *args, **kwargs):
        ids = request.data["ids"]
        organization_id = request.data["org"]
        groups = Group.objects.filter(organization_id = organization_id).filter(id__in=ids).delete()
        groups_data = Group.objects.filter(organization_id = organization_id)
        serializer =  GroupSerializer(groups_data,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GroupItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data

        # count number of members
        data['count_members'] = GroupMember.objects.filter(group=instance).count()
        print('Counted members:')
        print(data)

        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)




class GroupMembersView(generics.ListCreateAPIView): 
    serializer_class = GroupMemberSerializer
    lookup_url_kwarg = "group"

    def get_queryset(self):
        group = self.kwargs.get('group')

        queryset = GroupMember.objects.filter(group=group)

        # filter results
        filters = self.request.GET.get('filter')
        if filters:
            filters = json.loads(filters);

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

        serializer = GroupMemberSerializer(queryset, many=True)
        members = serializer.data
        return Response(members, status=status.HTTP_200_OK)


    def create(self, request, *args, **kwargs):

        # remember who added this member
        user = request.user
        person = Person.objects.filter(user=user.id)[:1][0]

        # set the member data
        data = request.data
        data['group_id'] = self.kwargs.get('group')
        data['added_by_id'] = person.id

        # check data validity
        errors = {}
        if not data.get('person_id'):
            errors['person_id'] = ['This field is required.']
        
        if not data.get('group_id'):
            errors['group_id'] = ['This field is required.']

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        # check if this person is already part of the group
        memberExists = GroupMember.objects.filter(person=data['person_id'],group=data['group_id']).count()
        if memberExists:
            return Response({'message':'This person is already a member of the group.'}, status=status.HTTP_400_BAD_REQUEST )

        groupMember = GroupMember.objects.create(**data)
        serializer =  GroupMemberSerializer(groupMember)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @api_view(['POST'])
    def delete(request , group, *args, **kwargs):
        ids = request.data["ids"]
        group_members = GroupMember.objects.filter(id__in=ids).delete()
        return Response({'success':'true'}, status=status.HTTP_200_OK)



class GroupMemberItemView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GroupMemberSerializer
    queryset = GroupMember.objects

    def update(self,request, group, *args, **kwargs):

        data = request.data;
        if 'id' in data:
            id = data['id']
            role = data['role']
            join_date = data['join_date']
            groupMember = GroupMember.objects.get(pk=id)
            groupMember.join_date=join_date
            groupMember.role = role
            groupMember.save()

            serializer =  GroupMemberSerializer(groupMember)
            return Response(serializer.data, status=status.HTTP_200_OK)


    def delete(self, request, group, member_id, *args, **kwargs):
        GroupMember.objects.get(pk=member_id).delete()
        return Response({ 'success':'true'}, status=status.HTTP_200_OK)




class FileUploadView(views.APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request, filename='input.jpg', format=None):
        file = request.FILES['file']
        print( request );

        fs = FileSystemStorage()
        fs.save(settings.FILE_UPLOAD_DIR + '/upload.jpg', file)
        # do some stuff with uploaded file
        return Response(status=204)


    def put(self, request, filename, format=None):
        file_obj = request.FILES['file']
        # do some stuff with uploaded file
        return Response(status=204)

    """
    A simple ViewSet for listing or retrieving users.
    """
    # def list(self, request):
    #     queryset = Group.objects.all()
    #     serializer = GroupSerializer(queryset, many=True)
    #     return Response(serializer.data)

    # def retrieve(self, request, pk=None):
    #     queryset = User.objects.all()
    #     item = get_object_or_404(queryset, pk=pk)
    #     serializer = GroupSerializer(item)
    #     return Response(serializer.data)


#####Sort groups as per filter######
class GroupsSortListView(generics.ListCreateAPIView): 
    serializer_class = GroupSerializer
    lookup_url_kwarg = "organization","filter_name"

    def get_queryset(self):

        filter_name = self.kwargs.get('filter_name')
        organization_id  = self.kwargs.get('organization')
        groups = Group.objects.filter(organization=organization_id).order_by(filter_name)
        return groups