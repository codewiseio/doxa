from django.db import models
from core.models import Entity, CreatedModifiedMixin

# Create your models here.
class Person (models.Model, CreatedModifiedMixin):
    first_name = models.CharField(max_length=32,null=False,blank=False)
    middle_name = models.CharField(max_length=32,null=True,blank=True)
    last_name = models.CharField(max_length=255,null=True,blank=True)
    
    gender = models.CharField(max_length=255,null=True,blank=True,)
    marital_status = models.CharField(max_length=32,null=True,blank=True)
    number_of_children =  models.PositiveSmallIntegerField(blank=True,null=True)
    
    birthday = models.DateTimeField(blank=True,null=True)

    def moniker(self):
        '{}:{}'.format(self.entity_type, self.id)
    