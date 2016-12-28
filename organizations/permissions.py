from rest_framework import permissions


# TODO: Perform real permissions check
class IsAdministratorOfOrganization(permissions.BasePermission):
    def has_object_permission(self, request, view, post):
        if request.user:
            return True
        return False