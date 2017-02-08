from rest_framework import permissions, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from foo.models import FooBar
from foo.serializers import FooBarSerializer


class FooViewSet(viewsets.ModelViewSet):
    queryset = FooBar.objects.order_by('id')
    serializer_class = FooBarSerializer

    