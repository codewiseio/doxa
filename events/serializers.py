from rest_framework import serializers

from events.models import Event


class EventSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Event

        fields = ('id','organization', 'group', 'location', 'name', 'description', 'start_time','start_date','end_time','end_date')
        read_only_fields = ['id']

    def perform_create(self, serializer):
        print( self.request );
        serializer.save()


