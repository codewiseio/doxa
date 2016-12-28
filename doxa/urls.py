from django.conf.urls import include, url
from django.contrib import admin
from core import views
from .views import IndexView
from organizations.views import OrganizationViewSet

from rest_framework_nested import routers
from authentication.views import LoginView,LogoutView,UserViewSet

router = routers.SimpleRouter()
router.register(r'users', UserViewSet )
router.register(r'organizations', OrganizationViewSet )

urlpatterns = [
    url(r'^kubernesis/', admin.site.urls),
    url(r'^api/v1/',include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^.*$',IndexView.as_view(), name='index')
]
