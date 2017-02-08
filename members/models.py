from django.db import models
from core.models import CreatedModifiedMixin
from people.models import Person

# Create your models here.
class Member(models.Model, CreatedModifiedMixin):
    owner  = models.CharField(max_length=64,null=True,blank=True) 
    member = models.CharField(max_length=64,null=True,blank=True)
    role   = models.CharField(max_length=64,null=True,blank=True)
