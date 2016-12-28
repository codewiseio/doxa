from rest_framework import serializers

from authentication.serializers import UserSerializer
from organizations.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Organization

        fields = ('title','slug','description','size','telephone','email','address',
                  'address2','municipality','region','postal_code','country',
                  'banner_photo','profile_photo')
        
        read_only_fields = ('id', 'created', 'created_by', 'modified','modified_by')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(OrganizationSerializer, self).get_validation_exclusions()

        return exclusions + ['author']