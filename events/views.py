from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response

from events.models import Event
from events.serializers import EventSerializer

from django.db.models import Q
from rest_framework.decorators import  api_view
from django.db import transaction
import sys
import json

# Create your views here.
class EventListView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    lookup_url_kwarg = "organization"

    def get_queryset(self):
        organization = self.kwargs.get('organization')
        queryset = Event.objects.filter(organization=organization)

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
        serializer = EventSerializer(queryset, many=True)
        items = serializer.data
        return Response(items, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        print('data',data)
        errors = {}
        if not data.get('name'):
            errors['name'] = ['Event name  is required.']
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        if not data.get('start_date'):
            errors['name'] = ['Event Start Date  is required.']
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        if not data.get('start_time'):
            errors['name'] = ['Event Start Time  is required.']
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        start_date = data['start_date'].split('T')[0]
        start_date_split=start_date.split('-')
        start_date_year = start_date_split[0]
        start_date_month = start_date_split[1]
        start_date_day = int(start_date_split[2])
        final_start_date = str(start_date_year)+'-'+str(start_date_month)+'-'+str(start_date_day)
        try:
            end_date = data['end_date'].split('T')[0]
            try:
                end_time = data['end_time']
            except Exception as e:
                errors['name'] = ['End Time  is required with End Date.']
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            end_date_split=end_date.split('-')
            end_date_year = end_date_split[0]
            end_date_month = end_date_split[1]
            end_date_day = int(end_date_split[2])
            final_end_date = str(end_date_year)+'-'+str(end_date_month)+'-'+str(end_date_day)
        except Exception as e:
            final_end_date = None
        print('final',final_start_date,final_end_date)
        data['start_date'] = final_start_date
        data['end_date'] = final_end_date
        

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
        # data['count_invited']   = EventInvitations.objects.filter(event=instance, status='invited').count()
        # data['count_attending'] = EventInvitations.objects.filter(event=instance, status='attending').count()
        # data['count_declined']  = EventInvitations.objects.filter(event=instance, status='declined').count()
        # data['count_attended']  = EventInvitations.objects.filter(event=instance, status='attended').count()

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
        errors={}
        if not data.get('name'):
            errors['name'] = ['Event name  is required.']
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        if not data.get('start_date'):
            errors['name'] = ['Event Start Date  is required.']
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        if not data.get('start_time'):
            errors['name'] = ['Event Start Time  is required.']
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        start_date = data['start_date'].split('T')[0]
        start_date_split=start_date.split('-')
        start_date_year = start_date_split[0]
        start_date_month = start_date_split[1]
        start_date_day = int(start_date_split[2])
        final_start_date = str(start_date_year)+'-'+str(start_date_month)+'-'+str(start_date_day)
        try:
            end_date = data['end_date'].split('T')[0]
            try:
                end_time = data['end_time']
            except Exception as e:
                errors['name'] = ['End Time  is required with End Date.']
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            end_date_split=end_date.split('-')
            end_date_year = end_date_split[0]
            end_date_month = end_date_split[1]
            end_date_day = int(end_date_split[2])
            final_end_date = str(end_date_year)+'-'+str(end_date_month)+'-'+str(end_date_day)
        except Exception as e:
            final_end_date = None
        print('final',final_start_date,final_end_date)
        data['start_date'] = final_start_date
        data['end_date'] = final_end_date

        if 'id' in data:
            event = Event.objects.get(pk=pk)
            serializer =  EventSerializer(event)
            return Response(serializer.data, status=status.HTTP_200_OK)


