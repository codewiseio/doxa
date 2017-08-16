from rest_framework import serializers

from people.models import Person


class PersonSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Person

        fields = (
            'id','title','first_name','middle_name','last_name',
            'gender','marital_status','number_of_children','birthday','user','email','telephone',
            'address','municipality','region','postcode')
        
        read_only_fields = ['id']

