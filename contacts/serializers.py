from rest_framework import serializers

from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Contact

        fields = ['moniker','kind','type','subtype','primary','data1','data2','data3','data4','data5','data6','data7','data8','data9','data10']
        
        read_only_fields = ('id', 'created', 'created_by', 'modified','modified_by')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(OrganizationSerializer, self).get_validation_exclusions()

        return exclusions + ['author']