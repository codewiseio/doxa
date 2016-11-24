from django import forms


from django.forms import ModelForm
from django.contrib.auth import get_user_model
from .models import Organization


# Register Organization
class RegisterOrganizationForm(ModelForm):
    class Meta:
        model = Organization
        fields = ['title', 'size', 'telephone', 'municipality', 'region', 'postal_code', 'country']

# Register User
class RegisterUserForm(ModelForm):
    class Meta:
        User = get_user_model()
        model = User
        fields = ['password', 'email']
        
    