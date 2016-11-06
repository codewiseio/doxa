from django.shortcuts import render

# Create your views here.
def index(request):
    return HttpResponse(django.get_version());

