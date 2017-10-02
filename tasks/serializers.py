from rest_framework import serializers

from .models import Task, Assignee
from people.serializers import PersonSerializer

class AssigneeSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    person = PersonSerializer(read_only=True)

    class Meta:
        model = Assignee


        fields = ('id','task','person','completed')
        read_only_fields = ['id']

    def perform_create(self, serializer):
        print( self.request );
        serializer.save()



class TaskSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    assignees = AssigneeSerializer(many=True, read_only=True)
    count_assigned = serializers.SerializerMethodField(read_only=True, required=False)
    count_completed = serializers.SerializerMethodField(read_only=True, required=False)


    class Meta:
        model = Task

        fields = ('id','assignees','organization', 'group', 'event', 'owner', 'label', 'bullet_points', 'due_date', 'max_assignees','accept_volunteers', 'archived',
            'count_assigned','count_completed')
        read_only_fields = ['id']

    def to_representation(self,value):
        rep = super().to_representation(value)
        rep['bullet_points'] = rep['bullet_points'].split("\n")  if rep.get('bullet_points')  else []
        return rep

    def perform_create(self, serializer):
        print( self.request );
        serializer.save()

    def get_count_assigned(self, obj):
        return obj.assignees.count()

    def get_count_completed(self, obj):
        return obj.assignees.filter(completed=True).count()



