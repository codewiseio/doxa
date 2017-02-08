from rest_framework import serializers

from authentication.serializers import UserSerializer
from organizations.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Organization

        fields = ('id','title','description','size','owner')
        read_only_fields = ['id']

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(OrganizationSerializer, self).get_validation_exclusions()

        return exclusions + ['author']