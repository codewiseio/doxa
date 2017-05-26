from django.shortcuts import render
from rest_framework import status, viewsets, views, generics
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser, FileUploadParser
from groups.models import Group, GroupMember
from groups.serializers import GroupSerializer, GroupMemberSerializer

from django.conf import settings
from django.core.files.storage import FileSystemStorage

from people.models import Person


class GroupViewSet(viewsets.ModelViewSet):

    queryset = Group.objects.order_by('id')
    serializer_class = GroupSerializer


class GroupMembersView(generics.ListCreateAPIView): 
    serializer_class = GroupMemberSerializer
    lookup_url_kwarg = "group"

    def get_queryset(self):
        group = self.kwargs.get('group')
        members = GroupMember.objects.filter(group=group)
        return members


    def list(self, *args, **kwargs):
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
            return Respoonse(errors, status=status.HTTP_400_BAD_REQUEST)

        # check if this person is already part of the group
        memberExists = GroupMember.objects.filter(person=data['person_id'],group=data['group_id']).count()
        if memberExists:
            return Response({'message':'This person is already a member of the group.'}, status=status.HTTP_400_BAD_REQUEST )

        groupMember = GroupMember.objects.create(**data)
        serializer =  GroupMemberSerializer(groupMember)
        return Response(serializer.data, status=status.HTTP_201_CREATED)




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