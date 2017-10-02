from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify


class CreatedModifiedMixin(models.Model):
    created = models.DateTimeField(auto_now_add=True,blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True,null=True, related_name='created_%(class)s')
    
    modified = models.DateTimeField(auto_now=True,blank=True)
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True,null=True, related_name='modified_%(class)s')

    class Meta:
        abstract = True