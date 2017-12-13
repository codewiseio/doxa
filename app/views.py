from rest_framework import status,views
from rest_framework.response import Response

class NotFound404ApiView(views.APIView):
    """ Returns a simple 404 message
    
    Extends:
       views.APIView
    """
    
    def get(self,request):
        """ Display 404 message
            
        Returns a json encoded 404 Page Not Found message for api calls.
        """

        return Response({
            'status': 'Not found',
            'message': 'This resource is not available on this server.'
        }, status=status.HTTP_404_NOT_FOUND);

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator


class SwaggerDocView(TemplateView):
    template_name = 'index.html'
    
    @method_decorator(ensure_csrf_cookie)
    def dispatch( self, *args, **kwargs):
        return super(SwaggerDocView, self).dispatch(*args, **kwargs)

