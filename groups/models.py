from django.db import models

from organizations.models import Organization;
from people.models import Person

# Create your models here.
class Group (models.Model ):

    organization     = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=False, null=False)
    name             = models.CharField(max_length=255,null=True,blank=True)
    description      = models.TextField(null=True,blank=True)
    photo            = models.ImageField(upload_to='static/files/images', height_field=None, width_field=None, max_length=100  )
    meeting_times    = models.CharField(max_length=128,null=True,blank=True)
    meeting_location = models.CharField(max_length=128,null=True,blank=True) 

    def moniker(self):
        '{}:{}'.format(self.entity_type, self.id)

    def __unicode__(self):
        return '<group:' + self.name + '>'

    def __str__(self):
        return '<group:' + self.name + '>'

class GroupMember( models.Model  ):

    group           = models.ForeignKey(Group,  on_delete=models.CASCADE, blank=False, null=False)
    person          = models.ForeignKey(Person, on_delete=models.CASCADE, blank=False, null=False)
    role            = models.CharField(max_length=16,null=False,blank=True,default='member')
    involvement     = models.IntegerField(null=False,blank=False,default=1)
    join_date       = models.DateTimeField(blank=True,null=True,auto_now_add=True)
    added_by        = models.ForeignKey(Person, on_delete=models.SET_NULL, blank=True, null=True, related_name='GroupMembers_added')




    