from rest_framework import serializers

from groups.models import Group, GroupMember
from people.serializers import PersonSerializer

class GroupSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Group

        fields = ('id','organization_id', 'name','description','meeting_times','meeting_location')
        read_only_fields = ['id']

    def perform_create(self, serializer):
        print( self.request );
        serializer.save()

class GroupMemberSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    person = PersonSerializer()
    added_by = PersonSerializer()

    class Meta:
        model = GroupMember

        fields = ('id','group','person','role','involvement','join_date','added_by')
        read_only_fields = ['id']

