from django.shortcuts import render
from django.db import transaction
from django.db.models import Count

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import  api_view
import sys
import json
from .models import Task, Assignee
from .serializers import TaskSerializer, AssigneeSerializer

from datetime import datetime, timedelta


# Create your views here.
class TasksListView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        organization = self.kwargs.get('organization')
        queryset = Task.objects.filter(organization=organization).annotate(assignees_count=Count('assignees'))


        return self.filter_queryset(queryset)

    def filter_queryset(self, queryset):
        filters = self.request.GET.get('filter')

        # thaw filters
        if filters:
            filters = json.loads(filters);
        else:
            filters = {}

        # handle "query" requests for searching
        query = self.request.GET.get('query')
        if query:
            filters['search'] = query

        # filter on organiation
        # if filters.get('organization'):
        #     queryset = queryset.filter(organization=filters.get('organization'))

        # filter on event
        if filters.get('event'):
            queryset = queryset.filter(event=filters.get('event'))

        # filter on group
        if filters.get('group'):
            queryset = queryset.filter(event=filters.get('group'))

        # filter archived/not archived
        filter_archived = filters.get('archived')
        if filter_archived != None:
            queryset = queryset.filter(archived=filter_archived)
        if not filter_archived:
            threedaysago = datetime.now()-timedelta(days=3)
            queryset = queryset.filter(due_date__gte=threedaysago)

            

        # handle searching
        if filters:
            if filters.get('search'):
                print('Searching with query.');
                searchString = filters.get('search')
                queryset = queryset.filter(label__icontains=searchString)

        # handle sorting
        sortOrder = self.request.GET.get('sortOrder','due_date')
        if sortOrder:

            queryset = queryset.order_by(sortOrder)


        return queryset


    def list(self, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        for item in queryset.all():
            print( item.assignees_count) 
            
        serializer = self.get_serializer(queryset, many=True)
        items = serializer.data

        # print(items)




        return Response(items, status=status.HTTP_200_OK)


    # create a new record
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        print(data)

        # transform entity to id
        for entity_type in ('event','group','organization'):
            if entity_type in data.keys():
                entity = data.get(entity_type)
                if entity:
                    data[entity_type + '_id'] = entity['id'] if isinstance(entity, dict) else entity

                data.pop(entity_type)

        # remove assignee data to prevent database errors
        assignees = []
        if 'assignees' in data.keys():
            assignee_data = data.pop('assignees')
        else:
            assignee_data = []

        # transform bullet points from list to string
        if 'bullet_points' in data.keys():
            data['bullet_points'] = "\n".join(data.get('bullet_points'))

        # create the object instance
        instance = Task.objects.create(**data)

        # create the assignee records
        for a in assignee_data:

            # remove task item from data
            if 'task' in a.keys():
                # a['task_id'] = a['task']['id'] if isinstance(a['task'], dict) else task
                a.pop('task')

            a['task_id'] = instance.id
            a['person_id'] = a['person']['id']
            a.pop('person')
            assignee = Assignee.objects.create(**a)

        # serialize the data
        serializer =  self.get_serializer(instance)
        return_data = serializer.data

        # return a response
        return Response(serializer.data, status=status.HTTP_201_CREATED)





class TaskItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # get a representation of the instance in order to re-create via undo
        serializer = self.get_serializer(instance)
        data = serializer.data

        # destroy the record
        self.perform_destroy(instance)

        # provide response
        return Response(serializer.data, status=status.HTTP_200_OK)


    @transaction.atomic
    def update(self,request, pk, *args, **kwargs):
        data = request.data;

        print(data)

        # transform bullet points from list to string
        if 'bullet_points' in data.keys():
            data['bullet_points'] = "\n".join(data.get('bullet_points'))
        
        # remove assignee data from task data
        assignees = []
        if 'assignees' in data.keys():
            assignee_data = data.pop('assignees')
        else:
            assignee_data = []

        # determine which assignees are no longer in the list
        current_assignees = []
        current_assignee_ids = []
        for a in assignee_data:
            if a.get('id'):
                current_assignees.append(a)
                current_assignee_ids.append(a['id'])

        # delete all assignees which are no longer in the list
        Assignee.objects.filter( task_id=data['id'] ).exclude(id__in=current_assignee_ids).delete()

        # add all new assignees 
        for a in assignee_data:
            if not a.get('id'):
                a['task_id'] = data['id']
                a['person_id'] = a['person']['id']
                if a.get('task'):
                    a.pop('task')
                a.pop('person')
                assignee = Assignee.objects.create(**a)
                print('New assignee')
                print(a)

        # update all other assignees
        # for a in current_assignees:
        #     Assignee.objects.filter(pk=a['id']).update(**a)

        # update task object
        Task.objects.filter(pk=pk).update(**data)

        # return the instance
        instance = self.get_object()
        serializer =  self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssigneeItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignee.objects.all()
    serializer_class = AssigneeSerializer

# Create your views here.
class AssigneesListView(generics.ListCreateAPIView):
    queryset = Assignee.objects.all()
    serializer_class = AssigneeSerializer

    def create(self, request, *args, **kwargs):


        data = request.data
        taskid = self.kwargs.get('taskid')

        if isinstance(data, dict):
            instance = Assignee.objects.create(**data)
            instance.save();
        else:
            instance = Assignee.objects.create(task_id=taskid,person_id=data)
            instance.save();

        

        print('Create assignee');
        print(data)

        

        print(instance)

        # serialize the data
        serializer =  self.get_serializer(instance)

        # return a response
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # def update(self,request, pk, *args, **kwargs):
    #     data = request.data;
    #     self.queryset.objects.filter(pk=pk).update(**data)
    #     instance = self.get_object()
    #     serializer =  self.get_serializer(instance)
    #     return Response(serializer.data, status=status.HTTP_200_OK)



# class GuestListView(generics.ListAPIView):
#     serializer_class = GuestSerializer
#     lookup_url_kwarg = "event"

#     def get_queryset(self):
#         pk = self.kwargs.get('pk')

#         event = Event.objects.get(pk=pk);
#         queryset = Guest.objects.filter(event=event.id)

#         sortOrder = self.request.data.get('sortOrder', 'person__first_name')
#         if sortOrder:
#             queryset = queryset.order_by(sortOrder)

#         return queryset

#     def list(self, *args, **kwargs):
#         queryset = self.filter_queryset(self.get_queryset())
#         serializer = GuestSerializer(queryset, many=True)
#         items = serializer.data
#         return Response(items, status=status.HTTP_200_OK)

# class GuestItemView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Guest.objects.all()
#     serializer_class = GuestSerializer

#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
#         return Response( serializer.data )

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         self.perform_destroy(instance)
#         return Response(status=status.HTTP_204_NO_CONTENT)



# class GuestInviteView(generics.ListCreateAPIView):
#     serializer_class = OrganizationMemberSerializer
#     lookup_url_kwarg = "organization"

#     def get_queryset(self):
#         pk = self.kwargs.get('pk')

#         event = Event.objects.get(pk=pk);

#         # exclude already invited guests
#         guests = Guest.objects.filter(event=pk)
#         people = []
#         for guest in guests:
#             people.append( guest.person )

#         queryset = OrganizationMember.objects.filter(organization=event.organization).exclude(person__in=people)

#         sortOrder = self.request.data.get('sortOrder', 'person__first_name')
#         if sortOrder:
#             queryset = queryset.order_by(sortOrder)

#         return queryset

#     def list(self, *args, **kwargs):
#         queryset = self.filter_queryset(self.get_queryset())



#         serializer = OrganizationMemberSerializer(queryset, many=True)
#         items = serializer.data
#         return Response(items, status=status.HTTP_200_OK)

#     def create(self, request, *args, **kwargs):
#         event = self.kwargs.get('pk')
#         people = request.data.get('people')
#         guest_status = 2
 
#         for id in people:
#             guest = Guest(event_id=event,person_id=id,status=guest_status)
#             guest.save()

#         word = 'person' if len(people) == 1 else 'people'
#         response = {
#             "message": "Invited {} {}".format(len(people), word )
#         }

#         return Response(response, status=status.HTTP_201_CREATED)