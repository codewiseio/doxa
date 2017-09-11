from django.db import models
from core.models import CreatedModifiedMixin

from organizations.models import Organization
from people.models import Person
from events.models import Event

# Create your models here.
class Member(models.Model, CreatedModifiedMixin):
	organization = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=True, null=True)
	# group  		 = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=False)
	# event		 = models.ForeignKey(Event, on_delete=models.CASCADE, blank=True, null=False)

	person       = models.ForeignKey(Person, on_delete=models.CASCADE, blank=False, null=False)
	role   		 = models.CharField(max_length=64,null=True,blank=True)
	involvement  = models.IntegerField(null=False,blank=False,default=0)
	join_date 	 = models.DateTimeField(auto_now=True,blank=True,null=True)


