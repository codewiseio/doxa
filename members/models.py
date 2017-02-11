from django.db import models
from core.models import CreatedModifiedMixin
from people.models import Person

# Create your models here.
class Member(models.Model, CreatedModifiedMixin):
    owner  = models.CharField(max_length=64,null=False,blank=False) 
    entity = models.CharField(max_length=64,null=False,blank=False)
    role   = models.CharField(max_length=64,null=True,blank=True)
    join_date = models.DateTimeField(auto_now=True,blank=True,null=True)
