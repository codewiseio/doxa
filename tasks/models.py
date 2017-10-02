from django.db import models

# Create your models here.
from django.db import models
from core.models import CreatedModifiedMixin

from organizations.models import Organization
from people.models import Person
from groups.models import Group
from events.models import Event


class Task(CreatedModifiedMixin):

	owner 		 = models.ForeignKey(Person, on_delete=models.SET_NULL, blank=True, null=True)

	organization = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=True, null=True)
	group  		 = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True)
	event        = models.ForeignKey(Event,on_delete=models.CASCADE,blank=True, null=True)

	label		  = models.CharField(max_length=255,null=False,blank=False)
	bullet_points = models.TextField(null=True,blank=True)
	due_date      = models.DateTimeField(null=True,blank=True)

	max_assignees  	  = models.IntegerField(null=False,blank=False,default=0)
	accept_volunteers = models.BooleanField(null=False,blank=True,default=False)

	archived = models.BooleanField(null=False,blank=True,default=False)

	class Meta:
		abstract = False


class Assignee(CreatedModifiedMixin):
	task		 = models.ForeignKey(Task, related_name='assignees', on_delete=models.CASCADE, blank=True, null=False) 
	person       = models.ForeignKey(Person, on_delete=models.CASCADE, blank=True, null=False)
	completed 	 = models.BooleanField(null=False,blank=True,default=False)