from rest_framework import serializers

from events.models import Event, Guest
from people.serializers import PersonSerializer


class EventSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Event

        fields = ('id','organization', 'group', 'location', 'name', 'description', 'visibility','start_time','start_date','end_time','end_date')
        read_only_fields = ['id']

    def perform_create(self, serializer):
        print( self.request );
        serializer.save()

    def to_representation(self,value):
        rep = super().to_representation(value)
        rep['__entity__'] = 'event';
        return rep

class GuestSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    person = PersonSerializer()

    class Meta:
        model = Guest

        fields = ('id','event','person','status','response_time')
        read_only_fields = ['id']

    def perform_create(self, serializer):
        print( self.request );
        serializer.save()


