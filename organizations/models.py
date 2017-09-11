from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify
from core.models import CreatedModifiedMixin
from people.models import Person

class Organization(models.Model, CreatedModifiedMixin):
    SIZE_NONE = 0
    SIZE_2TO10 = 1
    SIZE_11TO50 = 2
    SIZE_51TO100 = 3
    SIZE_101TO250 = 4
    SIZE_251ORMORE = 5
    SIZE_CHOICES = (
        ("", '-- select --'),
        (SIZE_2TO10, '2-10 people'),
        (SIZE_11TO50, '11-50 people'),
        (SIZE_51TO100, '51-100 people'),
        (SIZE_101TO250, '101-250 people'),
        (SIZE_251ORMORE, '251 people or more')
    )
    
    prepopulated_fields = {"slug": ("name")}
    
    name       = models.CharField(max_length=255,null=False)
    slug        = models.SlugField(max_length=255,allow_unicode=True,blank=True)
    description = models.TextField(blank=True,null=True)
    size        = models.PositiveSmallIntegerField(choices=SIZE_CHOICES,blank=True,null=True)
    
    email = models.CharField(max_length=64,null=True,blank=True)
    telephone = models.CharField(max_length=64,null=True,blank=True)


    address      = models.CharField(max_length=255,null=True,blank=True)
    municipality = models.CharField(max_length=64,null=True,blank=True)
    region       = models.CharField(max_length=64,null=True,blank=True)
    postcode     = models.CharField(max_length=16,null=True,blank=True)
    country      =  models.CharField(max_length=64,null=True,blank=True)

    
    owner       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    
    def save(self, *args, **kwargs):
           self.slug = slugify(self.name)
           super().save(*args, **kwargs)
           
    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

class OrganizationMember(models.Model, CreatedModifiedMixin):
    organization    = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=False, null=False)
    person          = models.ForeignKey(Person, on_delete=models.CASCADE, blank=False, null=False)
    role            = models.CharField(max_length=16,null=False,blank=True,default='member')
    join_date       = models.DateTimeField(blank=True,null=True,auto_now_add=True)
    involvement     = models.IntegerField(null=False,blank=False,default=1)
    added_by        = models.ForeignKey(Person, on_delete=models.SET_NULL, blank=True, null=True, related_name='OrganizationMembers_added')

class OrganizationProfile(models.Model, CreatedModifiedMixin):
    organization    = models.ForeignKey(Organization, on_delete=models.CASCADE)
    # field_group     = models.CharField(max_length=64,null=False,blank=False)
    field           = models.CharField(max_length=64,null=False,blank=False)
    value           = models.TextField(null=True,blank=True)



