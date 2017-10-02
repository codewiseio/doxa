from django.db import models
from core.models import CreatedModifiedMixin

from organizations.models import Organization
from people.models import Person
from groups.models import Group

# Create your models here.
class Member(CreatedModifiedMixin):
	organization = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=True, null=True)
	group  		 = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True)

	person       = models.ForeignKey(Person, on_delete=models.CASCADE, blank=False, null=False)
	role   		 = models.IntegerField(null=False,blank=False,default=0)
	involvement  = models.IntegerField(null=False,blank=False,default=0)
	join_date 	 = models.DateTimeField(auto_now=True,blank=True,null=True)

	class Meta:
		abstract = False


