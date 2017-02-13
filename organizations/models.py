from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify
from core.models import CreatedModifiedMixin

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
    description = models.TextField(blank=True,null=True)
    size = models.PositiveSmallIntegerField(choices=SIZE_CHOICES,blank=True,null=True)
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    
    
    
    def save(self, *args, **kwargs):
           self.slug = slugify(self.title)
           super().save(*args, **kwargs)
           
    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title
    

    
    
    