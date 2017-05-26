from django.conf.urls import include, url
from django.contrib import admin
from core import views
from .views import IndexView

from rest_framework_nested import routers
from authentication.views import LoginView,LogoutView,UserViewSet, UserView
from registration.views import RegisterView

from members.views import MemberItemView, MembersListView

from organizations.views import OrganizationViewSet, OrganizationMembersView
from groups.views import GroupViewSet, GroupMembersView, FileUploadView

router = routers.SimpleRouter()
# router.register(r'users', UserViewSet )
# router.register(r'members', MemberViewSet )
router.register(r'groups', GroupViewSet )
router.register(r'organizations', OrganizationViewSet )
# router.register(r'members', MemberViewSet )

urlpatterns = [
    url(r'^kubernesis/', admin.site.urls),

    url(r'^api/v1/',include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/v1/users/(?P<pk>\d+)/$', UserView.as_view(), name='users'),
    url(r'^api/v1/register/$', RegisterView.as_view(), name='register'),


    url(r'^api/v1/organizations/(?P<organization>\d+)/members/$', OrganizationMembersView.as_view(), name="organizationMembers" ),
    url(r'^api/v1/groups/(?P<group>\d+)/members/$', GroupMembersView.as_view(), name="groupMembers" ),
    
    url(r'^api/v1/member/(?P<pk>\d+)/$', MemberItemView.as_view(), name="member"),
    url(r'^api/v1/members/$', MembersListView.as_view(), name="members" ),
    # url(r'^api/v1/members/(?P<pk>\d+)/$', MembersItemView.as_view(), name='membersItem'),
    # url(r'^api/v1/members/(?P<owner>\w+:\d+)/$', MembersListView.as_view(), name='membersList'),

    url(r'^api/v1/upload/$', FileUploadView.as_view(), name="upload"),

    url(r'^.*$',IndexView.as_view(), name='index')
]
