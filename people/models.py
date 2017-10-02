from django.db import models
from core.models import CreatedModifiedMixin
from authentication.models import User
from django.conf import settings


# Create your models here.
class Person (CreatedModifiedMixin):
    title = models.CharField(max_length=16,null=True,blank=True)

    first_name = models.CharField(max_length=32,null=False,blank=False)
    middle_name = models.CharField(max_length=32,null=True,blank=True)
    last_name = models.CharField(max_length=255,null=True,blank=True)
    
    gender = models.CharField(max_length=255,null=True,blank=True,)
    marital_status = models.CharField(max_length=32,null=True,blank=True)
    number_of_children =  models.PositiveSmallIntegerField(blank=True,null=True)
    
    birthday = models.DateTimeField(blank=True,null=True)

    email = models.CharField(max_length=64,null=True,blank=True)
    telephone = models.CharField(max_length=64,null=True,blank=True)


    address      = models.CharField(max_length=255,null=True,blank=True)
    municipality = models.CharField(max_length=64,null=True,blank=True)
    region       = models.CharField(max_length=64,null=True,blank=True)
    postcode     = models.CharField(max_length=16,null=True,blank=True)
    country      =  models.CharField(max_length=64,null=True,blank=True)

    user  = models.ForeignKey(User,  on_delete=models.SET_NULL, blank=True, null=True)

    def moniker(self):
        return '{}:{}'.format(self.entity_type, self.id)

    def __str__(self):
        return '<{} {}>'.format(self.first_name, self.last_name)

    class Meta:
        abstract = False