from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify
from core.models import CreatedModifiedMixin
from doxa.exceptions import StorageException




# Create your models here.# Create your models here.
from django.db import models
import inspect


class Contact(models.Model, CreatedModifiedMixin):    
    
    owner = models.CharField(max_length=64,null=True,blank=True) 
    
    kind = models.CharField(max_length=32,null=True,blank=True) 
    label = models.CharField(max_length=64,null=True,blank=True)
    type = models.CharField(max_length=32,null=True,blank=True)
    subtype = models.CharField(max_length=32,null=True,blank=True)
    primary = models.BooleanField(blank=True,default=False)
    
    data1 = models.CharField(max_length=64,null=True,blank=True)
    data2 = models.CharField(max_length=64,null=True,blank=True)
    data3 = models.CharField(max_length=64,null=True,blank=True)
    data4 = models.CharField(max_length=64,null=True,blank=True)
    data5 = models.CharField(max_length=64,null=True,blank=True)
    data6 = models.CharField(max_length=64,null=True,blank=True)
    data7 = models.CharField(max_length=64,null=True,blank=True)
    data8 = models.CharField(max_length=64,null=True,blank=True)
    data9 = models.CharField(max_length=64,null=True,blank=True)
    data10 = models.TextField(blank=True,null=True)
    
    def serialize(self):
        data = {
            'id':self.id,
            'owner':self.owner,
            'label':self.label,
            'type':self.type,
            'subtype':self.subtype,
            'primary':self.primary,
            'kind':self.kind
        }
        
        if self.kind == 'postaddress':
            data['street'] = self.data1
            data['municipality'] = self.data2
            data['region'] = self.data3
            data['postcode'] = self.data4
            data['country'] = self.data5
        elif self.kind == 'telephone':
            data['address'] = self.data1
        elif self.kind == 'email':
            data['address'] = self.data1
            
        return data
    
    
            
               
    def __str__(self):
        return "<Contact: {} {}>".format(self.owner, self.kind)
    