from django.shortcuts import render
from django.http import HttpResponse

from .forms import RegisterOrganizationForm, RegisterUserForm

# Create your views here.
def home(request):
    context = {  }
    return render( request, 'core/home.html', context )

# Registration Page
def register(request):
    
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = RegisterOrganizationFormForm(request.POST)
        
        # check whether it's valid:
        if form.is_valid():
            return HttpResponseRedirect('/thanks/')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = RegisterOrganizationForm()

    context = { 'organization_form': form }
    return render( request, 'core/register.html', context )