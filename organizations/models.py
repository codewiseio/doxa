from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify
from core.models import CreatedModifiedMixin

# Create your models here.
from django.db import models

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
    
    prepopulated_fields = {"slug": ("title")}
    
    title = models.CharField(max_length=255,null=False)
    slug = models.SlugField(max_length=255,allow_unicode=True,blank=True)
    description = models.TextField(blank=True)
    size = models.PositiveSmallIntegerField(choices=SIZE_CHOICES,blank=True)
    telephone =  models.CharField(max_length=24,blank=True)
    email = models.EmailField(max_length=64,blank=True)
    address =  models.CharField(max_length=128, verbose_name="Street Address",blank=True)
    address2 =  models.CharField(max_length=128, verbose_name="Street Address 2",blank=True)
    municipality =  models.CharField(max_length=128, verbose_name="Municipality",blank=True)
    region = models.CharField(max_length=128, verbose_name="Region",blank=True)
    postal_code =  models.CharField(max_length=16,verbose_name="Postal Code",blank=True)
    country =  models.CharField(max_length=64,verbose_name="Country",blank=True,null=True)
    
    banner_photo = models.ImageField(blank=True)
    profile_photo = models.ImageField(blank=True)
    
    def save(self, *args, **kwargs):
           self.s = slugify(self.q)
           super(test, self).save(*args, **kwargs)
    def __unicode__(self):
        return self.title
    

    
    
    