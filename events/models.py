from django.db import models
from groups.models import Group
from organizations.models import Organization
from people.models import Person
from core.models import CreatedModifiedMixin

# Create your models here.
class Event(CreatedModifiedMixin):
    group           = models.ForeignKey(Group,  on_delete=models.CASCADE, blank=True, null=True)
    organization    = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=False, null=False)

    name			= models.CharField(max_length=64,null=False,blank=False) 
    description     = models.TextField(null=True,blank=True)
    location		= models.CharField(max_length=128,null=False,blank=False) 

    start_date      = models.DateField(auto_now=False,blank=False,null=False)
    end_date        = models.DateField(auto_now=False,blank=True,null=True)

    start_time      = models.TimeField(blank=True,null=True)
    end_time        = models.TimeField(blank=True,null=True)

    visibility      = models.IntegerField(blank=True,null=False,default=1)

    class Meta:
        abstract = False

class Guest(CreatedModifiedMixin):
    event 			= models.ForeignKey(Event,  on_delete=models.CASCADE, blank=False, null=False)
    person			= models.ForeignKey(Person, on_delete=models.CASCADE, blank=True, null=True)
    status			= models.IntegerField(blank=True, null=False, default=1)
    # -1 - Declined, 1 - Invited, 2 - Interested, 3 - Attending, 4 - Attended

    response_time   = models.DateTimeField(auto_now=False,blank=True,null=True)

    class Meta:
        abstract = False






