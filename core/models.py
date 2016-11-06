from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify

# Create your models here.
from django.db import models

class CreatedModifiedMixin():
    created = models.DateTimeField(auto_now_add=True,blank=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT)
    modified = models.DateTimeField(auto_now=True,blank=True)
    modified_by = models.ForeignKey(User, on_delete=models.PROTECT, blank=True)

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
    address_line1 =  models.CharField(max_length=128, verbose_name="Street Address",blank=True)
    address_line2 =  models.CharField(max_length=128, verbose_name="Street Address 2",blank=True)
    address_municipality =  models.CharField(max_length=128, verbose_name="Municipality",blank=True)
    address_region = models.CharField(max_length=128, verbose_name="Region",blank=True)
    address_postal_code =  models.CharField(max_length=16,verbose_name="Postal Code",blank=True)
    
    banner_photo = models.ImageField(blank=True)
    profile_photo = models.ImageField(blank=True)
    
    def save(self, *args, **kwargs):
           self.s = slugify(self.q)
           super(test, self).save(*args, **kwargs)
    def __str__(self):
        return self.title
    
class Contact(models.Model,CreatedModifiedMixin):
    MALE = 'm'
    FEMALE = 'f'
    GENDER_CHOICES = (
        ("", '-- select --'),
        (MALE, 'Male'),
        (FEMALE, 'Female')
    )
    
    SINGLE = 1
    MARRIED = 2
    DIVORCED = 3
    WIDOWED = 4
    MARITAL_STATUS_CHOICES = (
        ("", '-- select --'),
        (SINGLE, 'Single'),
        (MARRIED, 'Married'),
        (DIVORCED, 'Divorces/Deparated'),
        (WIDOWED, 'Widowed')
    )
    
    NUMBER_OF_CHILDREN_CHOICES = (
        ("", '-- select --'),
        (1, '1 child'),
        (2, '2 children'),
        (3, '3 children'),
        (4, '4 children'),
        (5, '5 children'),
        (6, '6 children'),
        (7, '7 children or more')
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=False)
    
    title = models.CharField(max_length=255,blank=True)
    first_name = models.CharField(max_length=32,blank=False)
    middle_name = models.CharField(max_length=32,blank=False)
    last_name = models.CharField(max_length=32,blank=False)
    
    gender = models.CharField(max_length=1,blank=True)
    date_of_birth = models.DateField(blank=True)
    
    marital_status = models.PositiveSmallIntegerField(choices=MARITAL_STATUS_CHOICES,blank=True)
    number_of_children = models.PositiveSmallIntegerField(choices=NUMBER_OF_CHILDREN_CHOICES,blank=True)
    spouse = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    
    telephone =  models.CharField(max_length=24,blank=True)
    email = models.EmailField(max_length=64,blank=True)
    address_line1 =  models.CharField(max_length=128, verbose_name="Street Address",blank=True)
    address_line2 =  models.CharField(max_length=128, verbose_name="Street Address 2",blank=True)
    address_municipality =  models.CharField(max_length=128, verbose_name="Municipality",blank=True)
    address_region = models.CharField(max_length=128, verbose_name="Region",blank=True)
    address_postal_code =  models.CharField(max_length=16,verbose_name="Postal Code",blank=True)
    
    banner_photo = models.ImageField(blank=True)
    profile_photo = models.ImageField(blank=True)
    
    
    
    