from rest_framework import serializers

from authentication.serializers import UserSerializer
from members.models import Member


class MemberSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Member

        fields = ('id','owner','member','role')
        read_only_fields = ['id']

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(MemberSerializer, self).get_validation_exclusions()
        return exclusions