from django.db import models
from groups.models import Group
from organizations.models import Organization
from people.models import Person
from core.models import CreatedModifiedMixin

# Create your models here.
class Event(models.Model, CreatedModifiedMixin):
    group           = models.ForeignKey(Group,  on_delete=models.CASCADE, blank=True, null=True)
    organization    = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=False, null=False)

    name			= models.CharField(max_length=64,null=False,blank=False) 
    description		= models.CharField(max_length=128,null=False,blank=False)
    location		= models.CharField(max_length=128,null=False,blank=False) 

    start_date		= models.DateField(auto_now=False,blank=False,null=False)
    end_date		= models.DateField(auto_now=False,blank=True,null=True)

    start_time		= models.TimeField(blank=True,null=True)
    end_time		= models.TimeField(blank=True,null=True)

class EventInvitations(models.Model, CreatedModifiedMixin):
	event 			= models.ForeignKey(Event,  on_delete=models.CASCADE, blank=False, null=False)
	person			= models.ForeignKey(Person, on_delete=models.CASCADE, blank=True, null=True)

	status			= models.CharField(max_length=16, blank=True, null=False, default='invited')


