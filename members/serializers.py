from rest_framework import serializers

from authentication.serializers import UserSerializer

from members.models import Member
from people.models import Person
from people.serializers import PersonSerializer


from organizations.models import Organization, OrganizationMember
from organizations.serializers import OrganizationSerializer


class MemberSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    person = PersonSerializer

    class Meta:
        model = OrganizationMember

        fields = ('id','organization','group','event','person','involvement','role','join_date')
        read_only_fields = ['id']

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(MemberSerializer, self).get_validation_exclusions()
        return exclusions
