from rest_framework import serializers

from authentication.serializers import UserSerializer

from members.models import Member
from people.models import Person
from people.serializers import PersonSerializer



class MemberSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    person = PersonSerializer

    class Meta:
        model = Member

        fields = ('id','organization','group','person','involvement','role','join_date')
        read_only_fields = ['id']

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(MemberSerializer, self).get_validation_exclusions()
        return exclusions
