from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response

from events.models import Event
from events.serializers import EventSerializer

from django.db.models import Q
from rest_framework.decorators import  api_view
from django.db import transaction

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
        print('data',data)
        ####Get Start and End time########
        start_time = data['start_time'].split('T')[1]
        end_time = data['end_time'].split('T')[1]
        print('start',start_time,end_time)
        ###########Ends here##############
        start_date = data['start_date'].split('T')[0]
        start_date_split=start_date.split('-')
        start_date_year = start_date_split[0]
        start_date_month = start_date_split[1]
        start_date_day = int(start_date_split[2])
        final_start_date = str(start_date_year)+'-'+str(start_date_month)+'-'+str(start_date_day)
        end_date = data['end_date'].split('T')[0]
        end_date_split=end_date.split('-')
        end_date_year = end_date_split[0]
        end_date_month = end_date_split[1]
        end_date_day = int(end_date_split[2])
        final_end_date = str(end_date_year)+'-'+str(end_date_month)+'-'+str(end_date_day)
        print('final',final_start_date,final_end_date)
        data['start_date'] = final_start_date
        data['end_date'] = final_end_date
        data['start_time'] = start_time
        data['end_time'] = end_time
        errors = {}

        if not data.get('name'):
            errors['name'] = ['This field is required.']
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        event = Event.objects.create(**data)
        serializer =  EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @api_view(['POST'])
    def delete(request , *args, **kwargs):
        ids = request.data["ids"]
        organization_id = request.data["org"]
        events = Event.objects.filter(organization_id = organization_id).filter(id__in=ids).delete()
        events_data = Event.objects.filter(organization_id = organization_id)
        serializer =  EventSerializer(events_data,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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


    @transaction.atomic
    def update(self,request, pk, *args, **kwargs):

        # partial = kwargs.pop('partial', False)
        print("pk is")
        print(pk)

        data = request.data;
        print('data',data)
        start_time = data['start_time'].split('T')[1]
        end_time = data['end_time'].split('T')[1]
        data['start_time'] = start_time
        data['end_time'] = end_time
        if 'id' in data:
            event = Event.objects.get(pk=pk)
            Event.objects.filter(pk=pk).update(**data)
            events_data = Event.objects.filter(organization_id = data['organization'])
            serializer =  EventSerializer(events_data,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)