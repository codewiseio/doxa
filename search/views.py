from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import  api_view

from events.models import Event
from events.serializers import EventSerializer
from groups.models import Group
from groups.serializers import GroupSerializer

# Create your views here.
class SearchView(generics.ListAPIView):
	serializer_class = None
	filters = {}

	def get_queryset(self):
		return None

	def list(self, *args, **kwargs):

		# get the filters
		filters = self.request.GET.get('filter')
		if filters:
			filters = json.loads(filters);
		else:
			filters = {}

		# handle query argument
		query = self.request.GET.get('query')
		if query:
			filters['search'] = query

		self.filters = filters

		# get the entities to search
		entities = self.request.GET.get('entities')
		if entities:
			entities = json.loads(entities);
		else:
			entities = ['organizations','groups','events','members']


		items = []
		groups = self.list_groups()
		for group in groups:
			group['_entity_'] = 'group'

		events = self.list_events()
		for event in events:
			event['_entity_'] = 'event'

		items.extend(groups)
		items.extend(events)
		items = sorted(items, key=lambda k: k['name']) 

		return Response(items, status=status.HTTP_200_OK)


	def list_groups(self):       
	    queryset = Group.objects.order_by('name')

	    organization = self.kwargs.get('organization')
	    if organization:
	    	queryset = queryset.filter(organization=organization)

	    filters = self.filters
	    if filters.get('search'):
	        searchString = filters.get('search')
	        queryset = queryset.filter(name__icontains=searchString)


	    serializer = GroupSerializer(queryset, many=True)
	    return serializer.data;

	def list_events(self):

	    queryset = Event.objects.order_by('name')

	    organization = self.kwargs.get('organization')
	    if organization:
	    	queryset = queryset.filter(organization=organization)

	    filters = self.filters
	    if filters.get('search'):
	        searchString = filters.get('search')
	        queryset = queryset.filter(name__icontains=searchString)


	    serializer = EventSerializer(queryset, many=True)
	    return serializer.data;


