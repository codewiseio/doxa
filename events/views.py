from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response

from events.models import Event
from events.serializers import EventSerializer

from django.db.models import Q

# Create your views here.
################Sort Events#######################
class SortEventListView(generics.ListCreateAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        organization = self.kwargs.get('organization')
        sort_filter = self.kwargs.get('filter_name')
        items = Event.objects.filter(organization=organization).order_by(sort_filter)
        return items


class EventListView(generics.ListCreateAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        organization = self.kwargs.get('organization')
        if organization:
            items = Event.objects.filter(organization=organization)
        else:
        	items = Event.objects.filter()
        return items

    def list(self, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset.order_by('name')
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):

        data = request.data
        errors = {}

        if not data.get('name'):
            errors['name'] = ['This field is required.']
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        event = Event.objects.create(**data)
        serializer =  EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class EventItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data

        # count number of items
        data['count_invited'] = EventInvitations.objects.filter(event=instance, status='invited').count()
        data['count_attending'] = EventInvitations.objects.filter(event=instance, status='attending').count()
        data['count_declined'] = EventInvitations.objects.filter(event=instance, status='declined').count()
        data['count_attended'] = EventInvitations.objects.filter(event=instance, status='declined').count()

        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
