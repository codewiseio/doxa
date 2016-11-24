from django.conf.urls import include, url
from django.contrib import admin
from core import views
from .views import IndexView

from rest_framework_nested import routers
from authentication.views import LoginView,UserViewSet

router = routers.SimpleRouter()
router.register(r'users', UserViewSet )

urlpatterns = [
    url(r'^kubernesis/', admin.site.urls),
    url(r'^api/v1/',include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^.*$',IndexView.as_view(), name='index')
]
