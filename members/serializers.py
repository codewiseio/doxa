from rest_framework import serializers

from authentication.serializers import UserSerializer
from members.models import Member
from people.models import Person
from people.serializers import PersonSerializer
from core.models import Entity
from organizations.models import Organization, OrganizationMember
from organizations.serializers import OrganizationSerializer


class MemberSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    person = PersonSerializer

    class Meta:
        model = OrganizationMember

        fields = ('id','organization','person','role','join_date')
        read_only_fields = ['id']

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(MemberSerializer, self).get_validation_exclusions()
        return exclusions

    # def update(self, instance, validated_data):
    #     print('Updating in serializer');
    #     # instance.owner = validated_data.get('owner', instance.owner)
    #     # print(instance.owner);

    #     # instance.content = validated_data.get('content', instance.content)
    #     # instance.created = validated_data.get('created', instance.created)
    #     return instance

