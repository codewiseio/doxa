from rest_framework import serializers

from foo.models import FooBar


class FooBarSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = FooBar

        fields = ('id','title')
        read_only_fields = ['id']
