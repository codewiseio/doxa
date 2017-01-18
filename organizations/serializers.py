from rest_framework import serializers

from authentication.serializers import UserSerializer
from organizations.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Organization

        fields = ['title','description','size','owner']
        
        read_only_fields = ('id', 'created', 'created_by', 'modified','modified_by')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(OrganizationSerializer, self).get_validation_exclusions()

        return exclusions + ['author']