from rest_framework import serializers

from authentication.serializers import UserSerializer
from members.models import Member
from people.models import Person
from people.serializers import PersonSerializer
from core.models import Entity
from organizations.models import Organization
from organizations.serializers import OrganizationSerializer


class EntityManager():


    def inflate(moniker):
        class_map = {
            'person' : (Person, PersonSerializer),
            'organization': (Organization, OrganizationSerializer)
        }

        type, id = moniker.split(':')
        object = class_map[type][0].objects.get(id=id);


        serializer = class_map[type][1](object);

        return serializer.data;

class EntityField(serializers.Field):
    """
    Entities are serliazed into their moniker respresentation
    """
    def to_representation(self, moniker):
        return EntityManager.inflate(moniker)

    def to_internal_value(self, obj):
        if isinstance(obj, Person):
            return obj.moniker();
        else:
            return obj;


        


class MemberSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    # owner = EntityField()
    # entity = EntityField()

    class Meta:
        model = Member

        fields = ('id','owner','entity','role','join_date')
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

