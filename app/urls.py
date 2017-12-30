from django.conf.urls import url, include
from django.contrib import admin
from django import views

from .views import NotFound404ApiView,XsrfTokenView

from angular.views import IndexView
from django.views.generic import TemplateView



urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/', include('agape.authentication.urls') ),
    url(r'^api/v1/', include('agape.people.urls') ),
    url(r'^api/v1/', include('agape.contacts.urls') ),
    url(r'^api/v1/', include('agape.organizations.urls') ),
    url(r'^api/v1/', include('agape.members.urls') ),
    url(r'^api/v1/xsrf-token/',XsrfTokenView.as_view(), name='xsrf-token'),
    url(r'^api/.*$',NotFound404ApiView.as_view(), name='api-404'),
    url(r'^.*/?$',IndexView.as_view(), name='index'),
]
